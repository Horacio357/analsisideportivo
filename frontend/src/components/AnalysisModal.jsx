import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BrainCircuit, TrendingUp, ShieldAlert, Star, Crown, Mail, Send } from 'lucide-react';

const AnalysisModal = ({ isOpen, onClose, match, t }) => {
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  if (!isOpen || !match) return null;

  const handleSendEmail = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    }, 1500);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel"
        style={{ width: '100%', maxWidth: '600px', border: '2px solid var(--accent-color)', position: 'relative' }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
          <BrainCircuit size={40} color="var(--accent-color)" />
          <h2 className="heading-font">{match.home} VS {match.away}</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div className="glass-panel" style={{ padding: '15px', textAlign: 'center' }}>
            <TrendingUp color="var(--accent-secondary)" style={{ marginBottom: '10px' }} />
            <h3 style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>PROBABILIDAD IA</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>{match.homeProb}% L</div>
          </div>
          <div className="glass-panel" style={{ padding: '15px', textAlign: 'center' }}>
            <ShieldAlert color="#ff4444" style={{ marginBottom: '10px' }} />
            <h3 style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>FACTOR DE RIESGO</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>BAJO</div>
          </div>
        </div>

        <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', marginBottom: '20px' }}>
          <h3 className="heading-font" style={{ fontSize: '0.9rem', marginBottom: '15px', color: 'var(--accent-secondary)' }}>ANÁLISIS DETALLADO</h3>
          <p style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
            Nuestro algoritmo detecta una alta eficiencia en el área rival por parte de los delanteros locales en los últimos 4 encuentros. 
            El equipo visitante presenta bajas importantes en la defensa central. 
            <strong> Recomendación:</strong> Apuesta directa a Victoria Local o Goles +1.5.
          </p>
        </div>

        {/* MVP Section - VIP Feature */}
        <div className="glass-panel" style={{ border: '1px solid var(--accent-secondary)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-secondary)', color: '#000', padding: '2px 10px', fontSize: '0.6rem', fontWeight: 'bold', fontFamily: 'Orbitron' }}>
            VIP ACCESS
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <Crown size={20} color="var(--accent-secondary)" />
            <h3 className="heading-font" style={{ fontSize: '0.8rem' }}>TOP 3 JUGADOR DEL PARTIDO</h3>
          </div>

          {[
            { name: 'Edinson Cavani', prob: 42, color: 'var(--accent-color)', reason: 'Alta efectividad en área rival y racha goleadora.' },
            { name: 'Miguel Merentiel', prob: 28, color: 'var(--accent-secondary)', reason: 'Clave en asistencias y presión alta constante.' },
            { name: 'Kevin Zenón', prob: 15, color: '#fff', reason: 'Precisión en pases largos y creación de juego.' }
          ].map((p, i) => (
            <div key={i} style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 'bold' }}>{i+1}. {p.name}</span>
                <span style={{ color: 'var(--accent-secondary)' }}>{p.prob}%</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '8px', fontStyle: 'italic' }}>
                "{p.reason}"
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${p.prob}%` }}
                  transition={{ delay: 0.5 + (i * 0.2) }}
                  style={{ height: '100%', background: p.color, boxShadow: `0 0 10px ${p.color}` }}
                ></motion.div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
          <button 
            className="pes-button" 
            style={{ flex: 2 }} 
            onClick={onClose}
          >
            ENTENDIDO
          </button>
          <button 
            onClick={handleSendEmail}
            disabled={sending || sent}
            style={{ 
              flex: 1, 
              background: sent ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '4px',
              color: sent ? '#000' : '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.8rem'
            }}
          >
            {sending ? '...' : sent ? <Send size={16} /> : <Mail size={16} />}
            {sending ? 'ENVIANDO' : sent ? 'ENVIADO' : 'EMAIL'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalysisModal;
