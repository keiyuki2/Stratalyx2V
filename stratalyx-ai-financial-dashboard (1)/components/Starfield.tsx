import React, { useEffect, useRef } from 'react';

const Starfield = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let stars: { x: number; y: number; z: number; }[] = [];
        const numStars = 500;
        let animationFrameId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            stars = [];
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    z: Math.random() * canvas.width,
                });
            }
        };

        const draw = () => {
            if (!ctx) return;
            ctx.fillStyle = '#0D1117';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);

            for (let i = 0; i < numStars; i++) {
                let star = stars[i];
                star.z -= 1;
                if (star.z <= 0) {
                    star.z = canvas.width;
                }

                let k = 128.0 / star.z;
                let px = star.x * k + canvas.width / 2;
                let py = star.y * k + canvas.height / 2;

                if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
                    let size = (1 - star.z / canvas.width) * 5;
                    ctx.beginPath();
                    ctx.arc(px - canvas.width / 2, py - canvas.height / 2, size / 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.restore();
            animationFrameId = requestAnimationFrame(draw);
        };

        resize();
        draw();

        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full -z-10" />;
};

export default Starfield;