import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BrainCircuit, ShieldAlert, Award, Calendar, HelpCircle, Activity, Lock, Unlock, Thermometer, Stethoscope, CloudRain, Flag } from 'lucide-react';

const AnalysisModal = ({ isOpen, onClose, match, t, onOpenGlossary, getTeamLogoPath, isVip, onOpenVipModal }) => {
  if (!isOpen || !match) return null;

  // Determinisitic mock advanced metrics based on match id
  const advMetrics = {
    xG_home: (match.homeProb / 20 + 0.5).toFixed(2),
    xG_away: (match.awayProb / 20 + 0.5).toFixed(2),
    fatigue_home: (match.id % 4) * 20 + 10, // 10% to 70%
    fatigue_away: ((match.id + 1) % 4) * 20 + 10,
    injuries_home: match.id % 2 === 0 ? 'Ninguna grave' : 'Baja: Portero titular',
    injuries_away: match.id % 3 === 0 ? 'Baja: Goleador principal' : 'Plantel completo',
    weather: match.id % 2 === 0 ? 'Lluvia intensa (favorece Under)' : 'Despejado (condiciones óptimas)',
    referee: match.id % 3 === 0 ? 'Árbitro muy estricto (Promedio: 5.5 amarillas)' : 'Árbitro permisivo (Promedio: 3.2 amarillas)'
  };

  const isAlta = match.confidence === 'ALTA';
  const isMedia = match.confidence === 'MEDIA';
  const isValue = match.confidence === 'VALUE BET';

  // Harmonious theme coloring based on match confidence
  const confidenceColor = isAlta 
    ? 'var(--accent-color)' 
    : isMedia 
      ? '#00c6ff' 
      : 'var(--accent-secondary)';
      
  const confidenceBg = isAlta 
    ? 'rgba(0, 255, 136, 0.08)' 
    : isMedia 
      ? 'rgba(0, 198, 255, 0.08)' 
      : 'rgba(255, 215, 0, 0.08)';

  // Re-verify that no illegal words are used in rendering
  const cleanTerm = (text) => {
    if (!text) return '';
    return text
      .replace(/victoria favorito/gi, 'dominio esperado')
      .replace(/Tier S/gi, 'Confianza: Alta')
      .replace(/Tier A/gi, 'Confianza: Media')
      .replace(/diferencia de ranking/gi, 'dominio esperado')
      .replace(/Total Goles/gi, 'Over/Under');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(5, 5, 8, 0.85)', backdropFilter: 'blur(8px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="glass-panel"
        style={{ 
          width: '100%', 
          maxWidth: '680px', 
          border: `2px solid ${confidenceColor}`, 
          position: 'relative',
          padding: '28px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: `0 10px 40px rgba(0,0,0,0.6), 0 0 30px ${confidenceColor}15`
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s' }}
          onMouseEnter={(e) => e.target.style.opacity = 1}
          onMouseLeave={(e) => e.target.style.opacity = 0.7}
        >
          <X size={22} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px', marginBottom: '24px', flexWrap: 'wrap', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <BrainCircuit size={36} color="var(--accent-color)" style={{ flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {getTeamLogoPath && getTeamLogoPath(match.home) && (
                  <img 
                    src={getTeamLogoPath(match.home)} 
                    alt={match.home} 
                    style={{ width: '22px', height: '22px', objectFit: 'contain', flexShrink: 0 }} 
                  />
                )}
                <h2 className="heading-font" style={{ fontSize: '1.25rem', margin: 0, letterSpacing: '0.5px', display: 'inline' }}>
                  {match.home} vs {match.away}
                </h2>
                {getTeamLogoPath && getTeamLogoPath(match.away) && (
                  <img 
                    src={getTeamLogoPath(match.away)} 
                    alt={match.away} 
                    style={{ width: '22px', height: '22px', objectFit: 'contain', flexShrink: 0 }} 
                  />
                )}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', letterSpacing: '1px', fontFamily: 'Orbitron' }}>
                ⚽ {match.group_name || 'Liga Regular'}
              </span>
            </div>
          </div>
          
          <div style={{ 
            marginLeft: 'auto', 
            background: confidenceBg, 
            border: `1px solid ${confidenceColor}33`, 
            padding: '6px 14px', 
            borderRadius: '20px',
            boxShadow: `0 0 10px ${confidenceColor}10`
          }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 'bold', color: confidenceColor, fontFamily: 'Orbitron', letterSpacing: '1px' }}>
              CONFIANZA: {match.confidence || 'MEDIA'}
            </span>
          </div>
        </div>

        {/* ── SECTION 1: PRO BETTING CARD (SEGURO, VALOR, ARRIESGADO) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--accent-color)', fontFamily: 'Orbitron', letterSpacing: '2px', display: 'block', marginBottom: '4px' }}>
            FICHA DE APUESTAS PRO
          </span>

          {/* SEGURO PANEL */}
          <div style={{ background: 'rgba(0, 255, 136, 0.03)', border: '1px solid rgba(0, 255, 136, 0.15)', borderRadius: '10px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: 'var(--accent-color)', fontFamily: 'Orbitron', letterSpacing: '1px', fontWeight: 'bold', marginBottom: '4px' }}>
                🟢 SEGURO (Bajo Riesgo)
              </span>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>
                {cleanTerm(match.seguro_handicap_market)}
              </p>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                Cobertura principal en caso de {isAlta ? 'dominio abismal' : 'empate'}. Cobertura alternativa:{' '}
                <span 
                  onClick={() => onOpenGlossary && onOpenGlossary('DNB')}
                  style={{ color: 'var(--accent-color)', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  DNB
                </span>{' '}
                ({match.seguro_dnb_team})
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontFamily: 'Orbitron' }}>CUOTA MÍN</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-color)', fontFamily: 'Orbitron', textShadow: '0 0 5px rgba(0,255,136,0.2)' }}>
                {match.seguro_handicap_odds}
              </div>
            </div>
          </div>

          {/* VALOR PANEL */}
          <div style={{ background: 'rgba(0, 198, 255, 0.03)', border: '1px solid rgba(0, 198, 255, 0.15)', borderRadius: '10px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: '#00c6ff', fontFamily: 'Orbitron', letterSpacing: '1px', fontWeight: 'bold', marginBottom: '4px' }}>
                🔵 VALOR (Alta Probabilidad / Cuota Fuerte)
              </span>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>
                {cleanTerm(match.valor_1x2_team)}
              </p>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                Análisis de cuota vs valor real en{' '}
                <span 
                  onClick={() => onOpenGlossary && onOpenGlossary('Over/Under')}
                  style={{ color: '#00c6ff', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Over/Under
                </span>{' '}
                ({cleanTerm(match.valor_overunder_market)})
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontFamily: 'Orbitron' }}>CUOTA MÍN</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00c6ff', fontFamily: 'Orbitron', textShadow: '0 0 5px rgba(0,198,255,0.2)' }}>
                {match.valor_1x2_odds}
              </div>
            </div>
          </div>

          {/* ARRIESGADO PANEL */}
          <div style={{ background: 'rgba(255, 215, 0, 0.02)', border: '1px solid rgba(255, 215, 0, 0.12)', borderRadius: '10px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: 'var(--accent-secondary)', fontFamily: 'Orbitron', letterSpacing: '1px', fontWeight: 'bold', marginBottom: '4px' }}>
                🟡 ARRIESGADO (Retorno Alto / Especulativo)
              </span>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>
                {cleanTerm(match.arriesgado_1x2pt_market)}
              </p>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                Opción de alta ganancia en primer tiempo. Alternativa:{' '}
                <span 
                  onClick={() => onOpenGlossary && onOpenGlossary('BTTS')}
                  style={{ color: 'var(--accent-secondary)', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  BTTS
                </span>{' '}
                ({cleanTerm(match.arriesgado_btts_market)})
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontFamily: 'Orbitron' }}>CUOTA MÍN</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-secondary)', fontFamily: 'Orbitron', textShadow: '0 0 5px rgba(255,215,0,0.2)' }}>
                {match.arriesgado_1x2pt_odds}
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: CUÁNDO APOSTAR & AJUSTES PENDIENTES ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: 'var(--text-dim)', fontFamily: 'Orbitron', letterSpacing: '1.5px', marginBottom: '8px' }}>
              <Calendar size={14} color="var(--accent-color)" /> CUÁNDO APOSTAR
            </span>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#fff', fontWeight: 500, lineHeight: 1.4 }}>
              📌 {match.when_to_bet || 'Pre-partido (24-48h antes) para asegurar la cuota actual antes de la oscilación.'}
            </p>
          </div>

          <div style={{ background: 'rgba(255,68,68,0.02)', border: '1px solid rgba(255,68,68,0.12)', borderRadius: '10px', padding: '14px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: 'var(--text-dim)', fontFamily: 'Orbitron', letterSpacing: '1.5px', marginBottom: '8px' }}>
              <ShieldAlert size={14} color="#ff4444" /> AJUSTE PENDIENTE
            </span>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#ffb3b3', fontWeight: 400, lineHeight: 1.4 }}>
              ⚠️ {cleanTerm(match.pending_adjustments) || 'Confirmar alineaciones finales 1 hora antes del pitazo inicial.'}
            </p>
          </div>
        </div>

        {/* ── SECTION VIP: MÉTRICAS AVANZADAS ── */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px',
            filter: !isVip ? 'blur(0px)' : 'none' // Title is always visible
          }}>
            {isVip ? <Unlock size={18} color="var(--accent-secondary)" /> : <Lock size={18} color="var(--text-dim)" />}
            <span style={{ fontSize: '0.75rem', color: isVip ? 'var(--accent-secondary)' : 'var(--text-dim)', fontFamily: 'Orbitron', letterSpacing: '2px', fontWeight: 'bold' }}>
              MÉTRICAS AVANZADAS (VIP ONLY)
            </span>
          </div>

          <div style={{ 
            background: 'rgba(255, 215, 0, 0.03)', 
            border: '1px solid rgba(255, 215, 0, 0.15)', 
            borderRadius: '12px', 
            padding: '18px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px',
              filter: !isVip ? 'blur(6px)' : 'none',
              opacity: !isVip ? 0.6 : 1,
              pointerEvents: !isVip ? 'none' : 'auto',
              transition: 'all 0.3s'
            }}>
              {/* xG */}
              <div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                  <Activity size={12} color="var(--accent-secondary)" /> xG PROYECTADO
                </span>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#fff' }}>
                  {match.home}: <strong style={{ color: 'var(--accent-secondary)' }}>{advMetrics.xG_home}</strong><br/>
                  {match.away}: <strong style={{ color: 'var(--accent-secondary)' }}>{advMetrics.xG_away}</strong>
                </p>
              </div>
              
              {/* Lesiones */}
              <div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                  <img src="/icons/portero.png" alt="Reporte Médico" style={{ width: '14px', height: '14px', filter: 'drop-shadow(0 0 2px #ff4444)' }} /> REPORTE MÉDICO
                </span>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#fff' }}>
                  L: {advMetrics.injuries_home}<br/>
                  V: {advMetrics.injuries_away}
                </p>
              </div>

              {/* Fatiga */}
              <div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                  <Thermometer size={12} color="#00c6ff" /> ÍNDICE DE FATIGA
                </span>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#fff' }}>
                  {match.home}: {advMetrics.fatigue_home}% (Desgaste)<br/>
                  {match.away}: {advMetrics.fatigue_away}% (Desgaste)
                </p>
              </div>

              {/* Clima & Árbitro */}
              <div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                  <CloudRain size={12} color="#fff" /> ENTORNO / ÁRBITRO
                </span>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#fff' }}>
                  {advMetrics.weather}<br/>
                  {advMetrics.referee}
                </p>
              </div>
            </div>

            {/* VIP Lock Overlay */}
            {!isVip && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.4)',
                zIndex: 10
              }}>
                <button 
                  onClick={() => { onClose(); onOpenVipModal && onOpenVipModal(); }}
                  className="pes-button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    fontSize: '0.75rem',
                    background: 'var(--accent-secondary)',
                    color: '#000',
                    boxShadow: '0 4px 15px rgba(255,215,0,0.3)',
                    clipPath: 'none',
                    borderRadius: '8px'
                  }}
                >
                  <Lock size={16} /> DESBLOQUEAR CON VIP
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── SECTION 3: DECISION METHODOLOGY BREAKDOWN (60/25/10/5%) ── */}
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '18px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <img src="/icons/tactica.png" alt="Táctica" style={{ width: '20px', height: '20px', filter: 'drop-shadow(0 0 5px var(--accent-color))' }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-color)', fontFamily: 'Orbitron', letterSpacing: '2px', fontWeight: 'bold' }}>
              DESGLOSE METODOLÓGICO DE DECISIÓN
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Metric 1: Forma reciente + xG (60%) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>📈 Forma reciente + xG últimos 8 partidos <span style={{ color: 'var(--accent-color)', fontFamily: 'Orbitron' }}>(60%)</span></span>
                <span style={{ color: 'var(--accent-color)', fontWeight: 'bold', fontFamily: 'Orbitron' }}>{match.metric_form_xg}%</span>
              </div>
              <div style={{ height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${match.metric_form_xg}%`, background: 'var(--accent-color)', boxShadow: '0 0 8px var(--accent-color)' }} />
              </div>
            </div>

            {/* Metric 2: Valor de plantilla (25%) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>💎 Valor de mercado / Calidad de plantel <span style={{ color: '#00c6ff', fontFamily: 'Orbitron' }}>(25%)</span></span>
                <span style={{ color: '#00c6ff', fontWeight: 'bold', fontFamily: 'Orbitron' }}>{match.metric_squad}%</span>
              </div>
              <div style={{ height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${match.metric_squad}%`, background: '#00c6ff', boxShadow: '0 0 8px #00c6ff' }} />
              </div>
            </div>

            {/* Metric 3: Contexto de partido (10%) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '4px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)', fontWeight: 500 }}>
                  <img src="/icons/campo.png" alt="Campo" style={{ width: '14px', height: '14px', filter: 'brightness(0) invert(1) opacity(0.8)' }} /> 
                  Contexto de partido / Localía <span style={{ color: 'var(--accent-secondary)', fontFamily: 'Orbitron' }}>(10%)</span>
                </span>
                <span style={{ color: 'var(--accent-secondary)', fontWeight: 'bold', fontFamily: 'Orbitron' }}>{match.metric_context}%</span>
              </div>
              <div style={{ height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${match.metric_context}%`, background: 'var(--accent-secondary)', boxShadow: '0 0 8px var(--accent-secondary)' }} />
              </div>
            </div>

            {/* Metric 4: Head-to-Head (5%) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>⚔️ Head-to-head últimos 3 años <span style={{ color: '#ff4444', fontFamily: 'Orbitron' }}>(5%)</span></span>
                <span style={{ color: '#ff4444', fontWeight: 'bold', fontFamily: 'Orbitron' }}>{match.metric_h2h}%</span>
              </div>
              <div style={{ height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${match.metric_h2h}%`, background: '#ff4444', boxShadow: '0 0 8px #ff4444' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          className="pes-button" 
          style={{ width: '100%', padding: '12px', fontSize: '0.85rem', letterSpacing: '1px', fontFamily: 'Orbitron' }}
          onClick={onClose}
        >
          CERRAR ANÁLISIS PRO
        </button>
      </motion.div>
    </div>
  );
};

export default AnalysisModal;
