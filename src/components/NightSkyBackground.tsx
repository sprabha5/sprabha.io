import React, { useEffect, useRef, useCallback } from 'react';
import { Box } from '@mui/material';

interface Sparkle {
    x: number;
    y: number;
    size: number;
    opacity: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    hue: number;
}

interface Star {
    x: number;
    y: number;
    size: number;
    opacity: number;
    twinkleSpeed: number;
    twinklePhase: number;
}

const NightSkyBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sparklesRef = useRef<Sparkle[]>([]);
    const starsRef = useRef<Star[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const frameRef = useRef<number>(0);
    const lastSparkleRef = useRef<number>(0);

    const initStars = useCallback((width: number, height: number) => {
        const count = Math.floor((width * height) / 8000);
        const stars: Star[] = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.8 + 0.3,
                opacity: Math.random() * 0.6 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2,
            });
        }
        starsRef.current = stars;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars(canvas.width, canvas.height);
        };

        resize();
        window.addEventListener('resize', resize);

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
            const now = Date.now();
            if (now - lastSparkleRef.current > 30) {
                lastSparkleRef.current = now;
                for (let i = 0; i < 2; i++) {
                    sparklesRef.current.push({
                        x: e.clientX + (Math.random() - 0.5) * 8,
                        y: e.clientY + (Math.random() - 0.5) * 8,
                        size: Math.random() * 3 + 1.5,
                        opacity: 1,
                        vx: (Math.random() - 0.5) * 1.5,
                        vy: (Math.random() - 0.5) * 1.5 - 0.5,
                        life: 0,
                        maxLife: 40 + Math.random() * 30,
                        hue: 40 + Math.random() * 30, // warm gold/white
                    });
                }
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        let time = 0;
        const animate = () => {
            time++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw stars
            for (const star of starsRef.current) {
                const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.35 + 0.65;
                const alpha = star.opacity * twinkle;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.fill();
            }

            // Update and draw sparkles
            const alive: Sparkle[] = [];
            for (const s of sparklesRef.current) {
                s.life++;
                s.x += s.vx;
                s.y += s.vy;
                s.vy += 0.02; // slight gravity
                s.opacity = 1 - s.life / s.maxLife;

                if (s.life < s.maxLife && s.opacity > 0) {
                    alive.push(s);

                    // Draw sparkle as a 4-point star
                    const scale = s.size * s.opacity;
                    ctx.save();
                    ctx.translate(s.x, s.y);
                    ctx.fillStyle = `hsla(${s.hue}, 80%, 85%, ${s.opacity})`;
                    ctx.beginPath();
                    // 4-point star shape
                    const outer = scale;
                    const inner = scale * 0.3;
                    for (let i = 0; i < 8; i++) {
                        const r = i % 2 === 0 ? outer : inner;
                        const angle = (i * Math.PI) / 4;
                        const method = i === 0 ? 'moveTo' : 'lineTo';
                        ctx[method](Math.cos(angle) * r, Math.sin(angle) * r);
                    }
                    ctx.closePath();
                    ctx.fill();

                    // Glow
                    ctx.shadowColor = `hsla(${s.hue}, 80%, 85%, ${s.opacity * 0.5})`;
                    ctx.shadowBlur = scale * 2;
                    ctx.fill();
                    ctx.restore();
                }
            }
            sparklesRef.current = alive;

            frameRef.current = requestAnimationFrame(animate);
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(frameRef.current);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [initStars]);

    return (
        <Box
            component="canvas"
            ref={canvasRef}
            sx={{
                position: 'fixed',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
            }}
        />
    );
};

export default NightSkyBackground;
