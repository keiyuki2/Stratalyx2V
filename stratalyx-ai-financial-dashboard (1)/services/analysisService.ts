import { GoogleGenAI, Type } from "@google/genai";
import type { NewsArticle, NewsAnalysisResult, CandlestickData, CandlestickAnalysisResult, CandlestickPredictionResult, StockComparison, PortfolioHealth, PortfolioHolding } from '../types';
import { Language } from '../types';

// This check is to prevent crashing in environments where process.env.API_KEY might not be defined during compilation.
// A valid key must be present at runtime.
const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}
const ai = new GoogleGenAI({ apiKey: apiKey! });

const newsAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: 'A detailed, yet concise summary of the news article, capturing the main points.'
        },
        keyTakeaways: {
            type: Type.ARRAY,
            description: 'A list of the most important bullet points or takeaways from the article.',
            items: { type: Type.STRING }
        },
        impactedStocks: {
            type: Type.ARRAY,
            description: 'A list of publicly traded companies/stocks directly impacted by this news.',
            items: {
                type: Type.OBJECT,
                properties: {
                    ticker: { 
                        type: Type.STRING,
                        description: 'The stock ticker symbol (e.g., AAPL, GOOGL).'
                    },
                    sentiment: {
                        type: Type.STRING,
                        description: 'The anticipated sentiment for the stock based on the news. Must be one of: Positive, Negative, or Neutral.'
                    },
                    reason: {
                        type: Type.STRING,
                        description: 'A brief, one-sentence explanation for the sentiment (e.g., "Strong earnings report", "Geopolitical risk").'
                    }
                },
                required: ['ticker', 'sentiment', 'reason']
            }
        },
        marketImpact: {
            type: Type.STRING,
            description: 'A brief analysis of the potential broader market impact (e.g., on a sector or the market as a whole).'
        },
        confidenceScore: {
            type: Type.NUMBER,
            description: 'A score from 0 to 100 representing the confidence in the potential market impact of this news.'
        }
    },
    required: ['summary', 'keyTakeaways', 'impactedStocks', 'marketImpact', 'confidenceScore']
};

const candlestickAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        pattern: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: 'Name of the most prominent candlestick pattern identified (e.g., "Bullish Engulfing", "Doji", "None").' },
                description: { type: Type.STRING, description: 'A brief explanation of what this pattern typically indicates.' }
            },
            required: ['name', 'description']
        },
        trend: {
            type: Type.STRING,
            description: 'The overall trend observed in the provided data. Must be one of: "Bullish", "Bearish", or "Neutral".'
        },
        supportLevel: {
            type: Type.NUMBER,
            description: 'The estimated key support price level based on the data.'
        },
        resistanceLevel: {
            type: Type.NUMBER,
            description: 'The estimated key resistance price level based on the data.'
        },
        shortTermOutlook: {
            type: Type.STRING,
            description: 'A concise, one-sentence outlook for the short term based on the analysis.'
        },
        confidence: {
            type: Type.NUMBER,
            description: 'A confidence score (0-100) for the provided analysis and outlook.'
        }
    },
    required: ['pattern', 'trend', 'supportLevel', 'resistanceLevel', 'shortTermOutlook', 'confidence']
};

const candlestickPredictionSchema = {
    type: Type.OBJECT,
    properties: {
        predictions: {
            type: Type.ARRAY,
            description: 'An array of 10 predicted candlestick data objects for the next 10 periods.',
            items: {
                type: Type.OBJECT,
                properties: {
                    time: { type: Type.NUMBER, description: 'The UNIX timestamp for the start of the period.' },
                    open: { type: Type.NUMBER },
                    high: { type: Type.NUMBER },
                    low: { type: Type.NUMBER },
                    close: { type: Type.NUMBER }
                },
                required: ['time', 'open', 'high', 'low', 'close']
            }
        },
        confidence: {
            type: Type.NUMBER,
            description: 'A confidence score (0-100) for the overall prediction series.'
        },
        rationale: {
            type: Type.STRING,
            description: 'A brief, one-sentence rationale for the prediction, referencing key patterns or trends.'
        }
    },
    required: ['predictions', 'confidence', 'rationale']
};

const stockComparisonSchema = {
    type: Type.OBJECT,
    properties: {
        comparison: {
            type: Type.ARRAY,
            description: "An array containing two objects, one for each stock being compared.",
            items: {
                type: Type.OBJECT,
                properties: {
                    ticker: { type: Type.STRING, description: "The stock ticker symbol." },
                    price: { type: Type.NUMBER, description: "The current stock price." },
                    marketCap: { type: Type.STRING, description: "The market capitalization (e.g., '$2.1T')." },
                    peRatio: { type: Type.NUMBER, description: "The Price-to-Earnings ratio." },
                    performanceYTD: { type: Type.NUMBER, description: "The year-to-date performance as a percentage." },
                    volatility: { type: Type.NUMBER, description: "A measure of the stock's volatility (e.g., Beta)." },
                    analystRating: { type: Type.STRING, description: "The consensus analyst rating (e.g., 'Strong Buy', 'Hold')." },
                    aiSentiment: { type: Type.STRING, enum: ['Positive', 'Negative', 'Neutral'], description: "AI-driven sentiment based on recent news." },
                    optimalBuy: { type: Type.NUMBER, description: "The AI-calculated optimal buy price based on recent trends." },
                    optimalSell: { type: Type.NUMBER, description: "The AI-calculated optimal sell price based on recent trends." },
                },
                required: ['ticker', 'price', 'marketCap', 'peRatio', 'performanceYTD', 'volatility', 'analystRating', 'aiSentiment', 'optimalBuy', 'optimalSell']
            }
        },
        summary: {
            type: Type.STRING,
            description: "A brief summary comparing the two stocks and recommending which might be better for different types of investors."
        }
    },
    required: ['comparison', 'summary']
};

const portfolioHealthSchema = {
    type: Type.OBJECT,
    properties: {
        riskScore: { type: Type.NUMBER, description: 'Overall portfolio risk score from 0 (low) to 100 (high).' },
        performance: { type: Type.NUMBER, description: 'A score from 0 to 100 based on recent performance.' },
        diversification: { type: Type.NUMBER, description: 'A score from 0 to 100 based on sector diversification.' },
        value: { type: Type.NUMBER, description: 'A score from 0 to 100 based on valuation metrics (e.g., P/E).'},
        potential: { type: Type.NUMBER, description: 'A score from 0 to 100 representing growth potential.'},
        summary: { type: Type.STRING, description: 'A concise summary of the portfolio\'s health, including its main strengths and weaknesses.' }
    },
    required: ['riskScore', 'performance', 'diversification', 'value', 'potential', 'summary']
};

const translationSchema = {
    type: Type.OBJECT,
    properties: {
        translations: {
            type: Type.ARRAY,
            description: "An array of translated texts.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: {
                        type: Type.STRING,
                        description: "The original ID for the text."
                    },
                    translatedText: {
                        type: Type.STRING,
                        description: "The translated text."
                    }
                },
                required: ['id', 'translatedText']
            }
        }
    },
    required: ['translations']
};


export const analyzeNewsArticle = async (article: NewsArticle): Promise<NewsAnalysisResult> => {
    const prompt = `
        Analyze the following financial news article and provide a structured analysis in JSON format.
        
        Headline: "${article.headline}"
        Summary: "${article.summary}"
        Source: ${article.source}
        
        Based on this information, perform the following analysis:
        1.  **Summary**: Provide a detailed summary of the news.
        2.  **Key Takeaways**: List the most critical points as an array of strings.
        3.  **Impacted Stocks**: Identify any publicly traded stocks mentioned or directly affected. For each, provide its ticker symbol, the likely sentiment impact (Positive, Negative, or Neutral), and a brief one-sentence reason for the sentiment. If no specific stocks are impacted, return an empty array.
        4.  **Market Impact**: Briefly describe the potential impact on the broader market or specific sectors.
        5.  **Confidence Score**: Give a confidence score (0-100) on how impactful this news is likely to be on the markets.
        
        Return ONLY the JSON object conforming to the schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: newsAnalysisSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const analysisResult: NewsAnalysisResult = JSON.parse(jsonText);
        return analysisResult;

    } catch (error) {
        console.error("Error analyzing news article with Gemini:", error);
        // Provide a fallback error object that matches the type
        return {
            summary: "AI analysis failed. Please check the article source or try again later.",
            keyTakeaways: [],
            impactedStocks: [],
            marketImpact: "Could not determine market impact due to an error.",
            confidenceScore: 0,
            error: error instanceof Error ? error.message : "An unknown error occurred."
        };
    }
};

export const analyzeCandlestickData = async (data: CandlestickData[]): Promise<CandlestickAnalysisResult> => {
    // Simulate a 10% chance of failure for demonstration purposes
    if (Math.random() < 0.1) {
        throw new Error("Simulated AI analysis failure. Please try again.");
    }
    
    if (data.length === 0) {
        return {
            pattern: { name: "N/A", description: "Not enough data for analysis." },
            trend: "Neutral",
            supportLevel: 0,
            resistanceLevel: 0,
            shortTermOutlook: "Cannot determine outlook with no data.",
            confidence: 0,
            error: "No data provided."
        };
    }

    const prompt = `
        As a professional technical analyst, analyze the following candlestick data which is provided as a JSON string.
        The data is an array of objects, each with 'time' (unix timestamp), 'open', 'high', 'low', and 'close' prices.
        
        Data:
        ${JSON.stringify(data.slice(-50))}

        Based on this data, provide a structured analysis containing:
        1.  **Pattern**: Identify the most prominent candlestick pattern. If none, state "None".
        2.  **Trend**: Determine the overall trend (Bullish, Bearish, Neutral).
        3.  **Support/Resistance**: Estimate the key support and resistance levels.
        4.  **Outlook**: A concise short-term outlook.
        5.  **Confidence**: A confidence score (0-100) on your analysis.

        Return ONLY the JSON object conforming to the schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: candlestickAnalysisSchema,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as CandlestickAnalysisResult;
    } catch (error) {
        console.error("Error analyzing candlestick data with Gemini:", error);
        throw error;
    }
};

export const predictCandlestickData = async (data: CandlestickData[]): Promise<CandlestickPredictionResult> => {
    // Simulate a 10% chance of failure for demonstration purposes
    if (Math.random() < 0.1) {
        throw new Error("Simulated AI prediction failure. Please try again.");
    }

    if (data.length < 10) { // Need some data to predict
        return {
            predictions: [],
            confidence: 0,
            rationale: "Not enough historical data to generate a prediction.",
            error: "Insufficient data."
        };
    }
    
    const lastCandle = data[data.length - 1];
    const prompt = `
        You are an expert financial AI specializing in technical analysis and price action forecasting. 
        Based on the following historical daily candlestick data (OHLC), predict the next 10 daily candlesticks.
        The last provided candle has the timestamp ${lastCandle.time}. Your predicted timestamps must be for 10 consecutive days immediately following this last timestamp (i.e., add 86400 seconds for each subsequent day).
        Provide an overall confidence score for your prediction series (0-100) and a brief rationale.
        
        Historical Data (last 50 periods):
        ${JSON.stringify(data.slice(-50), null, 2)}
        
        Return ONLY the JSON object conforming to the schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: candlestickPredictionSchema,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as CandlestickPredictionResult;
    } catch (error) {
        console.error("Error predicting candlestick data with Gemini:", error);
        throw error;
    }
};

export const compareStocks = async (ticker1: string, ticker2: string): Promise<{ comparison: StockComparison[], summary: string } | { error: string }> => {
    const prompt = `
        Provide a detailed comparison between the stocks with tickers ${ticker1} and ${ticker2}.
        Use your knowledge and simulated real-time data to fill in the comparison table.
        Provide a summary of which stock is better for which type of investor.
        Return ONLY the JSON object conforming to the schema.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: stockComparisonSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as { comparison: StockComparison[], summary: string };
    } catch (error) {
        console.error("Error comparing stocks with Gemini:", error);
        return { error: error instanceof Error ? error.message : "An unknown error occurred." };
    }
};

export const analyzePortfolioHealth = async (holdings: PortfolioHolding[]): Promise<PortfolioHealth | { error: string }> => {
    const prompt = `
        Analyze the following investment portfolio based on its holdings.
        The portfolio is: ${JSON.stringify(holdings)}.
        
        Provide a quantitative health check of the portfolio based on the following criteria, each scored from 0 (poor) to 100 (excellent):
        - riskScore: Overall portfolio risk. Higher means riskier.
        - performance: Recent performance relative to the market.
        - diversification: How well diversified the portfolio is across sectors.
        - value: An assessment of the portfolio's valuation (e.g., aggregate P/E).
        - potential: Growth potential.

        Also provide a concise text summary of the portfolio's health, its main strengths, and its weaknesses.
        Return ONLY the JSON object conforming to the schema.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: portfolioHealthSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as PortfolioHealth;
    } catch (error) {
        console.error("Error analyzing portfolio health with Gemini:", error);
        return { error: error instanceof Error ? error.message : "An unknown error occurred." };
    }
};

export const batchTranslate = async (
    items: { id: string | number; text: string }[],
    language: Language
): Promise<Record<string, string>> => {
    if (items.length === 0 || language === Language.EN) {
        return {};
    }

    const targetLanguage = language === Language.MN ? 'Mongolian' : 'English';

    const prompt = `
        Translate the "text" field of each object in the following JSON array into ${targetLanguage}.
        Maintain the original "id" for each item.
        The text may contain financial terms, so provide an accurate and natural-sounding translation suitable for that context.

        Input Array:
        ${JSON.stringify(items)}

        Return ONLY the JSON object conforming to the schema. Do not include any other text or explanations.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: translationSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);
        
        if (!parsedResponse.translations || !Array.isArray(parsedResponse.translations)) {
             throw new Error("Invalid translation response structure from API.");
        }
        
        const translationsMap: Record<string, string> = {};
        for (const item of parsedResponse.translations) {
            if (item.id && item.translatedText) {
                translationsMap[item.id] = item.translatedText;
            }
        }
        return translationsMap;

    } catch (error) {
        console.error("Error batch translating content with Gemini:", error);
        return {}; // Return empty map on error
    }
};