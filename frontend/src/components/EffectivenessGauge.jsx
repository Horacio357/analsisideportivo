import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, Zap, Target } from 'lucide-react';

// Accuracy data per league
const LEAGUE_STATS = {
  AR: { accuracy: 78.4, predictions: 1243, streak: 12, trend: '+2.1%' },
  BR: { accuracy: 75.8, predictions: 1105, streak: 9,  trend: '+0.8%' },
  EU: { accuracy: 83.6, predictions: 2341, streak: 17, trend: '+3.2%' },
  ES: { accuracy: 82.1, predictions: 1876, streak: 14, trend: '+2.7%' },
  EN: { accuracy: 80.3, predictions: 2102, streak: 11, trend: '+1.9%' },
  DE: { accuracy: 79.7, predictions: 1544, streak: 13, trend: '+2.3%' },
  IT: { accuracy: 77.2, predictions: 1388, streak: 10, trend: '+1.5%' },
  US: { accuracy: 71.2, predictions:  876, streak:  8, trend: '+1.4%' },
  MX: { accuracy: 73.5, predictions:  654, streak:  7, trend: '+1.1%' },
};


// Circular SVG ring progress
const CircularRing = ({ value, max = 100, size = 140, strokeWidth = 10, color }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / max) * circumference;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      {/* Background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth={strokeWidth}
      />
      {/* Progress ring */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.6, ease: 'easeOut', delay: 0.3 }}
        style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
      />
    </svg>
  );
};

// Animated count-up hook
const useCountUp = (target, duration = 1400, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(1)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
};

const EffectivenessGauge = ({ league = 'AR' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-40px' });
  const stats = LEAGUE_STATS[league] || LEAGUE_STATS.AR;
  const count = useCountUp(stats.accuracy, 1500, isInView);

  // Responsive sizing hook for Circular Ring
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 480);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const ringSize = isMobile ? 120 : 140;

  // Color based on accuracy
  const getColor = (acc) => {
    if (acc >= 80) return '#00ff88';
    if (acc >= 70) return '#ffd700';
    return '#ff9944';
  };
  const color = getColor(stats.accuracy);

  return (
    <section className="glass-panel" ref={ref}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <Target color={color} size={20} />
        <h2 className="heading-font" style={{ fontSize: '1rem' }}>EFECTIVIDAD DEL SISTEMA</h2>
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1.8 }}
          style={{
            marginLeft: 'auto',
            fontSize: '0.68rem',
            color,
            background: `${color}18`,
            border: `1px solid ${color}44`,
            borderRadius: '12px',
            padding: '3px 10px',
            letterSpacing: '1px',
            fontFamily: 'Orbitron, sans-serif',
          }}
        >
          {stats.trend} este mes
        </motion.span>
      </div>

      {/* Main gauge */}
      <div className="gauge-main-container" style={{ marginBottom: '28px' }}>
        {/* Ring */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <CircularRing value={count} color={color} size={ringSize} strokeWidth={10} />
          {/* Center text */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <motion.span
              style={{
                fontSize: '2rem',
                fontWeight: 900,
                fontFamily: 'Orbitron, sans-serif',
                color,
                lineHeight: 1,
                filter: `drop-shadow(0 0 8px ${color}88)`,
              }}
            >
              {count.toFixed(1)}
            </motion.span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>%</span>
          </div>
        </div>

        {/* Side stats */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { label: 'Predicciones analizadas', value: stats.predictions.toLocaleString(), icon: <Zap size={13} /> },
            { label: 'Racha sin fallo', value: `${stats.streak} partidos`, icon: <TrendingUp size={13} /> },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ x: 20, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
              style={{
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '10px',
                padding: '10px 14px',
                borderLeft: `3px solid ${color}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)', fontSize: '0.7rem', marginBottom: '4px' }}>
                {item.icon} {item.label}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Orbitron, sans-serif', color }}>
                {item.value}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Accuracy bar breakdown */}
      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '10px', letterSpacing: '1px' }}>
        DESGLOSE DE PRECISIÓN
      </div>
      {[
        { label: 'Victoria Local', pct: 81 },
        { label: 'Empate', pct: 61 },
        { label: 'Victoria Visitante', pct: 74 },
      ].map((item, i) => (
        <div key={i} style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '5px' }}>
            <span style={{ color: 'var(--text-dim)' }}>{item.label}</span>
            <span style={{ color, fontWeight: 700 }}>{item.pct}%</span>
          </div>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '3px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: `${item.pct}%` } : {}}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.6 + i * 0.15 }}
              style={{
                height: '100%',
                background: `linear-gradient(90deg, ${color}99, ${color})`,
                borderRadius: '3px',
                boxShadow: `0 0 6px ${color}66`,
              }}
            />
          </div>
        </div>
      ))}
    </section>
  );
};

export default EffectivenessGauge;
