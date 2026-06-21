import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Wait a couple of seconds before showing the prompt so it's not too aggressive
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Detección manual para iOS (Safari no soporta beforeinstallprompt)
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };
    
    const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

    if (isIos() && !isInStandaloneMode()) {
        setTimeout(() => setShowPrompt(true), 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
        // iOS or fallback instructions
        alert('Para instalar en iPhone/iPad: toca el ícono "Compartir" (cuadrado con flecha hacia arriba) en la barra inferior de Safari y luego selecciona "Agregar a Inicio".');
        setShowPrompt(false);
    }
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 15 }}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            width: '90%',
            maxWidth: '450px'
          }}
        >
          <div style={{
            background: 'rgba(5, 5, 8, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '2px solid var(--accent-color)',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 10px 30px rgba(0,255,136,0.2)'
          }}>
            <div style={{
              background: 'rgba(0,255,136,0.1)',
              padding: '10px',
              borderRadius: '50%'
            }}>
              <Download size={24} color="var(--accent-color)" />
            </div>
            
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, color: '#fff', fontSize: '0.95rem', fontFamily: 'Orbitron', letterSpacing: '0.5px' }}>
                INSTALA LA APP
              </h4>
              <p style={{ margin: '4px 0 0', color: 'var(--text-dim)', fontSize: '0.78rem', lineHeight: '1.4' }}>
                Agrega XGuru a tu inicio para recibir <strong style={{color: '#00c6ff'}}>noticias diarias</strong> y analizar todos los partidos.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                onClick={handleInstallClick}
                className="pes-button"
                style={{
                  padding: '6px 14px',
                  fontSize: '0.75rem',
                  width: '100%',
                  background: 'var(--accent-color)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Instalar
              </button>
              <button 
                onClick={() => setShowPrompt(false)}
                style={{
                  background: 'transparent',
                  color: 'var(--text-dim)',
                  border: 'none',
                  padding: '4px',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Ahora no
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
