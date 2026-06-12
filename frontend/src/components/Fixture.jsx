import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Flag emoji map ──────────────────────────────────────────────
const FLAGS = {
  // Americanos
  'Argentina': '🇦🇷', 'Brasil': '🇧🇷', 'Brazil': '🇧🇷',
  'México': '🇲🇽', 'Mexico': '🇲🇽', 'Uruguay': '🇺🇾',
  'Colombia': '🇨🇴', 'Ecuador': '🇪🇨', 'Chile': '🇨🇱',
  'Paraguay': '🇵🇾', 'Bolivia': '🇧🇴', 'Venezuela': '🇻🇪',
  'Perú': '🇵🇪', 'Panamá': '🇵🇦', 'Panama': '🇵🇦',
  'Costa Rica': '🇨🇷', 'Haití': '🇭🇹', 'Haiti': '🇭🇹',
  'Canadá': '🇨🇦', 'Canada': '🇨🇦',
  'EE.UU.': '🇺🇸', 'USA': '🇺🇸', 'United States': '🇺🇸',
  'Curaçao': '🇨🇼',
  // Europeos
  'España': '🇪🇸', 'Spain': '🇪🇸', 'Francia': '🇫🇷', 'France': '🇫🇷',
  'Alemania': '🇩🇪', 'Germany': '🇩🇪', 'Italia': '🇮🇹', 'Italy': '🇮🇹',
  'Portugal': '🇵🇹', 'Inglaterra': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Países Bajos': '🇳🇱', 'Netherlands': '🇳🇱', 'Holland': '🇳🇱',
  'Croacia': '🇭🇷', 'Croatia': '🇭🇷', 'Bélgica': '🇧🇪', 'Belgium': '🇧🇪',
  'Suiza': '🇨🇭', 'Switzerland': '🇨🇭', 'Escocia': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Dinamarca': '🇩🇰', 'Denmark': '🇩🇰', 'Suecia': '🇸🇪', 'Sweden': '🇸🇪',
  'Noruega': '🇳🇴', 'Norway': '🇳🇴', 'Polonia': '🇵🇱', 'Poland': '🇵🇱',
  'Turquía': '🇹🇷', 'Turkey': '🇹🇷', 'Ucrania': '🇺🇦', 'Ukraine': '🇺🇦',
  'República Checa': '🇨🇿', 'Czechia': '🇨🇿', 'Serbia': '🇷🇸',
  'Bosnia y Herzegovina': '🇧🇦', 'Bosnia-H': '🇧🇦',
  // Africanos
  'Marruecos': '🇲🇦', 'Morocco': '🇲🇦', 'Senegal': '🇸🇳',
  'Ghana': '🇬🇭', 'Nigeria': '🇳🇬', 'Egipto': '🇪🇬', 'Egypt': '🇪🇬',
  'Sudáfrica': '🇿🇦', 'South Africa': '🇿🇦', 'Uganda': '🇺🇬',
  'Camerún': '🇨🇲', 'Cameroon': '🇨🇲',
  // Asiáticos
  'Qatar': '🇶🇦', 'Japón': '🇯🇵', 'Japan': '🇯🇵',
  'Corea del Sur': '🇰🇷', 'Korea Republic': '🇰🇷', 'South Korea': '🇰🇷',
  'Arabia Saudita': '🇸🇦', 'Saudi Arabia': '🇸🇦',
  'Jordania': '🇯🇴', 'Jordan': '🇯🇴', 'Irak': '🇮🇶', 'Iraq': '🇮🇶',
  'Irán': '🇮🇷', 'Iran': '🇮🇷', 'Australia': '🇦🇺',
  'Nueva Zelanda': '🇳🇿', 'New Zealand': '🇳🇿',
};

const getFlag = (name) => FLAGS[name] || '🏳️';

// ── Status badge ────────────────────────────────────────────────
const StatusBadge = ({ status, score }) => {
  if (score) {
    return (
      <span style={{ fontSize: '0.6rem', fontFamily: 'Orbitron', color: '#00ff88',
        background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)',
        borderRadius: '10px', padding: '2px 8px', letterSpacing: '1px' }}>
        FIN
      </span>
    );
  }
  if (status === 'live') {
    return (
      <span style={{ fontSize: '0.6rem', fontFamily: 'Orbitron', color: '#ff4444',
        background: 'rgba(255,68,68,0.15)', border: '1px solid rgba(255,68,68,0.4)',
        borderRadius: '10px', padding: '2px 8px', letterSpacing: '1px',
        animation: 'pulse 1s infinite' }}>
        ● EN VIVO
      </span>
    );
  }
  return (
    <span style={{ fontSize: '0.6rem', fontFamily: 'Orbitron', color: '#888',
      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '10px', padding: '2px 8px', letterSpacing: '1px' }}>
      PRÓXIMO
    </span>
  );
};

// ── Waving flag component ───────────────────────────────────────
const WavingFlag = ({ flag, size = '1.8rem', winner = false, delay = 0 }) => (
  <motion.span
    style={{ fontSize: size, display: 'inline-block', transformOrigin: 'bottom center',
      filter: winner ? 'drop-shadow(0 0 8px rgba(255,215,0,0.8))' : 'none' }}
    animate={winner
      ? { rotate: [-8, 8, -8], scale: [1, 1.15, 1] }
      : { rotate: [-3, 3, -3] }}
    transition={{ duration: winner ? 0.7 : 2, repeat: Infinity, ease: 'easeInOut', delay }}
  >
    {flag}
  </motion.span>
);

// ── Single Match Card ───────────────────────────────────────────
const MatchCard = ({ match, compact = false, highlight = false, getTeamLogoPath }) => {
  const [hovered, setHovered] = useState(false);
  const hasScore = match.homeScore !== undefined && match.awayScore !== undefined;
  const homeWins = hasScore && match.homeScore > match.awayScore;
  const awayWins = hasScore && match.awayScore > match.homeScore;
  const isDraw   = hasScore && match.homeScore === match.awayScore;

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(0,255,136,0.15)' }}
      style={{
        background: highlight
          ? 'linear-gradient(135deg, rgba(0,255,136,0.08), rgba(0,198,255,0.05))'
          : 'rgba(255,255,255,0.03)',
        border: `1px solid ${highlight ? 'rgba(0,255,136,0.3)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '12px',
        padding: compact ? '10px 14px' : '14px 18px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Shimmer effect */}
      {hovered && (
        <motion.div
          initial={{ x: '-100%' }} animate={{ x: '200%' }}
          transition={{ duration: 0.6 }}
          style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
            pointerEvents: 'none', zIndex: 0 }}
        />
      )}

      {/* Group label */}
      {match.group_name && !compact && (
        <div style={{ fontSize: '0.58rem', color: 'var(--text-dim)', fontFamily: 'Orbitron',
          letterSpacing: '1px', marginBottom: '8px', opacity: 0.7 }}>
          {match.group_name}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
        {/* Home team */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
          <div style={{ position: 'relative', width: compact ? '22px' : '28px', height: compact ? '22px' : '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {match.home === 'TBD' ? (
              <span style={{ fontSize: compact ? '1.2rem' : '1.5rem', filter: 'grayscale(100%) opacity(0.5)' }}>🛡️</span>
            ) : (
              <>
                <img 
                  src={match.homeLogo || (getTeamLogoPath ? getTeamLogoPath(match.home) : '')} 
                  alt={match.home}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', 
                    filter: homeWins ? 'drop-shadow(0 0 6px rgba(255,215,0,0.8))' : 'none' }}
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline-block'; }}
                />
                <div style={{ display: 'none' }}>
                  <WavingFlag flag={getFlag(match.home)} size={compact ? '1.4rem' : '1.7rem'} winner={homeWins} delay={0} />
                </div>
              </>
            )}
          </div>
          <span style={{
            fontFamily: 'Orbitron', fontSize: compact ? '0.65rem' : '0.75rem',
            color: homeWins ? '#00ff88' : isDraw ? '#aaa' : '#fff',
            fontWeight: homeWins ? 700 : 400,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {match.home}
          </span>
        </div>

        {/* Score / VS */}
        <div style={{ textAlign: 'center', flexShrink: 0, minWidth: '60px' }}>
          {hasScore ? (
            <div style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: compact ? '1rem' : '1.3rem',
              color: '#fff', letterSpacing: '2px', textShadow: '0 0 12px rgba(0,255,136,0.4)' }}>
              {match.homeScore} <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span> {match.awayScore}
            </div>
          ) : (
            <div style={{ fontFamily: 'Orbitron', fontSize: '0.7rem', color: 'var(--accent-secondary)',
              fontWeight: 700, letterSpacing: '2px', opacity: 0.8 }}>VS</div>
          )}
          <div style={{ marginTop: '4px' }}>
            <StatusBadge status={match.status} score={hasScore} />
          </div>
        </div>

        {/* Away team */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', minWidth: 0 }}>
          <span style={{
            fontFamily: 'Orbitron', fontSize: compact ? '0.65rem' : '0.75rem',
            color: awayWins ? '#00ff88' : isDraw ? '#aaa' : '#fff',
            fontWeight: awayWins ? 700 : 400,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right',
          }}>
            {match.away}
          </span>
          <div style={{ position: 'relative', width: compact ? '22px' : '28px', height: compact ? '22px' : '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {match.away === 'TBD' ? (
              <span style={{ fontSize: compact ? '1.2rem' : '1.5rem', filter: 'grayscale(100%) opacity(0.5)' }}>🛡️</span>
            ) : (
              <>
                <img 
                  src={match.awayLogo || (getTeamLogoPath ? getTeamLogoPath(match.away) : '')} 
                  alt={match.away}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', 
                    filter: awayWins ? 'drop-shadow(0 0 6px rgba(255,215,0,0.8))' : 'none' }}
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline-block'; }}
                />
                <div style={{ display: 'none' }}>
                  <WavingFlag flag={getFlag(match.away)} size={compact ? '1.4rem' : '1.7rem'} winner={awayWins} delay={0.3} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Probability bar (if available) */}
      {!compact && match.homeProb && (
        <div style={{ marginTop: '10px', display: 'flex', gap: '3px', height: '4px', borderRadius: '4px', overflow: 'hidden' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${match.homeProb}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ background: '#00ff88', height: '100%', borderRadius: '4px 0 0 4px' }} />
          <motion.div initial={{ width: 0 }} animate={{ width: `${match.drawProb || 0}%` }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{ background: '#888', height: '100%' }} />
          <motion.div initial={{ width: 0 }} animate={{ width: `${match.awayProb}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ background: '#ff4444', height: '100%', borderRadius: '0 4px 4px 0' }} />
        </div>
      )}
    </motion.div>
  );
};

// ── Bracket connector SVG ───────────────────────────────────────
const BracketConnector = ({ from, to, color = '#00ff88', delay = 0 }) => {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { setTimeout(() => setDrawn(true), delay * 1000 + 400); }, [delay]);

  const midX = (from.x + to.x) / 2;
  const path = `M ${from.x} ${from.y} C ${midX} ${from.y} ${midX} ${to.y} ${to.x} ${to.y}`;
  const pathLen = 200;

  return (
    <motion.path
      d={path}
      stroke={color}
      strokeWidth={1.5}
      fill="none"
      strokeOpacity={0.4}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: drawn ? 1 : 0, opacity: drawn ? 1 : 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    />
  );
};

// ── Group Stage View ─────────────────────────────────────────────
const GroupStageView = ({ matches, league, getTeamLogoPath }) => {
  // Enrich matches without group_name
  const LETTERS = ['A','B','C','D','E','F','G','H','I','J','K','L'];
  const perGroup = league === 'WC' ? 6 : 5;

  const enriched = matches.map((m, i) => ({
    ...m,
    group_name: m.group_name || `Grupo ${LETTERS[Math.floor(i / perGroup)] || 'Z'}`,
  }));

  // Organize by group
  const groups = {};
  enriched.forEach(m => {
    const g = m.group_name || 'Fase de Grupos';
    if (!groups[g]) groups[g] = [];
    groups[g].push(m);
  });

  const groupKeys = Object.keys(groups);

  if (groupKeys.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📅</div>
        <p style={{ fontFamily: 'Outfit' }}>No hay partidos disponibles. Verifica que el servidor esté activo.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
      {groupKeys.map((groupName, gi) => (
        <motion.div
          key={groupName}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: gi * 0.05 }}
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '14px', padding: '16px', overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div style={{ width: '3px', height: '18px', background: 'var(--accent-color)', borderRadius: '2px' }} />
            <span style={{ fontFamily: 'Orbitron', fontSize: '0.75rem', color: 'var(--accent-color)',
              letterSpacing: '1px', fontWeight: 700 }}>
              {groupName.toUpperCase()}
            </span>
            <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--text-dim)', fontFamily: 'Outfit' }}>
              {groups[groupName].length} partidos
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {groups[groupName].map((match, i) => (
              <MatchCard key={match.id || i} match={match} compact getTeamLogoPath={getTeamLogoPath} />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};


// ── Knockout Bracket ─────────────────────────────────────────────
const KnockoutBracket = ({ rounds, getTeamLogoPath }) => {
  const svgRef = useRef(null);
  const cardRefs = useRef({});
  const [connections, setConnections] = useState([]);

  // Build connections after render
  useEffect(() => {
    if (!svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const newConns = [];

    rounds.forEach((round, ri) => {
      if (ri === rounds.length - 1) return;
      round.matches.forEach((match, mi) => {
        const fromKey = `${ri}-${mi}`;
        const toKey = `${ri + 1}-${Math.floor(mi / 2)}`;
        const fromEl = cardRefs.current[fromKey];
        const toEl = cardRefs.current[toKey];
        if (!fromEl || !toEl) return;
        const fromR = fromEl.getBoundingClientRect();
        const toR = toEl.getBoundingClientRect();
        newConns.push({
          from: { x: fromR.right - svgRect.left, y: (fromR.top + fromR.bottom) / 2 - svgRect.top },
          to: { x: toR.left - svgRect.left, y: (toR.top + toR.bottom) / 2 - svgRect.top },
          delay: ri * 0.2 + mi * 0.1,
        });
      });
    });
    setConnections(newConns);
  }, [rounds]);

  const colors = ['#00ff88', '#00c6ff', '#ffd700', '#ff44aa', '#ff8800'];

  return (
    <div style={{ position: 'relative', overflowX: 'auto', paddingBottom: '20px' }}>
      {/* SVG overlay for connections */}
      <svg
        ref={svgRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
          pointerEvents: 'none', zIndex: 0 }}
      >
        {connections.map((conn, i) => (
          <BracketConnector key={i} from={conn.from} to={conn.to}
            color={colors[Math.floor(i / 4) % colors.length]} delay={conn.delay} />
        ))}
      </svg>

      {/* Rounds */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center',
        minWidth: `${rounds.length * 260}px`, padding: '0 12px', position: 'relative', zIndex: 1 }}>
        {rounds.map((round, ri) => (
          <div key={ri} style={{ flex: '0 0 240px', display: 'flex', flexDirection: 'column',
            justifyContent: 'space-around', gap: '12px' }}>
            {/* Round header */}
            <div style={{ textAlign: 'center', marginBottom: '8px', flexShrink: 0 }}>
              <span style={{ fontFamily: 'Orbitron', fontSize: '0.65rem', letterSpacing: '2px',
                color: colors[ri % colors.length], fontWeight: 700,
                background: `${colors[ri % colors.length]}15`,
                border: `1px solid ${colors[ri % colors.length]}30`,
                borderRadius: '20px', padding: '4px 12px' }}>
                {round.name.toUpperCase()}
              </span>
            </div>

            {/* Matches spaced vertically */}
            <div style={{ display: 'flex', flexDirection: 'column',
              gap: `${Math.pow(2, ri) * 12}px`, flex: 1 }}>
              {round.matches.map((match, mi) => {
                const key = `${ri}-${mi}`;
                return (
                  <div key={key} ref={el => cardRefs.current[key] = el}>
                    <MatchCard match={match} compact highlight={ri === rounds.length - 1} getTeamLogoPath={getTeamLogoPath} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Static WC 2026 Knockout data ─────────────────────────────────
// Exported to useAppStore.js

// ── Top Scorers ──────────────────────────────────────────────────
const TOP_SCORERS = [
  { name: 'LIONEL MESSI', team: 'Argentina', flag: '🇦🇷', goals: 8, assists: 5 },
  { name: 'ERLING HAALAND', team: 'Noruega', flag: '🇳🇴', goals: 7, assists: 2 },
  { name: 'KYLIAN MBAPPÉ', team: 'Francia', flag: '🇫🇷', goals: 6, assists: 4 },
  { name: 'VINICIUS JR.', team: 'Brasil', flag: '🇧🇷', goals: 5, assists: 6 },
  { name: 'HARRY KANE', team: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', goals: 5, assists: 3 },
  { name: 'LAMINE YAMAL', team: 'España', flag: '🇪🇸', goals: 4, assists: 7 },
  { name: 'FLORIAN WIRTZ', team: 'Alemania', flag: '🇩🇪', goals: 4, assists: 5 },
  { name: 'SON HEUNG-MIN', team: 'Corea del Sur', flag: '🇰🇷', goals: 3, assists: 3 },
];

// ── Main Fixture Component ───────────────────────────────────────
const Fixture = ({ matches, league, getTeamLogoPath }) => {
  const [activeSection, setActiveSection] = useState('grupos');
  const isWC = league === 'WC';

  const sections = [
    { id: 'grupos', label: '📋 Fase de Grupos' },
    ...(isWC ? [{ id: 'bracket', label: '🏆 Eliminatoria' }] : []),
    { id: 'goleadores', label: '⚽ Goleadores' },
  ];

  return (
    <div style={{ padding: '0 4px' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '28px' }}
      >
        <h2 className="heading-font" style={{ color: 'var(--accent-color)', fontSize: '1.6rem',
          marginBottom: '6px', letterSpacing: '2px' }}>
          ⚽ FIXTURE & RESULTADOS
        </h2>
        <p style={{ color: 'var(--text-dim)', fontFamily: 'Outfit', fontSize: '0.9rem' }}>
          Todos los partidos, resultados en vivo y bracket de eliminación
        </p>
      </motion.div>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {sections.map(s => (
          <motion.button
            key={s.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveSection(s.id)}
            style={{
              padding: '9px 20px', borderRadius: '30px', border: 'none', cursor: 'pointer',
              fontFamily: 'Orbitron', fontSize: '0.7rem', letterSpacing: '1px', transition: 'all 0.25s',
              background: activeSection === s.id
                ? 'linear-gradient(135deg, var(--accent-color), #00c6ff)'
                : 'rgba(255,255,255,0.05)',
              color: activeSection === s.id ? '#000' : '#aaa',
              fontWeight: activeSection === s.id ? 700 : 400,
              boxShadow: activeSection === s.id ? '0 4px 20px rgba(0,255,136,0.35)' : 'none',
            }}
          >
            {s.label}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {/* GRUPOS */}
          {activeSection === 'grupos' && (
            <GroupStageView matches={matches} league={league} getTeamLogoPath={getTeamLogoPath} />
          )}

          {/* BRACKET ELIMINATORIA (WC only) */}
          {activeSection === 'bracket' && (
            <div>
              <div style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.2)',
                borderRadius: '12px', padding: '12px 18px', marginBottom: '20px',
                display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                <p style={{ fontFamily: 'Outfit', fontSize: '0.8rem', color: '#ffd700', margin: 0 }}>
                  El bracket muestra proyecciones basadas en probabilidades IA. Los resultados reales se actualizarán en tiempo real.
                </p>
              </div>
              <div className="glass-panel" style={{ padding: '20px', overflowX: 'auto' }}>
                <KnockoutBracket rounds={WC_KNOCKOUT} getTeamLogoPath={getTeamLogoPath} />
              </div>
            </div>
          )}

          {/* GOLEADORES */}
          {activeSection === 'goleadores' && (
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '1.4rem' }}>⚽</span>
                <h3 className="heading-font" style={{ fontSize: '1rem', color: 'var(--accent-color)' }}>
                  TABLA DE GOLEADORES
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {TOP_SCORERS.map((player, i) => (
                  <motion.div
                    key={player.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '12px 16px', borderRadius: '10px',
                      background: i === 0
                        ? 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,215,0,0.04))'
                        : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${i === 0 ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    }}
                  >
                    {/* Rank */}
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%',
                      background: i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : 'rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Orbitron', fontWeight: 900, fontSize: '0.75rem',
                      color: i < 3 ? '#000' : '#aaa', flexShrink: 0 }}>
                      {i + 1}
                    </div>

                    {/* Flag + Name */}
                    <WavingFlag flag={player.flag} size="1.5rem" winner={i === 0} delay={i * 0.1} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Orbitron', fontSize: '0.78rem',
                        color: i === 0 ? '#ffd700' : '#fff', fontWeight: 700 }}>
                        {player.name}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'Outfit' }}>
                        {player.team}
                      </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: '1.2rem',
                          color: 'var(--accent-color)', lineHeight: 1 }}>
                          {player.goals}
                        </div>
                        <div style={{ fontSize: '0.58rem', color: 'var(--text-dim)', fontFamily: 'Outfit' }}>
                          GOLES
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '1rem',
                          color: '#00c6ff', lineHeight: 1 }}>
                          {player.assists}
                        </div>
                        <div style={{ fontSize: '0.58rem', color: 'var(--text-dim)', fontFamily: 'Outfit' }}>
                          ASIST.
                        </div>
                      </div>
                    </div>

                    {/* Goal bar */}
                    <div style={{ width: '70px', flexShrink: 0 }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(player.goals / TOP_SCORERS[0].goals) * 100}%` }}
                        transition={{ duration: 1, delay: i * 0.08 }}
                        style={{ height: '4px', background: i === 0
                          ? 'linear-gradient(90deg, #ffd700, #ff8800)'
                          : 'linear-gradient(90deg, var(--accent-color), #00c6ff)',
                          borderRadius: '4px' }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* CSS for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default Fixture;
