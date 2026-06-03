import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Bot, ChevronRight, Mail, CreditCard } from 'lucide-react';
import { playSound } from '../utils/sounds';

const FloatingBot = ({ t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const steps = [
    { 
      text: t.botIntro, 
      options: [
        { label: "¿Cómo funcionan las predicciones?", next: 1 },
        { label: "¿Qué incluye la suscripción VIP?", next: 2 }
      ] 
    },
    { 
      text: "Nuestras predicciones usan IA analizando más de 50 variables: rendimiento reciente, xG (goles esperados), fatiga de jugadores y clima.", 
      options: [
        { label: "Ver planes VIP", next: 2 },
        { label: "Volver", next: 0 }
      ] 
    },
    { 
      text: "El Plan VIP incluye: Predicción de Jugador del Partido, reportes detallados por email y notificaciones en tiempo real.", 
      options: [
        { label: "Saber más de pagos", next: 3 },
        { label: "Volver", next: 0 }
      ] 
    },
    { 
      text: "Aceptamos Mercado Pago y tarjetas internacionales. Una vez suscrito, podrás habilitar el envío automático a tu email.", 
      options: [
        { label: "Entendido", next: 0 }
      ] 
    }
  ];

  const handleNext = (nextIndex) => {
    setIsTyping(true);
    setTimeout(() => {
      setCurrentStep(nextIndex);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 50 }}
            className="glass-panel bot-panel"
            style={{ 
              position: 'fixed',
              bottom: '90px',
              right: '25px',
              width: '340px',
              zIndex: 2000,
              border: '2px solid var(--accent-color)', 
              padding: '20px' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <div style={{ background: 'var(--accent-color)', padding: '5px', borderRadius: '50%' }}>
                <Bot color="#000" size={18} />
              </div>
              <span className="heading-font" style={{ fontSize: '0.75rem' }}>BET AI AGENT</span>
            </div>

            <div style={{ minHeight: '60px' }}>
              {isTyping ? (
                <div style={{ display: 'flex', gap: '4px' }}>
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }}>.</motion.div>
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}>.</motion.div>
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}>.</motion.div>
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>{steps[currentStep].text}</p>
              )}
            </div>

            <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {!isTyping && steps[currentStep].options.map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => handleNext(opt.next)}
                  style={{ 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid var(--border-color)', 
                    color: '#fff', 
                    padding: '10px', 
                    borderRadius: '6px', 
                    fontSize: '0.75rem', 
                    textAlign: 'left', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}
                >
                  {opt.label} <ChevronRight size={12} color="var(--accent-color)" />
                </button>
              ))}
            </div>

            <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        animate={!isOpen ? { scale: [1, 1.08, 1], boxShadow: ['0 4px 15px rgba(0, 255, 136, 0.3)', '0 4px 25px rgba(0, 255, 136, 0.6)', '0 4px 15px rgba(0, 255, 136, 0.3)'] } : { scale: 1 }}
        transition={!isOpen ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" } : {}}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (!isOpen) playSound('bot');
          setIsOpen(!isOpen);
        }}
        className="pes-button"
        style={{ 
          position: 'fixed',
          bottom: '25px',
          right: '25px',
          zIndex: 2000,
          width: '55px', 
          height: '55px', 
          borderRadius: '50%', 
          clipPath: 'none', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'var(--accent-color)',
          color: '#000',
          padding: 0
        }}
      >
        {isOpen ? <X size={24} /> : <Bot size={28} />}
      </motion.button>
    </>
  );
};

export default FloatingBot;
