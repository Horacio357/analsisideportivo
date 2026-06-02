import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { triggerCelebration } from '../utils/effects';

const LandingPage = ({ onEnter, t }) => {
  return (
    <div className="landing-overlay" style={{ position: 'relative', overflow: 'hidden', height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
      {/* Video Background with more reliable source */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        poster="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1920"
        style={{ 
          position: 'absolute', 
          top: 0,
          left: 0,
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          zIndex: 0, 
          filter: 'brightness(0.3) contrast(1.1)' 
        }}
      >
        <source src="https://v.mixkit.co/videofiles/preview/mixkit-stadium-lights-at-night-4228-large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Fallback Overlay if video fails */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 20%, #000 80%)', zIndex: 1 }}></div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.2, delayChildren: 0.3 } } }}
        style={{ textAlign: 'center', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <motion.div variants={{ hidden: { y: -100, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } }}>
          <img src="/icons/apuestas-online.png" alt="Apuestas" style={{ width: '120px', height: '120px', marginBottom: '10px', filter: 'drop-shadow(0 0 20px var(--accent-color)) hue-rotate(10deg)' }} />
        </motion.div>
        
        <div style={{ display: 'flex', overflow: 'hidden', padding: '10px' }}>
          <motion.h1 
            variants={{ hidden: { x: -100, opacity: 0 }, visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 15 } } }}
            className="landing-title" style={{ color: 'var(--accent-color)', marginRight: '20px', textShadow: '0 0 30px var(--accent-color)' }}
          >
            X
          </motion.h1>
          <motion.h1 
            variants={{ hidden: { x: 100, opacity: 0 }, visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 15 } } }}
            className="landing-title" style={{ color: 'var(--text-main)', textShadow: '0 0 20px rgba(255,255,255,0.5)' }}
          >
            Guru
          </motion.h1>
        </div>

        <motion.p 
          variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
          className="landing-subtitle" style={{ color: 'var(--text-main)', marginBottom: '40px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '8px' }}
        >
          TRUST THE XG
        </motion.p>
        
        <motion.div variants={{ hidden: { y: 100, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } }}>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px var(--accent-color)' }}
            whileTap={{ scale: 0.95 }}
            className="pes-button landing-btn" 
            onClick={() => {
              triggerCelebration();
              onEnter();
            }}
          >
            {t.enter}
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Decorative Glitch lines */}
      <div className="bg-glitch" style={{ opacity: 0.3 }}></div>
    </div>
  );
};

export default LandingPage;
