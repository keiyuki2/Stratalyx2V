import { FRED_API_KEY } from '../config';
import type { EconomicIndicator, CountryCode, MntData } from '../types';
import { Icons } from '../constants';

const FRED_API_URL = 'https://api.stlouisfed.org/fred';
const PROXY_URL = 'https://corsproxy.io/?';

type IndicatorConfig = {
    id: string;
    name: string;
    units: 'lin' | 'pc1'; // lin: as-is, pc1: year-over-year % change
    icon: React.ReactElement;
    changeIsPositive: boolean;
    format: (value: number) => string;
};

const formatPercent = (v: number) => `${v.toFixed(2)}%`;
const formatPercent1dp = (v: number) => `${v.toFixed(1)}%`;
const formatLevel = (v: number) => v.toFixed(2);
const formatLevel1dp = (v: number) => v.toFixed(1);

// Corrected and verified FRED series IDs
const seriesConfig: Record<CountryCode, Record<string, IndicatorConfig>> = {
    US: {
        gdp: { id: 'A191RL1Q225SBEA', name: 'GDP Growth (QoQ)', units: 'lin', icon: Icons.gdp, changeIsPositive: true, format: formatPercent1dp },
        inflation: { id: 'CPIAUCSL', name: 'Inflation (YoY)', units: 'pc1', icon: Icons.inflation, changeIsPositive: false, format: formatPercent },
        unemployment: { id: 'UNRATE', name: 'Unemployment Rate', units: 'lin', icon: Icons.unemployment, changeIsPositive: false, format: formatPercent },
        interestRate: { id: 'FEDFUNDS', name: 'Fed Funds Rate', units: 'lin', icon: Icons.fed, changeIsPositive: false, format: formatPercent },
        cci: { id: 'UMCSENT', name: 'Consumer Sentiment', units: 'lin', icon: Icons.cci, changeIsPositive: true, format: formatLevel },
        indPro: { id: 'INDPRO', name: 'Industrial Prod. (YoY)', units: 'pc1', icon: Icons.industrials, changeIsPositive: true, format: formatPercent },
        retail: { id: 'RSXFS', name: 'Retail Sales (YoY)', units: 'pc1', icon: Icons.consumerDiscretionary, changeIsPositive: true, format: formatPercent },
        pmi: { id: 'ISM', name: 'ISM Manufacturing PMI', units: 'lin', icon: Icons.pmi, changeIsPositive: true, format: formatLevel1dp },
    },
    DE: { // Germany
        gdp: { id: 'CLVMNACSCAB1GQDE', name: 'GDP Growth (YoY)', units: 'pc1', icon: Icons.gdp, changeIsPositive: true, format: formatPercent },
        inflation: { id: 'CPALTT01DEM657N', name: 'Inflation (YoY)', units: 'lin', icon: Icons.inflation, changeIsPositive: false, format: formatPercent },
        unemployment: { id: 'LRHUTTTTDEM156S', name: 'Unemployment Rate', units: 'lin', icon: Icons.unemployment, changeIsPositive: false, format: formatPercent },
        interestRate: { id: 'IR3TIB01DEM156N', name: 'ECB Deposit Rate', units: 'lin', icon: Icons.fed, changeIsPositive: false, format: formatPercent },
        cci: { id: 'CSCICP03DEM665S', name: 'Consumer Confidence', units: 'lin', icon: Icons.cci, changeIsPositive: true, format: formatLevel },
        indPro: { id: 'DEUPROINDMISMEI', name: 'Industrial Prod. (YoY)', units: 'pc1', icon: Icons.industrials, changeIsPositive: true, format: formatPercent },
        retail: { id: 'MRTSSM44000DEURCA', name: 'Retail Sales (YoY)', units: 'pc1', icon: Icons.consumerDiscretionary, changeIsPositive: true, format: formatPercent },
    },
    CN: { // China
        gdp: { id: 'RGDPNACNA666NRUG', name: 'GDP Growth (YoY)', units: 'lin', icon: Icons.gdp, changeIsPositive: true, format: formatPercent },
        inflation: { id: 'CPALTT01CNM657N', name: 'Inflation (YoY)', units: 'lin', icon: Icons.inflation, changeIsPositive: false, format: formatPercent },
        unemployment: { id: 'LREM64TTCNM156S', name: 'Unemployment Rate', units: 'lin', icon: Icons.unemployment, changeIsPositive: false, format: formatPercent },
        interestRate: { id: 'INTDSRCNM193N', name: 'PBOC Loan Rate', units: 'lin', icon: Icons.fed, changeIsPositive: false, format: formatPercent },
        indPro: { id: 'INDPROCHN', name: 'Industrial Prod. (YoY)', units: 'lin', icon: Icons.industrials, changeIsPositive: true, format: formatPercent },
    },
    JP: { // Japan
        gdp: { id: 'JPNRGDPEXP', name: 'GDP Growth (YoY)', units: 'pc1', icon: Icons.gdp, changeIsPositive: true, format: formatPercent },
        inflation: { id: 'CPALTT01JPM657N', name: 'Inflation (YoY)', units: 'lin', icon: Icons.inflation, changeIsPositive: false, format: formatPercent },
        unemployment: { id: 'LRHUTTTTJPM156S', name: 'Unemployment Rate', units: 'lin', icon: Icons.unemployment, changeIsPositive: false, format: formatPercent },
        interestRate: { id: 'INTDSRJPM193N', name: 'BoJ Policy Rate', units: 'lin', icon: Icons.fed, changeIsPositive: false, format: formatPercent },
        cci: { id: 'CSCICP03JPM665S', name: 'Consumer Confidence', units: 'lin', icon: Icons.cci, changeIsPositive: true, format: formatLevel },
        indPro: { id: 'JPNPROINDQ', name: 'Industrial Prod. (YoY)', units: 'pc1', icon: Icons.industrials, changeIsPositive: true, format: formatPercent },
    },
    GB: { // United Kingdom
        gdp: { id: 'NAEXKP01GBQ657S', name: 'GDP Growth (YoY)', units: 'pc1', icon: Icons.gdp, changeIsPositive: true, format: formatPercent },
        inflation: { id: 'CPALTT01GBM657N', name: 'Inflation (YoY)', units: 'lin', icon: Icons.inflation, changeIsPositive: false, format: formatPercent },
        unemployment: { id: 'LRHUTTTTGBM156S', name: 'Unemployment Rate', units: 'lin', icon: Icons.unemployment, changeIsPositive: false, format: formatPercent },
        interestRate: { id: 'INTDSRGBM193N', name: 'BoE Policy Rate', units: 'lin', icon: Icons.fed, changeIsPositive: false, format: formatPercent },
        cci: { id: 'CSCICP03GBM665S', name: 'Consumer Confidence', units: 'lin', icon: Icons.cci, changeIsPositive: true, format: formatLevel },
        retail: { id: 'MRTSSM44000GBURCA', name: 'Retail Sales (YoY)', units: 'pc1', icon: Icons.consumerDiscretionary, changeIsPositive: true, format: formatPercent },
    },
    MN: { // Mongolia
        gdp: { id: 'NYGDPMKTPKDZGMNG', name: 'GDP Growth (YoY)', units: 'lin', icon: Icons.gdp, changeIsPositive: true, format: formatPercent },
        inflation: { id: 'FPCPITOTLZGMNG', name: 'Inflation (YoY)', units: 'lin', icon: Icons.inflation, changeIsPositive: false, format: formatPercent },
        unemployment: { id: 'SLUEMTTTMNA647S', name: 'Unemployment Rate', units: 'lin', icon: Icons.unemployment, changeIsPositive: false, format: formatPercent },
        interestRate: { id: 'INTDSRMNM193N', name: 'Policy Rate', units: 'lin', icon: Icons.fed, changeIsPositive: false, format: formatPercent },
    }
};

interface FredObservation { date: string; value: string; }
interface FredResponse { observations: FredObservation[]; error_message?: string; }

const fetchSeries = async (seriesId: string, units: string, limit: string = '2'): Promise<FredObservation[]> => {
    const params = new URLSearchParams({
        series_id: seriesId,
        api_key: FRED_API_KEY,
        file_type: 'json',
        sort_order: 'desc',
        limit,
        units,
    });
    try {
        const targetUrl = `${FRED_API_URL}/series/observations?${params}`;
        const response = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`);
        
        const data: FredResponse = await response.json();
        if (!response.ok || data.error_message) {
            console.error(`FRED API request failed for ${seriesId}: ${data.error_message || response.statusText}`);
            return [];
        }
        if (!data.observations || data.observations.length === 0) {
            console.warn(`FRED data for ${seriesId} is missing observations.`);
            return [];
        }
        return data.observations;
    } catch (error) {
        console.error(`Error fetching FRED series ${seriesId}:`, error);
        return [];
    }
};

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const getEconomicIndicators = async (country: CountryCode): Promise<EconomicIndicator[]> => {
    const countryConfig = seriesConfig[country];
    if (!countryConfig) return [];

    const indicatorPromises = Object.values(countryConfig).map(config => fetchSeries(config.id, config.units));
    const results = await Promise.allSettled(indicatorPromises);

    const indicators: EconomicIndicator[] = [];
    const configs = Object.values(countryConfig);

    results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.length > 0) {
            const observations = result.value.filter(obs => obs.value !== '.');
            if (observations.length < 1) return;

            const latest = observations[0];
            const previous = observations.length > 1 ? observations[1] : latest;
            const config = configs[index];

            const latestValue = parseFloat(latest.value);
            const previousValue = parseFloat(previous.value);

            if (isNaN(latestValue) || isNaN(previousValue)) return;
            
            const change = latestValue - previousValue;
            const isPositive = config.changeIsPositive ? change >= 0 : change < 0;

            indicators.push({
                name: config.name,
                value: config.format(latestValue),
                change: `${change >= 0 ? '+' : ''}${change.toFixed(2)}`,
                observationDate: formatDate(latest.date),
                positive: isPositive,
                icon: config.icon,
            });
        } else if (result.status === 'rejected') {
            console.error(`Promise for ${configs[index].name} was rejected:`, result.reason);
        }
    });
    
    return indicators;
};

// MNT Data Fetching (mocked for reliability, as FRED data can be sparse)
export const getMntData = async (): Promise<MntData> => {
    // In a real app, you would fetch these from FRED:
    // Inflation: FPCPITOTLZGMNG (annual, might be too slow)
    // Policy Rate: INTDSRMNM193N (monthly)
    // For historical data, EXCSDMUSM494S (monthly MNT per USD) could be used.
    
    // Mocking for a better user experience
    const mockHistoricalData = Array.from({ length: 24 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (24 - i));
        return {
            date: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            value: 3450 + Math.sin(i / 3) * 50 + (Math.random() - 0.5) * 20,
        };
    });

    return Promise.resolve({
        inflation: 7.8,
        policyRate: 12.0,
        historicalData: mockHistoricalData,
    });
};