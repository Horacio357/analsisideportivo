import React from 'react';
import { motion } from 'framer-motion';

const MOCK_GURUS = [
  { rank: 1, name: 'ElPibePlay', points: 12450 },
  { rank: 2, name: 'FutbolTotal99', points: 11200 },
  { rank: 3, name: 'BosteroSoy', points: 10850 },
  { rank: 4, name: 'ReyDelBalon', points: 9500 },
  { rank: 5, name: 'xG_Master', points: 8900 },
  { rank: 6, name: 'MessiGoat', points: 8400 },
  { rank: 7, name: 'Canchero', points: 7200 },
  { rank: 8, name: 'ApuestaSegura', points: 6800 },
  { rank: 9, name: 'Goleador09', points: 6100 },
  { rank: 10, name: 'TipsterPro', points: 5900 }
];

const GurusRanking = ({ nickname, userPoints }) => {
  return (
    <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
        <h3 className="heading-font" style={{ color: 'var(--accent-color)', fontSize: '1.2rem', marginBottom: '8px' }}>
          🏆 Top 10 Gurús
        </h3>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontFamily: 'Outfit', margin: 0 }}>
          Acierta tus corazonadas. Los Top 3 del mes ganan VIP gratis y participan por increíbles <strong style={{ color: 'var(--accent-secondary)' }}>sorteos mensuales</strong> (descuentos en Gyms, Cafeterías y más sponsors).
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
        {MOCK_GURUS.map((guru) => (
          <motion.div 
            key={guru.rank}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: guru.rank * 0.05 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              marginBottom: '8px',
              borderRadius: '8px',
              background: guru.rank <= 3 ? 'rgba(0,255,136,0.05)' : 'rgba(255,255,255,0.02)',
              border: guru.rank === 1 ? '1px solid rgba(255, 215, 0, 0.4)' : guru.rank <= 3 ? '1px solid rgba(0,255,136,0.2)' : '1px solid transparent',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                background: guru.rank === 1 ? 'gold' : guru.rank === 2 ? 'silver' : guru.rank === 3 ? '#cd7f32' : '#333',
                color: guru.rank <= 3 ? '#000' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.8rem'
              }}>
                {guru.rank}
              </div>
              <span style={{ 
                color: guru.rank <= 3 ? '#fff' : 'var(--text-dim)', 
                fontFamily: 'Orbitron', 
                fontSize: '0.85rem',
                fontWeight: guru.rank <= 3 ? 'bold' : 'normal'
              }}>
                {guru.name}
              </span>
            </div>
            <span style={{ color: 'var(--accent-secondary)', fontFamily: 'Outfit', fontSize: '0.85rem', fontWeight: 'bold' }}>
              {guru.points.toLocaleString()} pts
            </span>
          </motion.div>
        ))}
      </div>

      {nickname && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          background: 'rgba(0,255,136,0.1)', 
          borderRadius: '8px', 
          border: '1px solid var(--accent-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Tu Posición</div>
            <div style={{ fontFamily: 'Orbitron', fontWeight: 'bold', color: '#fff', fontSize: '0.9rem' }}>{nickname}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Puntos (+10/voto)</div>
            <div style={{ fontFamily: 'Orbitron', fontWeight: 'bold', color: 'var(--accent-color)', fontSize: '1.1rem' }}>{userPoints.toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GurusRanking;
