import React, { useState, useEffect } from 'react';
import { Trophy, Activity, TrendingUp, Users, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import RadarChart from './components/RadarChart';
import LandingPage from './components/LandingPage';
import FloatingBot from './components/FloatingBot';
import AnalysisModal from './components/AnalysisModal';
import SubscriptionModal from './components/SubscriptionModal';
import EffectivenessGauge from './components/EffectivenessGauge';
import { translations } from './utils/translations';
import './index.css';

const App = () => {
  const [view, setView] = useState('landing');
  const [lang, setLang] = useState('es');
  const [theme, setTheme] = useState('classic');
  const [league, setLeague] = useState('AR'); // AR, US, BR, EU
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('predictions');
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isVip, setIsVip] = useState(false);
  const [vipEmail, setVipEmail] = useState('');
  const [analysisMode, setAnalysisMode] = useState('team'); // 'team' | 'player'

  const t = translations[lang];

  const players = [
    { name: 'EDINSON CAVANI', team: 'Boca Juniors', stats: { shooting: 88, passing: 75, dribbling: 72, physical: 80, defense: 45, speed: 76 }, bio: 'Rendimiento estable. Probabilidad de gol: 72%' },
    { name: 'MIGUEL BORJA', team: 'River Plate', stats: { shooting: 90, passing: 68, dribbling: 70, physical: 85, defense: 30, speed: 74 }, bio: 'Goleador nato. Probabilidad de gol: 85%' },
    { name: 'JUANFER QUINTERO', team: 'Racing Club', stats: { shooting: 82, passing: 92, dribbling: 88, physical: 65, defense: 35, speed: 70 }, bio: 'Visión de juego élite. Probabilidad de asistencia: 78%' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const allMatches = {
          AR: [
            { id: 1, home: 'Boca Juniors', away: 'River Plate', homeProb: 45, drawProb: 30, awayProb: 25, prediction: 'Local' },
            { id: 2, home: 'Racing Club', away: 'Independiente', homeProb: 50, drawProb: 25, awayProb: 25, prediction: 'Local' },
            { id: 3, home: 'San Lorenzo', away: 'Huracán', homeProb: 38, drawProb: 32, awayProb: 30, prediction: 'Empate' },
          ],
          BR: [
            { id: 10, home: 'Flamengo', away: 'Palmeiras', homeProb: 45, drawProb: 25, awayProb: 30, prediction: 'Local' },
            { id: 11, home: 'Corinthians', away: 'São Paulo', homeProb: 35, drawProb: 35, awayProb: 30, prediction: 'Empate' },
            { id: 12, home: 'Atletico MG', away: 'Botafogo', homeProb: 52, drawProb: 22, awayProb: 26, prediction: 'Local' },
          ],
          EU: [
            { id: 20, home: 'Real Madrid', away: 'Man City', homeProb: 38, drawProb: 24, awayProb: 38, prediction: 'Local' },
            { id: 21, home: 'Bayern', away: 'Arsenal', homeProb: 42, drawProb: 28, awayProb: 30, prediction: 'Local' },
            { id: 22, home: 'PSG', away: 'Barcelona', homeProb: 36, drawProb: 27, awayProb: 37, prediction: 'Empate' },
          ],
          ES: [
            { id: 30, home: 'Real Madrid', away: 'Barcelona', homeProb: 44, drawProb: 24, awayProb: 32, prediction: 'Local' },
            { id: 31, home: 'Atlético Madrid', away: 'Sevilla', homeProb: 50, drawProb: 25, awayProb: 25, prediction: 'Local' },
            { id: 32, home: 'Athletic Club', away: 'Real Sociedad', homeProb: 40, drawProb: 30, awayProb: 30, prediction: 'Empate' },
          ],
          EN: [
            { id: 40, home: 'Man City', away: 'Arsenal', homeProb: 48, drawProb: 22, awayProb: 30, prediction: 'Local' },
            { id: 41, home: 'Liverpool', away: 'Chelsea', homeProb: 45, drawProb: 25, awayProb: 30, prediction: 'Local' },
            { id: 42, home: 'Aston Villa', away: 'Tottenham', homeProb: 38, drawProb: 28, awayProb: 34, prediction: 'Empate' },
          ],
          DE: [
            { id: 50, home: 'Bayern Munich', away: 'Borussia Dortmund', homeProb: 55, drawProb: 20, awayProb: 25, prediction: 'Local' },
            { id: 51, home: 'Bayer Leverkusen', away: 'RB Leipzig', homeProb: 45, drawProb: 28, awayProb: 27, prediction: 'Local' },
          ],
          IT: [
            { id: 60, home: 'Inter Milan', away: 'AC Milan', homeProb: 46, drawProb: 26, awayProb: 28, prediction: 'Local' },
            { id: 61, home: 'Juventus', away: 'Napoli', homeProb: 38, drawProb: 30, awayProb: 32, prediction: 'Empate' },
          ],
          US: [
            { id: 70, home: 'Inter Miami', away: 'LA Galaxy', homeProb: 60, drawProb: 20, awayProb: 20, prediction: 'Local' },
            { id: 71, home: 'NY Red Bulls', away: 'Orlando City', homeProb: 40, drawProb: 30, awayProb: 30, prediction: 'Empate' },
          ],
          MX: [
            { id: 80, home: 'Club América', away: 'Chivas', homeProb: 48, drawProb: 26, awayProb: 26, prediction: 'Local' },
            { id: 81, home: 'Cruz Azul', away: 'Pumas UNAM', homeProb: 42, drawProb: 28, awayProb: 30, prediction: 'Local' },
          ],
        };

        setMatches(allMatches[league] || []);

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [league]);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  if (view === 'landing') {
    return <LandingPage onEnter={() => setView('dashboard')} t={t} />;
  }

  return (
    <div className="min-h-screen">
      {loading && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="loading-overlay"
        >
          <div className="pes-spinner"></div>
          <h2 className="heading-font" style={{ marginTop: '20px', color: 'var(--accent-color)' }}>{t.loading}</h2>
        </motion.div>
      )}

      {/* Header */}
      <header className="glass-panel" style={{ margin: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <h1 className="heading-font" style={{ color: 'var(--accent-color)', fontSize: '1.5rem' }}>
          BET AI <span style={{ color: 'var(--text-main)' }}>PREDICTOR</span>
        </h1>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            style={{ background: 'none', color: '#fff', border: '1px solid var(--accent-color)', borderRadius: '4px', padding: '5px' }}
          >
            <option value="es" style={{ background: '#000' }}>ES</option>
            <option value="en" style={{ background: '#000' }}>EN</option>
            <option value="pt" style={{ background: '#000' }}>PT</option>
          </select>

          <select 
            value={theme} 
            onChange={(e) => setTheme(e.target.value)}
            style={{ background: 'none', color: '#fff', border: '1px solid var(--accent-color)', borderRadius: '4px', padding: '5px' }}
          >
            <option value="classic" style={{ background: '#000' }}>{t.themes.classic}</option>
            <option value="modern" style={{ background: '#000' }}>{t.themes.modern}</option>
            <option value="elite" style={{ background: '#000' }}>{t.themes.elite}</option>
          </select>

          <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <button className={activeTab === 'predictions' ? 'active-tab' : ''} onClick={() => setActiveTab('predictions')}>{t.predictions}</button>
            <button className={activeTab === 'analysis' ? 'active-tab' : ''} onClick={() => setActiveTab('analysis')}>{t.analysis}</button>
            {isVip ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,215,0,0.15)', border: '1px solid var(--accent-secondary)', borderRadius: '20px', padding: '5px 14px', fontSize: '0.72rem', color: 'var(--accent-secondary)', fontFamily: 'Orbitron', letterSpacing: '1px' }}>
                👑 VIP ACTIVO
              </div>
            ) : (
              <button 
                className="pes-button" 
                style={{ clipPath: 'none', padding: '5px 12px', fontSize: '0.7rem', background: 'var(--accent-secondary)', color: '#000' }}
                onClick={() => setIsVipModalOpen(true)}
              >
                GO VIP
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* League Selector */}
      <div style={{ padding: '0 20px', marginBottom: '20px' }}>
        <div className="league-selector-container" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '1.5px', fontFamily: 'Orbitron', flexShrink: 0 }}>LIGA</span>
          <div style={{ position: 'relative', flex: '0 0 auto' }}>
            <select
              value={league}
              onChange={e => setLeague(e.target.value)}
              style={{
                appearance: 'none',
                WebkitAppearance: 'none',
                background: '#0d1117',
                border: '1px solid var(--accent-color)',
                borderRadius: '10px',
                color: '#fff',
                padding: '10px 44px 10px 16px',
                fontSize: '0.88rem',
                fontFamily: 'Outfit, sans-serif',
                cursor: 'pointer',
                outline: 'none',
                minWidth: '220px',
              }}
            >
              <optgroup label="🌎 Sudamérica" style={{ background: '#0d1117', color: '#888', fontSize: '0.72rem', padding: '6px 0' }}>
                <option value="AR" style={{ background: '#0d1117', color: '#fff', padding: '10px 16px', fontSize: '0.9rem', lineHeight: '2' }}>🇦🇷 Liga Argentina Profesional</option>
                <option value="BR" style={{ background: '#0d1117', color: '#fff', padding: '10px 16px', fontSize: '0.9rem', lineHeight: '2' }}>🇧🇷 Brasileirao Serie A</option>
              </optgroup>
              <optgroup label="🌍 Europa" style={{ background: '#0d1117', color: '#888', fontSize: '0.72rem', padding: '6px 0' }}>
                <option value="EU" style={{ background: '#0d1117', color: '#fff', padding: '10px 16px', fontSize: '0.9rem', lineHeight: '2' }}>🏆 UEFA Champions League</option>
                <option value="ES" style={{ background: '#0d1117', color: '#fff', padding: '10px 16px', fontSize: '0.9rem', lineHeight: '2' }}>🇪🇸 La Liga (España)</option>
                <option value="EN" style={{ background: '#0d1117', color: '#fff', padding: '10px 16px', fontSize: '0.9rem', lineHeight: '2' }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League (Inglaterra)</option>
                <option value="DE" style={{ background: '#0d1117', color: '#fff', padding: '10px 16px', fontSize: '0.9rem', lineHeight: '2' }}>🇩🇪 Bundesliga (Alemania)</option>
                <option value="IT" style={{ background: '#0d1117', color: '#fff', padding: '10px 16px', fontSize: '0.9rem', lineHeight: '2' }}>🇮🇹 Serie A (Italia)</option>
              </optgroup>
              <optgroup label="🌎 Norteamérica" style={{ background: '#0d1117', color: '#888', fontSize: '0.72rem', padding: '6px 0' }}>
                <option value="US" style={{ background: '#0d1117', color: '#fff', padding: '10px 16px', fontSize: '0.9rem', lineHeight: '2' }}>🇺🇸 MLS (Estados Unidos)</option>
                <option value="MX" style={{ background: '#0d1117', color: '#fff', padding: '10px 16px', fontSize: '0.9rem', lineHeight: '2' }}>🇲🇽 Liga MX (México)</option>
              </optgroup>
            </select>
            {/* Custom arrow */}
            <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--accent-color)', fontSize: '0.7rem' }}>▼</div>
          </div>
          {/* Active league badge */}
          <motion.div
            key={league}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(0,255,136,0.08)',
              border: '1px solid rgba(0,255,136,0.25)',
              borderRadius: '20px', padding: '6px 14px',
              fontSize: '0.72rem', color: 'var(--accent-color)',
              fontFamily: 'Orbitron', letterSpacing: '1px',
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-color)', boxShadow: '0 0 6px var(--accent-color)', display: 'inline-block' }} />
            EN VIVO
          </motion.div>
        </div>
      </div>

      <main className="dashboard-grid">
        {/* Prediction Cards */}
        <section className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <BrainCircuit color="var(--accent-color)" />
            <h2 className="heading-font">IA Predictions</h2>
          </div>
          {matches.map(match => (
            <motion.div 
              key={match.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="match-card"
              style={{ marginBottom: '15px', padding: '15px', borderLeft: '4px solid var(--accent-color)', background: 'rgba(255,255,255,0.05)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="heading-font" style={{ fontSize: '0.9rem' }}>{match.home}</span>
                <span style={{ color: 'var(--accent-secondary)' }}>VS</span>
                <span className="heading-font" style={{ fontSize: '0.9rem' }}>{match.away}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="prob-bar">
                  <div style={{ width: `${match.homeProb}%`, background: 'var(--accent-color)' }}></div>
                  <span style={{ fontSize: '0.7rem' }}>L: {match.homeProb}%</span>
                </div>
                <div className="prob-bar">
                  <div style={{ width: `${match.drawProb}%`, background: '#888' }}></div>
                  <span style={{ fontSize: '0.7rem' }}>E: {match.drawProb}%</span>
                </div>
                <div className="prob-bar">
                  <div style={{ width: `${match.awayProb}%`, background: '#ff4444' }}></div>
                  <span style={{ fontSize: '0.7rem' }}>V: {match.awayProb}%</span>
                </div>
              </div>
              <button 
                className="pes-button" 
                style={{ width: '100%', marginTop: '10px', padding: '8px' }}
                onClick={() => {
                  setSelectedMatch(match);
                  setIsModalOpen(true);
                }}
              >
                {t.analyzePro}
              </button>
            </motion.div>
          ))}
        </section>

        {/* ── Unified Analysis Panel ── */}
        <section className="glass-panel">
          {/* Toggle header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', justifyContent: 'center' }} className="mobile-only-header">
              {analysisMode === 'team' ? <Trophy color="var(--accent-secondary)" size={20} /> : <Users color="var(--accent-color)" size={20} />}
              <h2 className="heading-font" style={{ fontSize: '1rem' }}>ANÁLISIS</h2>
            </div>
            {/* Mode toggle pills */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '4px', gap: '4px', margin: '0 auto' }}>
              {[{ id: 'team', label: '🏟️ Equipo' }, { id: 'player', label: '👤 Jugador' }].map(m => (
                <button
                  key={m.id}
                  onClick={() => setAnalysisMode(m.id)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '7px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontFamily: 'Orbitron, sans-serif',
                    letterSpacing: '0.5px',
                    transition: 'all 0.2s',
                    background: analysisMode === m.id
                      ? (m.id === 'team' ? 'var(--accent-secondary)' : 'var(--accent-color)')
                      : 'transparent',
                    color: analysisMode === m.id ? '#000' : 'var(--text-dim)',
                    fontWeight: analysisMode === m.id ? 700 : 400,
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── TEAM VIEW ── */}
          {analysisMode === 'team' && (() => {
            const teamData = {
              AR: { name: 'Boca Juniors', stats: [85, 78, 92, 80, 75, 88], color: '#ffd700', form: 'VVEVP', goals: 28, conceded: 12, possession: '58%', wins: 14 },
              BR: { name: 'Flamengo',     stats: [88, 82, 80, 85, 78, 90], color: '#ff4444', form: 'VVVEP', goals: 34, conceded: 15, possession: '61%', wins: 16 },
              EU: { name: 'Real Madrid',  stats: [95, 90, 85, 92, 98, 95], color: '#ffd700', form: 'VVVVV', goals: 52, conceded: 18, possession: '63%', wins: 22 },
              ES: { name: 'Real Madrid',  stats: [94, 88, 87, 91, 96, 93], color: '#ffd700', form: 'VVEVV', goals: 48, conceded: 20, possession: '62%', wins: 20 },
              EN: { name: 'Man City',     stats: [92, 86, 90, 88, 94, 80], color: '#6ec6ff', form: 'VEVVV', goals: 45, conceded: 19, possession: '65%', wins: 19 },
              DE: { name: 'Bayern Munich',stats: [96, 84, 88, 90, 92, 82], color: '#ff4444', form: 'VVVPV', goals: 58, conceded: 22, possession: '64%', wins: 21 },
              IT: { name: 'Inter Milan',  stats: [88, 90, 80, 86, 88, 75], color: '#6ec6ff', form: 'VVEVV', goals: 40, conceded: 16, possession: '57%', wins: 18 },
              US: { name: 'Inter Miami',  stats: [92, 65, 88, 70, 72, 60], color: '#ff69b4', form: 'VVVEV', goals: 36, conceded: 24, possession: '55%', wins: 15 },
              MX: { name: 'Club América', stats: [85, 80, 78, 82, 80, 72], color: '#ffd700', form: 'VPVVV', goals: 32, conceded: 18, possession: '56%', wins: 14 },
            };
            const team = teamData[league] || teamData.AR;
            const formColors = { V: 'var(--accent-color)', E: '#888', P: '#ff4444' };
            const formLabels = { V: 'V', E: 'E', P: 'P' };
            return (
              <motion.div key={league} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <h3 style={{ color: team.color, fontFamily: 'Orbitron', fontSize: '1.1rem', marginBottom: '4px' }}>{team.name}</h3>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', letterSpacing: '1px' }}>MÉTRICAS DE RENDIMIENTO</p>
                </div>
                <RadarChart stats={team.stats} labels={['Ataque', 'Defensa', 'Posesión', 'Físico', 'Táctica', 'Cantera']} name={team.name} color={team.color} />
                {/* Stat cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
                  {[
                    { label: 'Goles a favor', value: team.goals },
                    { label: 'Goles en contra', value: team.conceded },
                    { label: 'Posesión media', value: team.possession },
                    { label: 'Victorias', value: team.wins },
                  ].map((s, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px', textAlign: 'center', border: `1px solid ${team.color}22` }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900, fontFamily: 'Orbitron', color: team.color }}>{s.value}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '3px' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                {/* Form strip */}
                <div style={{ marginTop: '18px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', letterSpacing: '1px', marginBottom: '8px' }}>ÚLTIMOS 5 PARTIDOS</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {team.form.split('').map((r, i) => (
                      <div key={i} style={{ width: '36px', height: '36px', borderRadius: '8px', background: formColors[r], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: '#000' }}>{formLabels[r]}</div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })()}

          {/* ── PLAYER VIEW ── */}
          {analysisMode === 'player' && (
            <motion.div key="player" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {/* Player selector */}
              <select
                value={selectedPlayer}
                onChange={e => setSelectedPlayer(Number(e.target.value))}
                style={{
                  width: '100%', marginBottom: '20px',
                  background: '#0d1117', color: '#fff',
                  border: '1px solid var(--accent-color)',
                  borderRadius: '10px', padding: '10px 16px',
                  fontSize: '0.9rem', fontFamily: 'Outfit, sans-serif',
                  cursor: 'pointer', outline: 'none',
                }}
              >
                {players.map((p, i) => (
                  <option key={i} value={i} style={{ background: '#0d1117', padding: '8px', lineHeight: '2' }}>
                    {p.name} — {p.team}
                  </option>
                ))}
              </select>

              {/* Player card */}
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <h3 style={{ color: 'var(--accent-color)', fontFamily: 'Orbitron', fontSize: '1rem', marginBottom: '2px' }}>{players[selectedPlayer].name}</h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', letterSpacing: '1px' }}>{players[selectedPlayer].team}</p>
              </div>
              <RadarChart stats={Object.values(players[selectedPlayer].stats)} name={players[selectedPlayer].name} color="#00ff88" />

              {/* Individual stat bars */}
              <div style={{ marginTop: '20px' }}>
                {Object.entries(players[selectedPlayer].stats).map(([key, val], i) => (
                  <div key={key} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '5px' }}>
                      <span style={{ color: 'var(--text-dim)', textTransform: 'capitalize' }}>{key}</span>
                      <span style={{ color: 'var(--accent-color)', fontWeight: 700 }}>{val}</span>
                    </div>
                    <div style={{ height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '3px', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.08 }}
                        style={{ height: '100%', background: `linear-gradient(90deg, #00ff8866, #00ff88)`, borderRadius: '3px' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(0,255,136,0.05)', borderRadius: '10px', border: '1px solid rgba(0,255,136,0.15)', fontSize: '0.82rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                💡 {players[selectedPlayer].bio}
              </div>
            </motion.div>
          )}
        </section>

        {/* Recent Performance Section */}
        <section className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Activity color="var(--accent-color)" />
            <h2 className="heading-font">Racha Equipos</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {['Boca Juniors', 'River Plate', 'Racing Club', 'Independiente'].map(team => (
              <div key={team} className="streak-item">
                <span>{team}</span>
                <div className="dots">
                  <span className="dot win">W</span>
                  <span className="dot win">W</span>
                  <span className="dot draw">D</span>
                  <span className="dot win">W</span>
                  <span className="dot loss">L</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Effectiveness Gauge */}
        <EffectivenessGauge league={league} />
      </main>
      <FloatingBot t={t} />
      <AnalysisModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        match={selectedMatch}
        t={t}
      />
      <SubscriptionModal 
        isOpen={isVipModalOpen} 
        onClose={() => setIsVipModalOpen(false)} 
        t={t}
        onVipActivated={(email) => {
          setIsVip(true);
          setVipEmail(email);
          setIsVipModalOpen(false);
        }}
      />
    </div>
  );
};

export default App;
