import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ t }) => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="loading-overlay"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(13, 17, 23, 0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* 
        El usuario puede reemplazar la ruta src='/icono-animado.gif' o '.svg' 
        por el nombre real del archivo que suba a la carpeta public.
      */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        style={{ marginBottom: '20px' }}
      >
        <img 
          src="/loading-icon.gif" 
          alt="Loading..." 
          style={{ width: '80px', height: '80px', objectFit: 'contain' }}
          onError={(e) => {
            // Fallback si no encuentran el archivo: mostrar el spinner anterior
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = '<div class="pes-spinner"></div>';
          }}
        />
      </motion.div>
      <h2 className="heading-font" style={{ color: 'var(--accent-color)', letterSpacing: '2px' }}>
        {t.loading || 'CARGANDO...'}
      </h2>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '10px' }}>
        Analizando más de 10,000 puntos de datos...
      </p>
    </motion.div>
  );
};

export default LoadingScreen;
