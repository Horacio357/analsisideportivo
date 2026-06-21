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
import Corazonadas from './components/Corazonadas';
import Fixture from './components/Fixture';
import { translations } from './utils/translations';
import { getPlayersData, allMatchesFallback, fillFallbackBettingDetails, WC_KNOCKOUT } from './store/useAppStore';
import { triggerCelebration } from './utils/effects';
import './index.css';

const getTeamLogoPath = (teamName) => {
  if (!teamName) return null;
  const name = teamName.toLowerCase().trim();
  if (name.includes('boca')) return '/escudos/AR/boca.png';
  if (name.includes('river')) return '/escudos/AR/river.png';
  if (name.includes('racing')) return '/escudos/AR/racing.png';
  if (name.includes('independiente')) return '/escudos/AR/independiente.png';
  if (name.includes('san lorenzo')) return '/escudos/AR/sanlorenzo.png';
  if (name.includes('huracán') || name.includes('huracan')) return '/escudos/AR/huracan.png';
  
  if (name.includes('flamengo')) return '/escudos/BR/flamengo.png';
  if (name.includes('palmeiras')) return '/escudos/BR/palmeiras.png';
  if (name.includes('corinthians')) return '/escudos/BR/corinthians.png';
  if (name.includes('são paulo') || name.includes('sao paulo')) return '/escudos/BR/saopaulo.png';
  if (name.includes('atletico mg') || name.includes('mineiro')) return '/escudos/BR/atlmineiro.png';
  if (name.includes('botafogo')) return '/escudos/BR/botafogo.png';
  
  if (name.includes('real madrid')) return '/escudos/ES/realmadrid.png';
  if (name.includes('barcelona')) return '/escudos/ES/barcelona.png';
  if (name.includes('atlético') || name.includes('atletico madrid')) return '/escudos/ES/atlmadrid.png';
  if (name.includes('sevilla')) return '/escudos/ES/sevilla.png';
  if (name.includes('athletic')) return '/escudos/ES/athletic.png';
  if (name.includes('sociedad')) return '/escudos/ES/realsociedad.png';
  
  if (name.includes('man city') || name.includes('manchester city')) return '/escudos/EN/manchestercity.png';
  if (name.includes('arsenal')) return '/escudos/EN/arsenal.png';
  if (name.includes('liverpool')) return '/escudos/EN/liverpool.png';
  if (name.includes('chelsea')) return '/escudos/EN/chelsea.png';
  if (name.includes('aston villa')) return '/escudos/EN/astonvilla.png';
  if (name.includes('tottenham')) return '/escudos/EN/tottenham.png';
  
  if (name.includes('bayern')) return '/escudos/DE/bayernmunchen.png';
  if (name.includes('dortmund')) return '/escudos/DE/borussiadortmund.png';
  if (name.includes('leverkusen')) return '/escudos/DE/bayerleverkusen.png';
  if (name.includes('leipzig')) return '/escudos/DE/rbleipzig.png';
  
  if (name.includes('inter milan') || name.includes('internazionale')) return '/escudos/IT/inter.png';
  if (name.includes('ac milan') || name.includes('milan')) return '/escudos/IT/milan.png';
  if (name.includes('juventus')) return '/escudos/IT/juventus.png';
  if (name.includes('napoli')) return '/escudos/IT/napoli.png';
  
  if (name.includes('psg') || name.includes('paris saint')) return '/escudos/FR/psg.png';
  if (name.includes('lyon')) return '/escudos/FR/olympiquelyon.png';
  if (name.includes('monaco')) return '/escudos/FR/monaco.png';
  if (name.includes('marsella') || name.includes('marseille')) return '/escudos/FR/olimpiquemarsella.png';
  
  if (name.includes('benfica')) return '/escudos/PT/benfica.png';
  if (name.includes('porto')) return '/escudos/PT/porto.png';
  if (name.includes('sporting')) return '/escudos/PT/sporting.png';
  if (name.includes('braga')) return '/escudos/PT/braga.png';
  
  if (name.includes('miami')) return '/escudos/US/intermiami.png';
  if (name.includes('galaxy')) return '/escudos/US/losangelesgalaxy.png';
  if (name.includes('red bulls') || name.includes('new york')) return '/escudos/US/newyork.png';
  if (name.includes('orlando')) return '/escudos/US/orlandocity.png';
  
  if (name.includes('américa') || name.includes('america')) return '/escudos/MX/america.png';
  if (name.includes('cruz azul')) return '/escudos/MX/cruzazul.png';
  if (name.includes('chivas') || name.includes('guadalajara')) return '/escudos/MX/guadalajara.png';
  if (name.includes('pumas')) return '/escudos/MX/pumas.png';

  // World Cup / Nations
  if (name.includes('argentina')) return '/escudos/WC/argentina.png';
  if (name.includes('arabia') || name.includes('saudi') || name.includes('jordania')) return '/escudos/WC/arabiasaudita.png';
  if (name.includes('españa') || name.includes('espana') || name.includes('spain')) return '/escudos/WC/espana.png';
  if (name.includes('nueva zelanda') || name.includes('new zealand')) return '/escudos/WC/nuevazelanda.png';
  if (name.includes('francia') || name.includes('france')) return '/escudos/WC/francia.png';
  if (name.includes('senegal') || name.includes('uganda')) return '/escudos/WC/senegal.png';
  if (name.includes('méxico') || name.includes('mexico')) return '/escudos/WC/mexico.png';
  if (name.includes('suecia') || name.includes('sweden')) return '/escudos/WC/suecia.png';
  if (name.includes('inglaterra') || name.includes('england')) return '/escudos/WC/inglaterra.png';
  if (name.includes('ecuador')) return '/escudos/WC/ecuador.png';
  if (name.includes('brasil') || name.includes('brazil')) return '/escudos/WC/brasil.png';
  if (name.includes('uruguay')) return '/escudos/WC/uruguay.png';
  if (name.includes('países bajos') || name.includes('paises bajos') || name.includes('holanda') || name.includes('netherlands')) return '/escudos/WC/paisesbajos.png';
  if (name.includes('colombia')) return '/escudos/WC/colombia.png';
  if (name.includes('portugal')) return '/escudos/WC/portugal.png';
  if (name.includes('croacia') || name.includes('croatia')) return '/escudos/WC/croacia.png';
  if (name.includes('ee.uu.') || name.includes('usa') || name.includes('estados unidos')) return '/escudos/WC/usa.png';
  if (name.includes('marruecos') || name.includes('morocco')) return '/escudos/WC/marruecos.png';
  if (name.includes('iran') || name.includes('irán')) return '/escudos/WC/iran.png';
  if (name.includes('iraq') || name.includes('irak')) return '/escudos/WC/iraq.png'; // Might fallback to null if no image, but let's add common
  if (name.includes('norway') || name.includes('noruega')) return '/escudos/WC/noruega.png';
  if (name.includes('ghana')) return '/escudos/WC/ghana.png';
  if (name.includes('panama') || name.includes('panamá')) return '/escudos/WC/panama.png';
  if (name.includes('czechia') || name.includes('czech') || name.includes('checa')) return '/escudos/WC/republicacheca.png';
  if (name.includes('south africa') || name.includes('sudafrica') || name.includes('sudáfrica')) return '/escudos/WC/sudafrica.png';
  if (name.includes('switzerland') || name.includes('suiza')) return '/escudos/WC/suiza.png';
  if (name.includes('bosnia')) return '/escudos/WC/bosnia.png';
  if (name.includes('canada') || name.includes('canadá')) return '/escudos/WC/canada.png';
  if (name.includes('qatar')) return '/escudos/WC/qatar.png';
  if (name.includes('australia')) return '/escudos/WC/australia.png';
  if (name.includes('scotland') || name.includes('escocia')) return '/escudos/WC/escocia.png';
  if (name.includes('turkey') || name.includes('turquia') || name.includes('turquía')) return '/escudos/WC/turquia.png';
  if (name.includes('paraguay')) return '/escudos/WC/paraguay.png';
  if (name.includes('germany') || name.includes('alemania')) return '/escudos/WC/alemania.png';
  if (name.includes('ivory coast') || name.includes('costa de marfil')) return '/escudos/WC/costademarfil.png';
  if (name.includes('haiti') || name.includes('haití')) return '/escudos/WC/haiti.png';
  if (name.includes('curaçao') || name.includes('curazao')) return '/escudos/WC/curacao.png';
  if (name.includes('chile')) return '/escudos/WC/chile.png';
  if (name.includes('peru') || name.includes('perú')) return '/escudos/WC/peru.png';
  if (name.includes('venezuela')) return '/escudos/WC/venezuela.png';
  if (name.includes('bolivia')) return '/escudos/WC/bolivia.png';
  if (name.includes('wales') || name.includes('gales')) return '/escudos/WC/gales.png';
  if (name.includes('poland') || name.includes('polonia')) return '/escudos/WC/polonia.png';
  if (name.includes('denmark') || name.includes('dinamarca')) return '/escudos/WC/dinamarca.png';
  if (name.includes('japan') || name.includes('japon') || name.includes('japón')) return '/escudos/WC/japon.png';
  if (name.includes('korea') || name.includes('corea')) return '/escudos/WC/coreadelsur.png';
  if (name.includes('italy') || name.includes('italia')) return '/escudos/WC/italia.png';
  if (name.includes('belgium') || name.includes('belgica') || name.includes('bélgica')) return '/escudos/WC/belgica.png';
  if (name.includes('cameroon') || name.includes('camerun') || name.includes('camerún')) return '/escudos/WC/camerun.png';
  if (name.includes('nigeria')) return '/escudos/WC/nigeria.png';
  
  return null;
};

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
  const [selectedTeams, setSelectedTeams] = useState([]); // array of team names for comparison

  const t = translations[lang];

  const players = getPlayersData(league);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://187.127.251.141:8000';
        const response = await axios.get(`${apiUrl}/matches?league_id=${league}`, { timeout: 2500 });
        if (response.data && response.data.status === 'success' && response.data.matches && response.data.matches.length > 0) {
          setMatches(response.data.matches);
        } else {
          // Empty or failed response from API, use fallback
          const fallbackData = (allMatchesFallback[league] || []).map(m => fillFallbackBettingDetails(m, league));
          setMatches(fallbackData);
        }
      } catch (err) {
        console.warn("Error fetching data, using fallback:", err);
        const fallbackData = (allMatchesFallback[league] || []).map(m => fillFallbackBettingDetails(m, league));
        setMatches(fallbackData);
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
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }}
      className="min-h-screen" style={{ width: '100%', overflowX: 'hidden' }}
    >
      {/* Background Grid */}
      <div className="bg-grid"></div>

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
      <motion.header 
        variants={{ hidden: { y: -50, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } }}
        className="glass-panel" style={{ margin: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 className="heading-font" style={{ color: 'var(--accent-color)', fontSize: '1.5rem', margin: 0, lineHeight: 1.2 }}>
            XGuru
          </h1>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', letterSpacing: '1px', fontStyle: 'italic', fontFamily: 'Outfit' }}>
            "Trust the xG"
          </span>
        </div>
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
            <button className={activeTab === 'corazonadas' ? 'active-tab' : ''} onClick={() => setActiveTab('corazonadas')}>CORAZONADAS</button>
            <button className={activeTab === 'fixture' ? 'active-tab' : ''} onClick={() => setActiveTab('fixture')}>⚽ FIXTURE</button>
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
      </motion.header>

      {/* League Selector */}
      <motion.div 
        variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { type: 'spring' } } }}
        className="league-selector-wrapper" style={{ padding: '0 20px', marginBottom: '20px' }}
      >
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
              <optgroup label="🌍 Internacional" style={{ background: '#0d1117', color: '#888', fontSize: '0.72rem', padding: '6px 0' }}>
                <option value="WC" style={{ background: '#0d1117', color: '#fff', padding: '10px 16px', fontSize: '0.9rem', lineHeight: '2' }}>🏆 Copa del Mundo</option>
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
      </motion.div>

      <motion.main 
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        className="dashboard-grid"
      >
        {activeTab === 'predictions' ? (
          <>
            {/* Prediction Cards */}
            <section className="glass-panel">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <img src="/icons/analisis.png" alt="Análisis" style={{ width: '24px', height: '24px', filter: 'drop-shadow(0 0 8px var(--accent-color))' }} />
                <h2 className="heading-font">IA Predictions</h2>
              </div>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              >
                {matches.map((match) => (
                  <motion.div 
                    key={match.id}
                    variants={{ hidden: { x: -30, opacity: 0 }, visible: { x: 0, opacity: 1 } }}
                    whileHover={{ translateY: '-4px', boxShadow: '0 12px 40px rgba(0,0,0,0.4)', borderLeftColor: 'var(--accent-secondary)' }}
                    className="match-card"
                    style={{ marginBottom: '15px', padding: '15px', borderLeft: '4px solid var(--accent-color)', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', gap: '8px', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', maxWidth: '42%' }}>
                        {getTeamLogoPath(match.home) && (
                          <img 
                            src={getTeamLogoPath(match.home)} 
                            alt={match.home} 
                            style={{ width: '18px', height: '18px', objectFit: 'contain', flexShrink: 0 }} 
                          />
                        )}
                        <span className="heading-font" style={{ fontSize: 'var(--team-font-size)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{match.home}</span>
                      </div>
                      
                      <span style={{ color: 'var(--accent-secondary)', fontSize: '0.72rem', fontWeight: 'bold', fontFamily: 'Orbitron', textShadow: '0 0 10px var(--accent-secondary)' }}>VS</span>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', maxWidth: '42%', justifyContent: 'flex-end' }}>
                        <span className="heading-font" style={{ fontSize: 'var(--team-font-size)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{match.away}</span>
                        {getTeamLogoPath(match.away) && (
                          <img 
                            src={getTeamLogoPath(match.away)} 
                            alt={match.away} 
                            style={{ width: '18px', height: '18px', objectFit: 'contain', flexShrink: 0 }} 
                          />
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div className="prob-bar">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${match.homeProb}%` }} transition={{ duration: 1, ease: 'easeOut' }} style={{ background: 'var(--accent-color)', height: '100%' }}></motion.div>
                        <span style={{ fontSize: 'var(--bar-text-size)' }}>L: {match.homeProb}%</span>
                      </div>
                      <div className="prob-bar">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${match.drawProb}%` }} transition={{ duration: 1, ease: 'easeOut' }} style={{ background: '#888', height: '100%' }}></motion.div>
                        <span style={{ fontSize: 'var(--bar-text-size)' }}>E: {match.drawProb}%</span>
                      </div>
                      <div className="prob-bar">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${match.awayProb}%` }} transition={{ duration: 1, ease: 'easeOut' }} style={{ background: '#ff4444', height: '100%' }}></motion.div>
                        <span style={{ fontSize: 'var(--bar-text-size)' }}>V: {match.awayProb}%</span>
                      </div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      className="pes-button" 
                      style={{ width: '100%', marginTop: '10px', padding: '8px', fontSize: '0.8rem' }}
                      onClick={() => {
                        triggerCelebration();
                        setSelectedMatch(match);
                        setIsModalOpen(true);
                      }}
                    >
                      {t.analyzePro}
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
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
                  {[
                    { id: 'team', icon: '/icons/equipo.png', label: league === 'WC' ? 'Selección' : 'Equipo' }, 
                    { id: 'player', icon: '/icons/jugador.png', label: 'Jugador' }
                  ].map(m => (
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
                      {/* Icon with brightness filter to match active state */}
                      <img 
                        src={m.icon} 
                        alt={m.label} 
                        style={{ 
                          width: '16px', height: '16px', 
                          filter: analysisMode === m.id ? 'brightness(0)' : 'brightness(0) invert(1) opacity(0.6)',
                          transition: 'all 0.2s'
                        }} 
                      />
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── TEAM VIEW ── */}
              {analysisMode === 'team' && (() => {
                const allTeams = {
                  WC: [
                    { name: 'Argentina', stats: [92, 88, 90, 85, 90, 88], color: '#75aadb', form: 'VVVVV', goals: 24, conceded: 4, possession: '64%', wins: 7 },
                    { name: 'Arabia Saudita', stats: [65, 62, 60, 68, 65, 58], color: '#ff0000', form: 'DVEVD', goals: 10, conceded: 15, possession: '42%', wins: 3 },
                    { name: 'España', stats: [94, 86, 92, 80, 92, 90], color: '#c60b1e', form: 'VVVEV', goals: 26, conceded: 6, possession: '68%', wins: 6 },
                    { name: 'Nueva Zelanda', stats: [62, 65, 58, 72, 60, 55], color: '#ffffff', form: 'EDVDE', goals: 8, conceded: 12, possession: '38%', wins: 2 },
                    { name: 'Francia', stats: [95, 88, 86, 90, 88, 92], color: '#002395', form: 'VVVEV', goals: 22, conceded: 5, possession: '60%', wins: 6 },
                    { name: 'Senegal', stats: [60, 62, 58, 70, 62, 50], color: '#fcdc04', form: 'VEEVD', goals: 7, conceded: 11, possession: '40%', wins: 2 },
                    { name: 'México', stats: [82, 80, 78, 82, 80, 75], color: '#006847', form: 'VEVVE', goals: 14, conceded: 10, possession: '53%', wins: 4 },
                    { name: 'Suecia', stats: [80, 82, 76, 85, 78, 78], color: '#006aa7', form: 'EVEVD', goals: 12, conceded: 11, possession: '50%', wins: 3 },
                    { name: 'Inglaterra', stats: [92, 85, 84, 88, 86, 88], color: '#ffffff', form: 'VVEEV', goals: 18, conceded: 8, possession: '58%', wins: 5 },
                    { name: 'Ecuador', stats: [80, 84, 75, 88, 80, 76], color: '#ffdd00', form: 'VEVVE', goals: 11, conceded: 9, possession: '48%', wins: 3 },
                    { name: 'Brasil', stats: [90, 82, 85, 84, 88, 92], color: '#fedf00', form: 'VVVEV', goals: 20, conceded: 9, possession: '60%', wins: 5 },
                    { name: 'Uruguay', stats: [85, 88, 80, 90, 85, 82], color: '#00a6da', form: 'VVEVV', goals: 16, conceded: 8, possession: '52%', wins: 5 },
                    { name: 'Países Bajos', stats: [88, 86, 84, 82, 86, 84], color: '#ff9b00', form: 'VVEVV', goals: 15, conceded: 10, possession: '56%', wins: 4 },
                    { name: 'Colombia', stats: [86, 82, 85, 86, 82, 85], color: '#fcd116', form: 'VVVVV', goals: 19, conceded: 7, possession: '55%', wins: 6 },
                    { name: 'Portugal', stats: [90, 84, 86, 82, 88, 86], color: '#ff0000', form: 'VVEVE', goals: 18, conceded: 9, possession: '58%', wins: 4 },
                    { name: 'Croacia', stats: [84, 88, 90, 80, 85, 80], color: '#ffffff', form: 'EEVEV', goals: 12, conceded: 10, possession: '54%', wins: 3 },
                    { name: 'EE.UU.', stats: [82, 80, 82, 85, 78, 80], color: '#002868', form: 'EVEVV', goals: 13, conceded: 11, possession: '52%', wins: 3 },
                    { name: 'Marruecos', stats: [85, 86, 84, 88, 82, 85], color: '#c1272d', form: 'VVVEV', goals: 16, conceded: 8, possession: '54%', wins: 5 },
                  ],
                  AR: [
                    { name: 'Boca Juniors', stats: [88, 82, 75, 78, 85, 80], color: '#3b82f6', form: 'VVEEV', goals: 28, conceded: 12, possession: '54%', wins: 12 },
                    { name: 'River Plate', stats: [90, 85, 82, 76, 88, 85], color: '#ef4444', form: 'VVEVV', goals: 32, conceded: 10, possession: '58%', wins: 14 }
                  ],
                  BR: [{ name: 'Flamengo', stats: [90, 85, 80, 82, 88, 75], color: '#ef4444', form: 'VVEVV', goals: 34, conceded: 15, possession: '58%', wins: 15 }],
                  EU: [{ name: 'Real Madrid', stats: [95, 90, 88, 85, 92, 80], color: '#f59e0b', form: 'VVVVV', goals: 42, conceded: 10, possession: '60%', wins: 18 }],
                  ES: [{ name: 'Real Madrid', stats: [95, 90, 88, 85, 92, 80], color: '#f59e0b', form: 'VVVVV', goals: 42, conceded: 10, possession: '60%', wins: 18 }],
                  EN: [{ name: 'Manchester City', stats: [96, 88, 95, 84, 94, 82], color: '#00c6ff', form: 'VVEVV', goals: 45, conceded: 14, possession: '64%', wins: 17 }],
                  DE: [{ name: 'Bayern Munich', stats: [92, 84, 85, 88, 90, 78], color: '#ef4444', form: 'VVVEV', goals: 39, conceded: 16, possession: '59%', wins: 14 }],
                  IT: [{ name: 'Inter Milan', stats: [90, 92, 82, 86, 88, 74], color: '#3b82f6', form: 'VEVVV', goals: 31, conceded: 11, possession: '55%', wins: 13 }],
                  US: [{ name: 'Inter Miami', stats: [84, 72, 80, 76, 82, 70], color: '#ff44aa', form: 'VEVVE', goals: 29, conceded: 22, possession: '53%', wins: 11 }],
                  MX: [{ name: 'Club América', stats: [85, 80, 78, 82, 80, 72], color: '#ffd700', form: 'VPVVV', goals: 32, conceded: 18, possession: '56%', wins: 14 }],
                };
                
                const availableTeams = allTeams[league] || allTeams.WC;
                const currentSelection = selectedTeams.length > 0 ? selectedTeams : [availableTeams[0].name];
                const activeData = availableTeams.filter(t => currentSelection.includes(t.name));
                const mainTeam = activeData[0] || availableTeams[0];

                const formColors = { V: 'var(--accent-color)', E: '#888', P: '#ff4444' };
                const formLabels = { V: 'V', E: 'E', P: 'P' };
                return (
                  <motion.div key={league} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <h3 style={{ color: mainTeam.color, fontFamily: 'Orbitron', fontSize: '1.1rem', marginBottom: '4px' }}>
                        {activeData.map(t => t.name).join(' vs ')}
                      </h3>
                      <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', letterSpacing: '1px' }}>MÉTRICAS DE RENDIMIENTO</p>
                    </div>

                    {/* Team Selector */}
                    {availableTeams.length > 1 && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px' }}>
                        {availableTeams.map(t => {
                          const isActive = currentSelection.includes(t.name);
                          return (
                            <div
                              key={t.name}
                              onClick={() => {
                                if (isActive) {
                                  if (currentSelection.length > 1) setSelectedTeams(currentSelection.filter(name => name !== t.name));
                                } else {
                                  if (currentSelection.length < 3) setSelectedTeams([...currentSelection, t.name]);
                                }
                              }}
                              style={{
                                padding: '4px 12px', borderRadius: '20px', cursor: 'pointer',
                                fontSize: '0.75rem', fontFamily: 'Orbitron',
                                border: `1px solid ${isActive ? t.color : 'rgba(255,255,255,0.1)'}`,
                                background: isActive ? `${t.color}33` : 'rgba(0,0,0,0.2)',
                                color: isActive ? '#fff' : 'var(--text-dim)',
                                transition: 'all 0.2s'
                              }}
                            >
                              {t.name}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <RadarChart datasets={activeData} labels={['Ataque', 'Defensa', 'Posesión', 'Físico', 'Táctica', 'Cantera']} />
                    {/* Stat cards (shows comparison if multiple teams selected) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
                      {[
                        { key: 'goals', label: 'Goles a favor' },
                        { key: 'conceded', label: 'Goles en contra' },
                        { key: 'possession', label: 'Posesión media' },
                        { key: 'wins', label: 'Victorias' },
                      ].map((s, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px', textAlign: 'center', border: `1px solid rgba(255,255,255,0.1)` }}>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                            {activeData.map(t => (
                              <div key={t.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 0', minWidth: '40px' }}>
                                <span style={{ fontSize: activeData.length >= 3 ? '0.95rem' : '1.2rem', fontWeight: 900, fontFamily: 'Orbitron', color: t.color }}>{t[s.key]}</span>
                                <span style={{ fontSize: '0.55rem', color: 'var(--text-dim)', maxWidth: '45px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Form strip */}
                    <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {activeData.map(t => (
                        <div key={t.name}>
                          <div style={{ fontSize: '0.68rem', color: t.color, letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.color, boxShadow: `0 0 5px ${t.color}` }}></span>
                            ÚLTIMOS 5 PARTIDOS ({t.name.toUpperCase()})
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {t.form.split('').map((result, i) => (
                              <div key={i} style={{
                                width: '24px', height: '24px', borderRadius: '4px',
                                background: formColors[result], color: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.7rem', fontWeight: 700
                              }}>
                                {formLabels[result]}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
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
                    <h3 style={{ color: 'var(--accent-color)', fontFamily: 'Orbitron', fontSize: '1rem', marginBottom: '2px' }}>{players[selectedPlayer]?.name}</h3>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', letterSpacing: '1px' }}>{players[selectedPlayer]?.team}</p>
                  </div>
                  <RadarChart stats={Object.values(players[selectedPlayer]?.stats || {})} name={players[selectedPlayer]?.name || ''} color="#00ff88" />

                  {/* Individual stat bars */}
                  <div style={{ marginTop: '20px' }}>
                    {Object.entries(players[selectedPlayer]?.stats || {}).map(([key, val], i) => (
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
                    💡 {players[selectedPlayer]?.bio}
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
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
              >
                {['Boca Juniors', 'River Plate', 'Racing Club', 'Independiente'].map(team => (
                  <motion.div 
                    key={team} 
                    variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}
                    whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.08)' }}
                    className="streak-item"
                    style={{ padding: '10px 15px', borderRadius: '8px', transition: 'background 0.3s' }}
                  >
                    <span style={{ fontWeight: 600 }}>{team}</span>
                    <div className="dots">
                      <span className="dot win">W</span>
                      <span className="dot win">W</span>
                      <span className="dot draw">D</span>
                      <span className="dot win">W</span>
                      <span className="dot loss">L</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </section>
            {/* Effectiveness Gauge */}
            <EffectivenessGauge league={league} />
          </>
        ) : activeTab === 'corazonadas' ? (
          <Corazonadas league={league} matches={matches} players={players} getTeamLogoPath={getTeamLogoPath} />
        ) : activeTab === 'fixture' ? (
          <Fixture league={league} matches={matches} getTeamLogoPath={getTeamLogoPath} />
        ) : (() => {
          // PLAYER ANALYSIS DASHBOARD VIEW
          const currentPlayer = players[selectedPlayer] || players[0] || { name: 'LIONEL MESSI', team: 'Argentina', stats: { shooting: 94, passing: 96, dribbling: 95, physical: 70, defense: 35, speed: 82 }, bio: 'Cargando...' };
          
          // Helper to dynamically match players for the duel
          const getMatchPlayers = (match, playersArray) => {
            const norm = (s) => s ? s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() : '';
            let homeP = playersArray.find(p => norm(p.team) === norm(match.home));
            let awayP = playersArray.find(p => norm(p.team) === norm(match.away));
            
            if (!homeP) {
                homeP = { name: `Figura (${match.home})`, team: match.home, stats: { shooting: 80, passing: 80, dribbling: 80, physical: 80, defense: 80, speed: 80 }, bio: '' };
            }
            if (!awayP) {
                awayP = { name: `Figura (${match.away})`, team: match.away, stats: { shooting: 75, passing: 75, dribbling: 75, physical: 75, defense: 75, speed: 75 }, bio: '' };
            }
            return { homeP, awayP };
          };

          return (
            <>
              {/* Left Column: Key Players & Star Duels per Match */}
              <section className="glass-panel" style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <Users color="var(--accent-color)" />
                  <h2 className="heading-font" style={{ fontSize: '1.1rem', letterSpacing: '0.5px' }}>Duelos de Estrellas</h2>
                </div>

                {loading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <div className="pes-spinner"></div>
                  </div>
                ) : (
                  (() => {
                    let displayMatches = matches;
                    if (league === 'WC') {
                      const knockoutMatches = WC_KNOCKOUT.flatMap(round => 
                        round.matches
                          .filter(m => m.home !== 'TBD' && m.away !== 'TBD')
                          .map(m => ({ ...m, group_name: round.name, id: m.id || m.home+'-'+m.away }))
                      );
                      displayMatches = [...matches, ...knockoutMatches];
                    }
                    
                    return displayMatches.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-dim)' }}>
                        No hay partidos cargados para esta liga.
                      </div>
                    ) : displayMatches.map((match, idx) => {
                      const { homeP, awayP } = getMatchPlayers(match, players);
                      const isHomeSelected = currentPlayer?.name === homeP?.name;
                      const isAwaySelected = currentPlayer?.name === awayP?.name;

                      return (
                        <motion.div 
                          key={match.id || idx}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="match-card"
                      style={{ 
                        marginBottom: '20px', 
                        padding: '20px', 
                        borderLeft: `4px solid ${isHomeSelected || isAwaySelected ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)'}`, 
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.03)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        transition: 'all 0.2s'
                      }}
                      whileHover={{ translateY: '-2px', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
                    >
                      {/* Matchday / Group Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'Outfit' }}>
                          ⚽ {match.group_name || 'Jornada actual'}
                        </span>
                        <span style={{ 
                          fontSize: '0.62rem', 
                          fontWeight: 'bold', 
                          color: 'var(--accent-color)', 
                          background: 'rgba(0, 255, 136, 0.12)', 
                          border: '1px solid rgba(0, 255, 136, 0.25)',
                          padding: '3px 10px', 
                          borderRadius: '20px', 
                          fontFamily: 'Orbitron',
                          letterSpacing: '1px',
                          boxShadow: '0 0 10px rgba(0, 255, 136, 0.1)'
                        }}>
                          DUELO DE ESTRELLAS
                        </span>
                      </div>

                      {/* Duel details */}
                      <div className="star-duel-grid" style={{ alignItems: 'center' }}>
                        {/* Home Player Card */}
                        <div 
                          onClick={() => {
                            const idx = players.findIndex(p => p.name === homeP.name);
                            if (idx !== -1) setSelectedPlayer(idx);
                          }}
                          style={{ 
                            minWidth: 0,
                            background: isHomeSelected ? 'rgba(0,255,136,0.04)' : 'rgba(255,255,255,0.02)', 
                            border: `1px solid ${isHomeSelected ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)'}`,
                            borderRadius: '10px', 
                            padding: '12px', 
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: isHomeSelected ? '0 0 15px rgba(0,255,136,0.1)' : 'none'
                          }}
                        >
                          {getTeamLogoPath(homeP.team) ? (
                            <img 
                              src={getTeamLogoPath(homeP.team)} 
                              alt={homeP.team} 
                              style={{ width: '24px', height: '24px', objectFit: 'contain', margin: '0 auto 6px', display: 'block', flexShrink: 0 }} 
                            />
                          ) : (
                            <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>👤</div>
                          )}
                          <div style={{ fontSize: 'var(--star-duel-name-size)', fontWeight: 'bold', fontFamily: 'Orbitron', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{homeP.name}</div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--accent-color)', marginTop: '2px', fontWeight: 600 }}>{homeP.team}</div>
                          <div style={{ marginTop: '8px', fontSize: '0.72rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', padding: '3px 6px', color: 'var(--text-dim)' }}>
                            Rating: <span style={{ color: '#fff', fontWeight: 700 }}>{Math.max(...Object.values(homeP.stats))}%</span>
                          </div>
                        </div>

                        <div className="star-duel-vs-divider">VS</div>

                        {/* Away Player Card */}
                        <div 
                          onClick={() => {
                            const idx = players.findIndex(p => p.name === awayP.name);
                            if (idx !== -1) setSelectedPlayer(idx);
                          }}
                          style={{ 
                            minWidth: 0,
                            background: isAwaySelected ? 'rgba(0,255,136,0.04)' : 'rgba(255,255,255,0.02)', 
                            border: `1px solid ${isAwaySelected ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)'}`,
                            borderRadius: '10px', 
                            padding: '12px', 
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: isAwaySelected ? '0 0 15px rgba(0,255,136,0.1)' : 'none'
                          }}
                        >
                          {getTeamLogoPath(awayP.team) ? (
                            <img 
                              src={getTeamLogoPath(awayP.team)} 
                              alt={awayP.team} 
                              style={{ width: '24px', height: '24px', objectFit: 'contain', margin: '0 auto 6px', display: 'block', flexShrink: 0 }} 
                            />
                          ) : (
                            <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>👤</div>
                          )}
                          <div style={{ fontSize: 'var(--star-duel-name-size)', fontWeight: 'bold', fontFamily: 'Orbitron', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{awayP.name}</div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--accent-color)', marginTop: '2px', fontWeight: 600 }}>{awayP.team}</div>
                          <div style={{ marginTop: '8px', fontSize: '0.72rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', padding: '3px 6px', color: 'var(--text-dim)' }}>
                            Rating: <span style={{ color: '#fff', fontWeight: 700 }}>{Math.max(...Object.values(awayP.stats))}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Analysis quick recommendation */}
                      <div style={{ background: 'rgba(0,255,136,0.03)', border: '1px solid rgba(0,255,136,0.08)', borderRadius: '8px', padding: '8px 12px', fontSize: '0.72rem', color: 'var(--text-dim)', lineHeight: 1.4, marginBottom: '12px' }}>
                        💡 <span style={{ color: '#fff', fontWeight: 600 }}>AI Proyección:</span> {homeP.name} tiene un {Math.max(...Object.values(homeP.stats))}% de probabilidad de dominar el área frente a la defensa de {awayP.team}.
                      </div>

                      {/* Action Button */}
                      <button 
                        className="pes-button" 
                        style={{ width: '100%', padding: '8px', fontSize: '0.7rem', letterSpacing: '0.5px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const idx = players.findIndex(p => p.name === homeP.name);
                          if (idx !== -1) {
                            setSelectedPlayer(idx);
                            const radarElement = document.querySelector('.radar-container');
                            if (radarElement) {
                              radarElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                          }
                        }}
                      >
                        📊 VER ANÁLISIS EN RADAR
                      </button>
                    </motion.div>
                  );
                });
                })()
                )}
              </section>

              {/* Right Column: Interactive Radar & Tactical AI Insights */}
              <section className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'sticky', top: '20px', height: 'max-content' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
                    <BrainCircuit color="var(--accent-color)" />
                    <h2 className="heading-font" style={{ fontSize: '1.1rem' }}>ANALIZADOR DE IA TÁCTICO</h2>
                  </div>

                  {/* Player header */}
                  <div style={{ textAlign: 'center', marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src="/icons/jugador.png" alt="Jugador" style={{ width: '48px', height: '48px', marginBottom: '8px', filter: 'drop-shadow(0 0 10px var(--accent-color))' }} />
                    <h3 style={{ color: 'var(--accent-color)', fontFamily: 'Orbitron', fontSize: '1.2rem', marginBottom: '4px' }}>{currentPlayer.name}</h3>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.78rem', letterSpacing: '1px' }}>{currentPlayer.team}</p>
                  </div>

                  {/* Radar Chart */}
                  <div className="radar-container" style={{ margin: '20px auto' }}>
                    <RadarChart stats={Object.values(currentPlayer.stats)} name={currentPlayer.name} color="var(--accent-color)" />
                  </div>

                  {/* Individual stat bars */}
                  <div style={{ marginTop: '20px' }}>
                    {Object.entries(currentPlayer.stats).map(([key, val], i) => (
                      <div key={key} style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '5px' }}>
                          <span style={{ color: 'var(--text-dim)', textTransform: 'capitalize' }}>
                            {key === 'shooting' ? 'Tiro' : 
                             key === 'passing' ? 'Pase' : 
                             key === 'dribbling' ? 'Regate' : 
                             key === 'physical' ? 'Físico' : 
                             key === 'defense' ? 'Defensa' : 
                             key === 'speed' ? 'Velocidad' : key}
                          </span>
                          <span style={{ color: 'var(--accent-color)', fontWeight: 700 }}>{val}</span>
                        </div>
                        <div style={{ height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '3px', overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${val}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.08 }}
                            style={{ height: '100%', background: `linear-gradient(90deg, rgba(0,255,136,0.4), var(--accent-color))`, borderRadius: '3px' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Prediction Insights (VIP golden panel) */}
                <div style={{ 
                  marginTop: '25px', 
                  padding: '18px', 
                  background: 'linear-gradient(135deg, rgba(255,215,0,0.05), rgba(255,255,255,0.01))', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(255,215,0,0.25)', 
                  boxShadow: '0 4px 20px rgba(255,215,0,0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <img src="/icons/copa-mundial.png" alt="VIP" style={{ width: '20px', height: '20px', filter: 'drop-shadow(0 0 5px rgba(255,215,0,0.5))' }} />
                    <span style={{ fontSize: '0.72rem', color: 'var(--accent-secondary)', fontFamily: 'Orbitron', fontWeight: 'bold', letterSpacing: '1px' }}>AI PREDICTION INSIGHT (VIP)</span>
                  </div>
                  <p style={{ color: '#fff', fontSize: '0.82rem', lineHeight: 1.6, margin: 0, opacity: 0.9 }}>
                    {currentPlayer.bio}
                  </p>
                  <div style={{ 
                    marginTop: '14px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    background: 'rgba(0,255,136,0.04)', 
                    padding: '8px 12px', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(0,255,136,0.1)'
                  }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Tip Recomendado:</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: 'bold', fontFamily: 'Orbitron', letterSpacing: '0.5px' }}>MÁS DE 1.5 TIROS</span>
                  </div>
                </div>
              </section>

              {/* Bottom Row: Matchday Leaders Leaderboard */}
              <section className="glass-panel" style={{ gridColumn: '1 / -1', marginTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <Trophy color="var(--accent-secondary)" />
                  <h2 className="heading-font" style={{ fontSize: '1.1rem', letterSpacing: '0.5px' }}>Líderes de Rendimiento de la Fecha</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  {players.slice(0, 4).map((p, idx) => {
                    const maxStat = Math.max(...Object.values(p.stats));
                    const isSelected = currentPlayer.name === p.name;
                    return (
                      <motion.div 
                        key={p.name}
                        whileHover={{ scale: 1.03 }}
                        onClick={() => {
                          const originalIdx = players.findIndex(pl => pl.name === p.name);
                          if (originalIdx !== -1) setSelectedPlayer(originalIdx);
                        }}
                        style={{ 
                          background: isSelected ? 'rgba(0,255,136,0.03)' : 'rgba(255,255,255,0.02)', 
                          border: `1px solid ${isSelected ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)'}`, 
                          borderRadius: '12px', 
                          padding: '20px 16px', 
                          textAlign: 'center',
                          position: 'relative',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          boxShadow: isSelected ? '0 4px 15px rgba(0,255,136,0.05)' : 'none',
                          transition: 'all 0.2s'
                        }}
                      >
                        {/* Top position badge */}
                        <div style={{ 
                          position: 'absolute', top: '10px', left: '10px', 
                          width: '24px', height: '24px', borderRadius: '50%',
                          background: idx === 0 ? 'var(--accent-secondary)' : (idx === 1 ? '#c0c0c0' : (idx === 2 ? '#cd7f32' : 'rgba(255,255,255,0.1)')),
                          color: '#000', fontWeight: 'bold', fontSize: '0.8rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          #{idx + 1}
                        </div>
                        
                        {getTeamLogoPath(p.team) ? (
                          <img 
                            src={getTeamLogoPath(p.team)} 
                            alt={p.team} 
                            style={{ width: '36px', height: '36px', objectFit: 'contain', margin: '10px auto 8px', display: 'block', flexShrink: 0 }} 
                          />
                        ) : (
                          <img 
                            src="/icons/goleador.png" 
                            alt="Goleador" 
                            style={{ width: '36px', height: '36px', objectFit: 'contain', margin: '10px auto 8px', display: 'block', flexShrink: 0, filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.2))' }} 
                          />
                        )}
                        <h3 style={{ fontSize: '0.85rem', color: '#fff', fontFamily: 'Orbitron', marginBottom: '3px' }}>{p.name}</h3>
                        <p style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{p.team}</p>
                        
                        <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(0,255,136,0.08)', borderRadius: '20px', padding: '4px 12px', fontSize: '0.72rem', color: 'var(--accent-color)', fontWeight: 'bold', fontFamily: 'Orbitron' }}>
                          <span>Rating: {maxStat}%</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            </>
          );
        })()}
      </motion.main>

      <FloatingBot t={t} />
      <AnalysisModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        match={selectedMatch}
        t={t}
        getTeamLogoPath={getTeamLogoPath}
        isVip={isVip}
        onOpenVipModal={() => setIsVipModalOpen(true)}
      />
      <SubscriptionModal 
        isOpen={isVipModalOpen} 
        onClose={() => setIsVipModalOpen(false)} 
        t={t}
        onVipActivated={(email) => {
          triggerCelebration();
          setIsVip(true);
          setVipEmail(email);
        }}
      />
    </motion.div>
  );
};

export default App;
