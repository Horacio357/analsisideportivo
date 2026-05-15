import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

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
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ textAlign: 'center', zIndex: 2 }}
      >
        <Trophy size={80} color="var(--accent-color)" style={{ marginBottom: '20px', filter: 'drop-shadow(0 0 15px var(--accent-color))' }} />
        <h1 className="heading-font" style={{ fontSize: '5rem', color: 'var(--accent-color)', marginBottom: '10px', textShadow: '0 0 30px rgba(0,255,136,0.6)' }}>
          BET <span style={{ color: 'var(--text-main)' }}>AI</span>
        </h1>
        <p style={{ color: 'var(--text-main)', marginBottom: '40px', letterSpacing: '12px', fontWeight: 'bold', fontSize: '1.4rem', textTransform: 'uppercase' }}>
          PRO FOOTBALL ANALYTICS
        </p>
        
        <button 
          className="pes-button" 
          onClick={onEnter}
          style={{ fontSize: '1.5rem', padding: '15px 60px', boxShadow: '0 0 40px var(--accent-color)', transition: 'all 0.3s' }}
        >
          {t.enter}
        </button>
      </motion.div>

      {/* Decorative Glitch lines */}
      <div className="bg-glitch" style={{ opacity: 0.3 }}></div>
    </div>
  );
};

export default LandingPage;
