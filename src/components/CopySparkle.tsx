import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  distance: number;
}

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#10b981', '#fbbf24', '#f472b6', '#34d399'];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: randomBetween(-2, 2),
    y: randomBetween(-2, 2),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: randomBetween(4, 9),
    angle: (360 / count) * i + randomBetween(-15, 15),
    distance: randomBetween(28, 52),
  }));
}

interface CopySparkleProps {
  active: boolean;
}

export default function CopySparkle({ active }: CopySparkleProps) {
  const particles = useRef<Particle[]>(generateParticles(14));

  // Regenerate on each activation
  useEffect(() => {
    if (active) {
      particles.current = generateParticles(14);
    }
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-50">
          {particles.current.map((p) => {
            const rad = (p.angle * Math.PI) / 180;
            const tx = Math.cos(rad) * p.distance;
            const ty = Math.sin(rad) * p.distance;
            return (
              <motion.span
                key={p.id}
                initial={{ opacity: 1, x: p.x, y: p.y, scale: 0 }}
                animate={{
                  opacity: [1, 1, 0],
                  x: tx,
                  y: ty,
                  scale: [0, 1.2, 0.6],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: 'easeOut' as const }}
                style={{
                  position: 'absolute',
                  width: p.size,
                  height: p.size,
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                  background: p.color,
                  boxShadow: `0 0 ${p.size}px ${p.color}`,
                }}
              />
            );
          })}

          {/* Central flash ring */}
          <motion.span
            initial={{ opacity: 0.9, scale: 0 }}
            animate={{ opacity: 0, scale: 2.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' as const }}
            style={{
              position: 'absolute',
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '2px solid #6366f1',
            }}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
