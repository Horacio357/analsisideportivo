import { create } from 'zustand';
import axios from 'axios';

export const useAppStore = create((set, get) => ({
  // Navigation & UI state
  view: 'landing',
  lang: 'es',
  theme: 'classic',
  activeTab: 'predictions',
  analysisMode: 'team', // 'team' | 'player'
  
  // Modals state
  isModalOpen: false,
  isVipModalOpen: false,
  
  // User state
  isVip: false,
  vipEmail: '',
  
  // Data state
  league: 'WC',
  matches: [],
  loading: false,
  selectedPlayer: 0,
  selectedMatch: null,
  activeTeam: null,

  // Actions - UI Setters
  setView: (view) => set({ view }),
  setLang: (lang) => set({ lang }),
  setTheme: (theme) => {
    set({ theme });
    document.body.setAttribute('data-theme', theme);
  },
  setActiveTab: (tab) => set({ activeTab: tab }),
  setAnalysisMode: (mode) => set({ analysisMode: mode }),
  
  setLeague: (league) => {
    set({ league, selectedPlayer: 0 });
    get().fetchData(league);
  },

  setSelectedPlayer: (index) => set({ selectedPlayer: index }),
  
  openMatchModal: (match) => set({ selectedMatch: match, isModalOpen: true }),
  closeMatchModal: () => set({ isModalOpen: false }),
  
  openVipModal: () => set({ isVipModalOpen: true }),
  closeVipModal: () => set({ isVipModalOpen: false }),
  
  setVipStatus: (isVip, email) => set({ isVip, vipEmail: email }),

  // Actions - Data Fetching
  fetchData: async (leagueToFetch) => {
    const currentLeague = leagueToFetch || get().league;
    set({ loading: true });

    // Client-side converter helper to ensure consistent betting board format (v2) for offline fallback matches
    const fillFallbackBettingDetails = (m, leagueId) => {
      if (m.confidence) return m; // Already seeded detailed data (like WC)
      const hp = m.homeProb, dp = m.drawProb, ap = m.awayProb;
      const fav_team = hp >= ap ? m.home : m.away;
      const underdog_team = hp >= ap ? m.away : m.home;
      const fav_prob = Math.max(hp, ap);
      const underdog_prob = Math.min(hp, ap);
      
      const confidence = Math.abs(hp - ap) >= 30 ? 'ALTA' : (Math.abs(hp - ap) >= 15 ? 'MEDIA' : 'VALUE BET');
      
      const margin = 0.92;
      const home_odds = (100.0 / Math.max(1, hp) * margin).toFixed(2);
      const draw_odds = (100.0 / Math.max(1, dp) * margin).toFixed(2);
      const away_odds = (100.0 / Math.max(1, ap) * margin).toFixed(2);
      const fav_odds = hp >= ap ? home_odds : away_odds;
      
      const dnb_prob = fav_prob / (fav_prob + underdog_prob) || 0.5;
      const dnb_odds = (1.0 / Math.max(0.01, dnb_prob) * margin).toFixed(2);
      
      const seguro_handicap_market = confidence === 'ALTA' 
        ? `Hándicap Asiático -1.5 (${fav_team})` 
        : `Hándicap Asiático -0.5 (${fav_team})`;
      const seguro_handicap_odds = confidence === 'ALTA' 
        ? (parseFloat(fav_odds) + 0.40).toFixed(2) 
        : fav_odds;
        
      return {
        ...m,
        group_name: leagueId === 'WC' ? 'Fase de Grupos' : 'Liga Regular',
        confidence,
        seguro_dnb_team: fav_team,
        seguro_dnb_odds: dnb_odds,
        seguro_handicap_market,
        seguro_handicap_odds,
        valor_1x2_team: `1X2 — ${fav_team} gana`,
        valor_1x2_odds: fav_odds,
        valor_overunder_market: (hp + ap) > 65 ? 'Over/Under: Más de 2.5 goles' : 'Over/Under: Menos de 2.5 goles',
        valor_overunder_odds: (hp + ap) > 65 ? (1.75 + dp/100).toFixed(2) : (1.65 + fav_prob/200).toFixed(2),
        arriesgado_1x2pt_market: confidence === 'ALTA' ? `1X2 Primer Tiempo (${fav_team} gana)` : '1X2 Primer Tiempo (Empate)',
        arriesgado_1x2pt_odds: confidence === 'ALTA' ? (parseFloat(fav_odds) + 0.50).toFixed(2) : (parseFloat(draw_odds) - 0.30).toFixed(2),
        arriesgado_btts_market: confidence === 'ALTA' ? 'BTTS (Ambos Anotan): No' : 'BTTS (Ambos Anotan): Sí',
        arriesgado_btts_odds: confidence === 'ALTA' ? (1.60 + dp/100).toFixed(2) : (1.80 + fav_prob/200).toFixed(2),
        when_to_bet: confidence === 'ALTA' ? 'Pre-partido (24-48h antes)' : 'En Vivo (In-Play)',
        pending_adjustments: 'Confirmar alineaciones iniciales y estados físicos de último minuto.',
        metric_form_xg: Math.min(95, Math.max(40, Math.round(60 + (hp - ap) * 0.4))),
        metric_squad: Math.min(95, Math.max(45, Math.round(75 + (hp - ap) * 0.3))),
        metric_context: Math.min(95, Math.max(50, Math.round(70 + (hp - ap) * 0.2))),
        metric_h2h: Math.min(95, Math.max(50, Math.round(65 + (hp - ap) * 0.1)))
      };
    };

    // Fallback static matches data in case backend is offline
    const allMatchesFallback = {
      WC: [
        {
          id: 200, home: 'Argentina', homeLogo: '/escudos/WC/argentina.png', away: 'Jordania', awayLogo: '/escudos/WC/arabiasaudita.png', homeProb: 88, drawProb: 9, awayProb: 3, prediction: 'Local',
          group_name: 'Grupo A', confidence: 'ALTA',
          seguro_dnb_team: 'Argentina', seguro_dnb_odds: '1.05',
          seguro_handicap_market: 'Hándicap Asiático -1.5 (Argentina)', seguro_handicap_odds: '1.40',
          valor_1x2_team: '1X2 — Argentina gana', valor_1x2_odds: '1.15',
          valor_overunder_market: 'Over/Under: Más de 2.5 goles', valor_overunder_odds: '1.50',
          arriesgado_1x2pt_market: '1X2 Primer Tiempo (Argentina gana)', arriesgado_1x2pt_odds: '1.55',
          arriesgado_btts_market: 'BTTS (Ambos Anotan): No', arriesgado_btts_odds: '1.65',
          when_to_bet: 'Pre-partido (24-48h antes)',
          pending_adjustments: 'Convocatoria final de delanteros a confirmar; se evalúa descanso de titulares en el segundo tiempo.',
          metric_form_xg: 92, metric_squad: 95, metric_context: 85, metric_h2h: 50
        },
        {
          id: 201, home: 'España', homeLogo: '/escudos/WC/espana.png', away: 'Nueva Zelanda', awayLogo: '/escudos/WC/nuevazelanda.png', homeProb: 90, drawProb: 8, awayProb: 2, prediction: 'Local',
          group_name: 'Grupo B', confidence: 'ALTA',
          seguro_dnb_team: 'España', seguro_dnb_odds: '1.04',
          seguro_handicap_market: 'Hándicap Asiático -2.0 (España)', seguro_handicap_odds: '1.60',
          valor_1x2_team: '1X2 — España gana', valor_1x2_odds: '1.12',
          valor_overunder_market: 'Over/Under: Más de 2.5 goles', valor_overunder_odds: '1.45',
          arriesgado_1x2pt_market: '1X2 Primer Tiempo (España gana)', arriesgado_1x2pt_odds: '1.48',
          arriesgado_btts_market: 'BTTS (Ambos Anotan): No', arriesgado_btts_odds: '1.55',
          when_to_bet: 'Pre-partido (24-48h antes)',
          pending_adjustments: 'Molestias físicas del extremo titular; se espera rotación en el mediocampo.',
          metric_form_xg: 90, metric_squad: 94, metric_context: 88, metric_h2h: 50
        },
        {
          id: 202, home: 'Francia', homeLogo: '/escudos/WC/francia.png', away: 'Uganda', awayLogo: '/escudos/WC/senegal.png', homeProb: 85, drawProb: 12, awayProb: 3, prediction: 'Local',
          group_name: 'Grupo C', confidence: 'ALTA',
          seguro_dnb_team: 'Francia', seguro_dnb_odds: '1.06',
          seguro_handicap_market: 'Hándicap Asiático -1.5 (Francia)', seguro_handicap_odds: '1.38',
          valor_1x2_team: '1X2 — Francia gana', valor_1x2_odds: '1.18',
          valor_overunder_market: 'Over/Under: Más de 2.5 goles', valor_overunder_odds: '1.52',
          arriesgado_1x2pt_market: '1X2 Primer Tiempo (Francia gana)', arriesgado_1x2pt_odds: '1.60',
          arriesgado_btts_market: 'BTTS (Ambos Anotan): No', arriesgado_btts_odds: '1.70',
          when_to_bet: 'Pre-partido (24-48h antes)',
          pending_adjustments: 'Confirmar estado físico del lateral izquierdo tras la última jornada de liga.',
          metric_form_xg: 88, metric_squad: 95, metric_context: 80, metric_h2h: 50
        },
        {
          id: 203, home: 'México', homeLogo: '/escudos/WC/mexico.png', away: 'Suecia', awayLogo: '/escudos/WC/suecia.png', homeProb: 48, drawProb: 30, awayProb: 22, prediction: 'Local',
          group_name: 'Grupo D', confidence: 'MEDIA',
          seguro_dnb_team: 'México', seguro_dnb_odds: '1.65',
          seguro_handicap_market: 'Hándicap Asiático -0.5 (México)', seguro_handicap_odds: '1.85',
          valor_1x2_team: '1X2 — México gana', valor_1x2_odds: '2.10',
          valor_overunder_market: 'Over/Under: Menos de 2.5 goles', valor_overunder_odds: '1.75',
          arriesgado_1x2pt_market: '1X2 Primer Tiempo (Empate)', arriesgado_1x2pt_odds: '2.05',
          arriesgado_btts_market: 'BTTS (Ambos Anotan): Sí', arriesgado_btts_odds: '1.95',
          when_to_bet: 'En Vivo (In-Play)',
          pending_adjustments: 'Suspensión por tarjetas amarillas del mediocentro defensivo; regreso del central titular.',
          metric_form_xg: 72, metric_squad: 78, metric_context: 85, metric_h2h: 60
        },
        {
          id: 204, home: 'Inglaterra', homeLogo: '/escudos/WC/inglaterra.png', away: 'Ecuador', awayLogo: '/escudos/WC/ecuador.png', homeProb: 58, drawProb: 26, awayProb: 16, prediction: 'Local',
          group_name: 'Grupo E', confidence: 'MEDIA',
          seguro_dnb_team: 'Inglaterra', seguro_dnb_odds: '1.35',
          seguro_handicap_market: 'Hándicap Asiático -0.5 (Inglaterra)', seguro_handicap_odds: '1.55',
          valor_1x2_team: '1X2 — Inglaterra gana', valor_1x2_odds: '1.72',
          valor_overunder_market: 'Over/Under: Más de 1.5 goles', valor_overunder_odds: '1.30',
          arriesgado_1x2pt_market: '1X2 Primer Tiempo (Inglaterra gana)', arriesgado_1x2pt_odds: '2.30',
          arriesgado_btts_market: 'BTTS (Ambos Anotan): Sí', arriesgado_btts_odds: '2.10',
          when_to_bet: 'Pre-partido (24-48h antes)',
          pending_adjustments: 'Lesión del portero titular en el entrenamiento; debut del portero suplente en partido oficial.',
          metric_form_xg: 78, metric_squad: 85, metric_context: 75, metric_h2h: 65
        },
        {
          id: 205, home: 'Brasil', homeLogo: '/escudos/WC/brasil.png', away: 'Uruguay', awayLogo: '/escudos/WC/uruguay.png', homeProb: 50, drawProb: 30, awayProb: 20, prediction: 'Local',
          group_name: 'Grupo F', confidence: 'MEDIA',
          seguro_dnb_team: 'Brasil', seguro_dnb_odds: '1.45',
          seguro_handicap_market: 'Hándicap Asiático -0.5 (Brasil)', seguro_handicap_odds: '1.75',
          valor_1x2_team: '1X2 — Brasil gana', valor_1x2_odds: '2.00',
          valor_overunder_market: 'Over/Under: Más de 2.5 goles', valor_overunder_odds: '1.90',
          arriesgado_1x2pt_market: '1X2 Primer Tiempo (Empate)', arriesgado_1x2pt_odds: '2.10',
          arriesgado_btts_market: 'BTTS (Ambos Anotan): Sí', arriesgado_btts_odds: '1.80',
          when_to_bet: 'En Vivo (In-Play)',
          pending_adjustments: 'Convocatoria final de Uruguay presenta dudas en la zaga defensiva.',
          metric_form_xg: 75, metric_squad: 88, metric_context: 70, metric_h2h: 80
        },
        {
          id: 206, home: 'Países Bajos', homeLogo: '/escudos/WC/paisesbajos.png', away: 'Colombia', awayLogo: '/escudos/WC/colombia.png', homeProb: 35, drawProb: 30, awayProb: 35, prediction: 'Empate',
          group_name: 'Grupo G', confidence: 'VALUE BET',
          seguro_dnb_team: 'Colombia', seguro_dnb_odds: '2.10',
          seguro_handicap_market: 'Hándicap Asiático +0.5 (Colombia)', seguro_handicap_odds: '1.80',
          valor_1x2_team: '1X2 — Colombia gana', valor_1x2_odds: '3.10',
          valor_overunder_market: 'Over/Under: Más de 2.5 goles', valor_overunder_odds: '2.15',
          arriesgado_1x2pt_market: '1X2 Primer Tiempo (Colombia gana)', arriesgado_1x2pt_odds: '3.75',
          arriesgado_btts_market: 'BTTS (Ambos Anotan): Sí', arriesgado_btts_odds: '1.90',
          when_to_bet: 'Pre-partido (24-48h antes)',
          pending_adjustments: 'Regreso del extremo estrella tras lesión muscular; confirmación de la alineación táctica de Países Bajos.',
          metric_form_xg: 85, metric_squad: 82, metric_context: 75, metric_h2h: 70
        },
        {
          id: 207, home: 'Portugal', homeLogo: '/escudos/WC/portugal.png', away: 'Croacia', awayLogo: '/escudos/WC/croacia.png', homeProb: 40, drawProb: 32, awayProb: 28, prediction: 'Local',
          group_name: 'Grupo H', confidence: 'VALUE BET',
          seguro_dnb_team: 'Croacia', seguro_dnb_odds: '2.30',
          seguro_handicap_market: 'Hándicap Asiático +0.5 (Croacia)', seguro_handicap_odds: '1.95',
          valor_1x2_team: '1X2 — Croacia gana', valor_1x2_odds: '3.40',
          valor_overunder_market: 'Over/Under: Menos de 2.5 goles', valor_overunder_odds: '1.85',
          arriesgado_1x2pt_market: '1X2 Primer Tiempo (Empate)', arriesgado_1x2pt_odds: '2.15',
          arriesgado_btts_market: 'BTTS (Ambos Anotan): No', arriesgado_btts_odds: '2.00',
          when_to_bet: 'Pre-partido (24-48h antes)',
          pending_adjustments: 'Recuperación de la fatiga del mediocampo veterano de Croacia; cambios en el lateral izquierdo de Portugal.',
          metric_form_xg: 80, metric_squad: 84, metric_context: 80, metric_h2h: 75
        },
        {
          id: 208, home: 'EE.UU.', homeLogo: '/escudos/WC/usa.png', away: 'Marruecos', awayLogo: '/escudos/WC/marruecos.png', homeProb: 36, drawProb: 32, awayProb: 32, prediction: 'Local',
          group_name: 'Grupo I', confidence: 'VALUE BET',
          seguro_dnb_team: 'Marruecos', seguro_dnb_odds: '2.05',
          seguro_handicap_market: 'Hándicap Asiático +0.5 (Marruecos)', seguro_handicap_odds: '1.75',
          valor_1x2_team: '1X2 — Marruecos gana', valor_1x2_odds: '2.90',
          valor_overunder_market: 'Over/Under: Más de 2.5 goles', valor_overunder_odds: '2.20',
          arriesgado_1x2pt_market: '1X2 Primer Tiempo (Marruecos gana)', arriesgado_1x2pt_odds: '3.50',
          arriesgado_btts_market: 'BTTS (Ambos Anotan): Sí', arriesgado_btts_odds: '1.95',
          when_to_bet: 'En Vivo (In-Play)',
          pending_adjustments: 'Convocatoria a confirmar del delantero centro titular de Marruecos por molestias musculares.',
          metric_form_xg: 78, metric_squad: 82, metric_context: 80, metric_h2h: 70
        }
      ],
      AR: [
        { id: 1, home: 'Boca Juniors', homeLogo: '/escudos/AR/boca.png', away: 'River Plate', awayLogo: '/escudos/AR/river.png', homeProb: 45, drawProb: 30, awayProb: 25, prediction: 'Local' },
        { id: 2, home: 'Racing Club', homeLogo: '/escudos/AR/racing.png', away: 'Independiente', awayLogo: '/escudos/AR/independiente.png', homeProb: 50, drawProb: 25, awayProb: 25, prediction: 'Local' },
        { id: 3, home: 'San Lorenzo', homeLogo: '/escudos/AR/sanlorenzo.png', away: 'Huracán', awayLogo: '/escudos/AR/huracan.png', homeProb: 38, drawProb: 32, awayProb: 30, prediction: 'Empate' },
      ],
      BR: [
        { id: 10, home: 'Flamengo', homeLogo: '/escudos/BR/flamengo.png', away: 'Palmeiras', awayLogo: '/escudos/BR/palmeiras.png', homeProb: 45, drawProb: 25, awayProb: 30, prediction: 'Local' },
        { id: 11, home: 'Corinthians', homeLogo: '/escudos/BR/corinthians.png', away: 'São Paulo', awayLogo: '/escudos/BR/saopaulo.png', homeProb: 35, drawProb: 35, awayProb: 30, prediction: 'Empate' },
        { id: 12, home: 'Atletico MG', homeLogo: '/escudos/BR/atlmineiro.png', away: 'Botafogo', awayLogo: '/escudos/BR/botafogo.png', homeProb: 52, drawProb: 22, awayProb: 26, prediction: 'Local' },
      ],
      EU: [
        { id: 20, home: 'Real Madrid (EU)', homeLogo: '/escudos/ES/realmadrid.png', away: 'Man City (EU)', awayLogo: null, homeProb: 38, drawProb: 24, awayProb: 38, prediction: 'Local' },
        { id: 21, home: 'Bayern (EU)', homeLogo: '/escudos/DE/bayernmunchen.png', away: 'Arsenal (EU)', awayLogo: null, homeProb: 42, drawProb: 28, awayProb: 30, prediction: 'Local' },
        { id: 22, home: 'PSG (EU)', homeLogo: null, away: 'Barcelona (EU)', awayLogo: '/escudos/ES/barcelona.png', homeProb: 36, drawProb: 27, awayProb: 37, prediction: 'Empate' },
      ],
      ES: [
        { id: 30, home: 'Real Madrid', homeLogo: '/escudos/ES/realmadrid.png', away: 'Barcelona', awayLogo: '/escudos/ES/barcelona.png', homeProb: 44, drawProb: 24, awayProb: 32, prediction: 'Local' },
        { id: 31, home: 'Atlético Madrid', homeLogo: '/escudos/ES/atlmadrid.png', away: 'Sevilla', awayLogo: '/escudos/ES/sevilla.png', homeProb: 50, drawProb: 25, awayProb: 25, prediction: 'Local' },
        { id: 32, home: 'Athletic Club', homeLogo: '/escudos/ES/athletic.png', away: 'Real Sociedad', awayLogo: '/escudos/ES/realsociedad.png', homeProb: 40, drawProb: 30, awayProb: 30, prediction: 'Empate' },
      ],
      EN: [
        { id: 40, home: 'Man City', homeLogo: '/escudos/EN/manchestercity.png', away: 'Arsenal', awayLogo: '/escudos/EN/arsenal.png', homeProb: 48, drawProb: 22, awayProb: 30, prediction: 'Local' },
        { id: 41, home: 'Liverpool', homeLogo: '/escudos/EN/liverpool.png', away: 'Chelsea', awayLogo: '/escudos/EN/chelsea.png', homeProb: 45, drawProb: 25, awayProb: 30, prediction: 'Local' },
        { id: 42, home: 'Aston Villa', homeLogo: '/escudos/EN/astonvilla.png', away: 'Tottenham', awayLogo: '/escudos/EN/tottenham.png', homeProb: 38, drawProb: 28, awayProb: 34, prediction: 'Empate' },
      ],
      DE: [
        { id: 50, home: 'Bayern Munich', homeLogo: '/escudos/DE/bayernmunchen.png', away: 'Borussia Dortmund', awayLogo: '/escudos/DE/borussiadortmund.png', homeProb: 55, drawProb: 20, awayProb: 25, prediction: 'Local' },
        { id: 51, home: 'Bayer Leverkusen', homeLogo: '/escudos/DE/bayerleverkusen.png', away: 'RB Leipzig', awayLogo: '/escudos/DE/rbleipzig.png', homeProb: 45, drawProb: 28, awayProb: 27, prediction: 'Local' },
      ],
      IT: [
        { id: 60, home: 'Inter Milan', homeLogo: '/escudos/IT/inter.png', away: 'AC Milan', awayLogo: '/escudos/IT/milan.png', homeProb: 46, drawProb: 26, awayProb: 28, prediction: 'Local' },
        { id: 61, home: 'Juventus', homeLogo: '/escudos/IT/juventus.png', away: 'Napoli', awayLogo: '/escudos/IT/napoli.png', homeProb: 38, drawProb: 30, awayProb: 32, prediction: 'Empate' },
      ],
      FR: [
        { id: 90, home: 'PSG', homeLogo: '/escudos/FR/psg.png', away: 'Olympique Lyon', awayLogo: '/escudos/FR/olympiquelyon.png', homeProb: 55, drawProb: 25, awayProb: 20, prediction: 'Local' },
        { id: 91, home: 'Monaco', homeLogo: '/escudos/FR/monaco.png', away: 'Olimpique Marsella', awayLogo: '/escudos/FR/olimpiquemarsella.png', homeProb: 40, drawProb: 30, awayProb: 30, prediction: 'Empate' },
      ],
      PT: [
        { id: 100, home: 'Benfica', homeLogo: '/escudos/PT/benfica.png', away: 'Porto', awayLogo: '/escudos/PT/porto.png', homeProb: 45, drawProb: 30, awayProb: 25, prediction: 'Local' },
        { id: 101, home: 'Sporting', homeLogo: '/escudos/PT/sporting.png', away: 'Braga', awayLogo: '/escudos/PT/braga.png', homeProb: 50, drawProb: 25, awayProb: 25, prediction: 'Local' },
      ],
      US: [
        { id: 70, home: 'Inter Miami', homeLogo: '/escudos/US/intermiami.png', away: 'LA Galaxy', awayLogo: '/escudos/US/losangelesgalaxy.png', homeProb: 60, drawProb: 20, awayProb: 20, prediction: 'Local' },
        { id: 71, home: 'NY Red Bulls', homeLogo: '/escudos/US/newyork.png', away: 'Orlando City', awayLogo: '/escudos/US/orlandocity.png', homeProb: 40, drawProb: 30, awayProb: 30, prediction: 'Empate' },
      ],
      MX: [
        { id: 80, home: 'Club América', homeLogo: '/escudos/MX/america.png', away: 'Chivas', awayLogo: '/escudos/MX/guadalajara.png', homeProb: 48, drawProb: 26, awayProb: 26, prediction: 'Local' },
        { id: 81, home: 'Cruz Azul', homeLogo: '/escudos/MX/cruzazul.png', away: 'Pumas UNAM', awayLogo: '/escudos/MX/pumas.png', homeProb: 42, drawProb: 28, awayProb: 30, prediction: 'Local' },
      ],
    };

    // Fallback static team data in case backend is offline
    const teamDataFallback = {
      WC: { name: 'Argentina', logo: '/escudos/WC/argentina.png', stats: [92, 88, 90, 85, 90, 88], color: '#75aadb', form: 'VVVVV', goals: 24, conceded: 4, possession: '64%', wins: 7 },
      AR: { name: 'Boca Juniors', logo: '/escudos/AR/boca.png', stats: [85, 78, 92, 80, 75, 88], color: '#ffd700', form: 'VVEVP', goals: 28, conceded: 12, possession: '58%', wins: 14 },
      BR: { name: 'Flamengo',     logo: '/escudos/BR/flamengo.png', stats: [88, 82, 80, 85, 78, 90], color: '#ff4444', form: 'VVVEP', goals: 34, conceded: 15, possession: '61%', wins: 16 },
      EU: { name: 'Real Madrid (EU)', logo: '/escudos/ES/realmadrid.png', stats: [95, 90, 85, 92, 98, 95], color: '#ffd700', form: 'VVVVV', goals: 52, conceded: 18, possession: '63%', wins: 22 },
      ES: { name: 'Real Madrid',  logo: '/escudos/ES/realmadrid.png', stats: [94, 88, 87, 91, 96, 93], color: '#ffd700', form: 'VVEVV', goals: 48, conceded: 20, possession: '62%', wins: 20 },
      EN: { name: 'Man City',     logo: '/escudos/EN/manchestercity.png', stats: [92, 86, 90, 88, 94, 80], color: '#6ec6ff', form: 'VEVVV', goals: 45, conceded: 19, possession: '65%', wins: 19 },
      DE: { name: 'Bayern Munich',logo: '/escudos/DE/bayernmunchen.png', stats: [96, 84, 88, 90, 92, 82], color: '#ff4444', form: 'VVVPV', goals: 58, conceded: 22, possession: '64%', wins: 21 },
      IT: { name: 'Inter Milan',  logo: '/escudos/IT/inter.png', stats: [88, 90, 80, 86, 88, 75], color: '#6ec6ff', form: 'VVEVV', goals: 40, conceded: 16, possession: '57%', wins: 18 },
      FR: { name: 'PSG',          logo: '/escudos/FR/psg.png', stats: [90, 82, 85, 88, 92, 85], color: '#004170', form: 'VVVEV', goals: 42, conceded: 18, possession: '64%', wins: 17 },
      PT: { name: 'Benfica',      logo: '/escudos/PT/benfica.png', stats: [86, 80, 82, 84, 88, 80], color: '#ff0000', form: 'VVEVV', goals: 38, conceded: 14, possession: '58%', wins: 15 },
      US: { name: 'Inter Miami',  logo: '/escudos/US/intermiami.png', stats: [92, 65, 88, 70, 72, 60], color: '#ff69b4', form: 'VVVEV', goals: 36, conceded: 24, possession: '55%', wins: 15 },
      MX: { name: 'Club América', logo: '/escudos/MX/america.png', stats: [85, 80, 78, 82, 80, 72], color: '#ffd700', form: 'VPVVV', goals: 32, conceded: 18, possession: '56%', wins: 14 },
    };

    try {
      // Parallel requests: API calls and a minimum delay of 800ms for loading screen transition
      const [matchesRes, teamRes] = await Promise.all([
        axios.get(`http://localhost:8000/matches`, { params: { league_id: currentLeague } }),
        axios.get(`http://localhost:8000/team/${currentLeague}`),
        new Promise(resolve => setTimeout(resolve, 800))
      ]);

      if (matchesRes.data && matchesRes.data.matches) {
        set({ matches: matchesRes.data.matches });
      }
      if (teamRes.data) {
        set({ activeTeam: { ...teamRes.data, league: currentLeague } });
      }
      set({ loading: false });
    } catch (err) {
      console.warn("Backend API not reachable, using offline fallback data.", err);
      // Fallback
      set({
        matches: (allMatchesFallback[currentLeague] || []).map(m => fillFallbackBettingDetails(m, currentLeague)),
        activeTeam: { ...(teamDataFallback[currentLeague] || teamDataFallback.WC), league: currentLeague },
        loading: false
      });
    }
  }
}));

// Synchronous getter helper (reads activeTeam state, falls back to static mapping)
export const getTeamData = (league) => {
  const activeTeam = useAppStore.getState().activeTeam;
  if (activeTeam && activeTeam.league === league) {
    return activeTeam;
  }

  const teamDataFallback = {
    WC: { name: 'Argentina', logo: '/escudos/WC/argentina.png', stats: [92, 88, 90, 85, 90, 88], color: '#75aadb', form: 'VVVVV', goals: 24, conceded: 4, possession: '64%', wins: 7 },
    AR: { name: 'Boca Juniors', logo: '/escudos/AR/boca.png', stats: [85, 78, 92, 80, 75, 88], color: '#ffd700', form: 'VVEVP', goals: 28, conceded: 12, possession: '58%', wins: 14 },
    BR: { name: 'Flamengo',     logo: '/escudos/BR/flamengo.png', stats: [88, 82, 80, 85, 78, 90], color: '#ff4444', form: 'VVVEP', goals: 34, conceded: 15, possession: '61%', wins: 16 },
    EU: { name: 'Real Madrid (EU)', logo: '/escudos/ES/realmadrid.png', stats: [95, 90, 85, 92, 98, 95], color: '#ffd700', form: 'VVVVV', goals: 52, conceded: 18, possession: '63%', wins: 22 },
    ES: { name: 'Real Madrid',  logo: '/escudos/ES/realmadrid.png', stats: [94, 88, 87, 91, 96, 93], color: '#ffd700', form: 'VVEVV', goals: 48, conceded: 20, possession: '62%', wins: 20 },
    EN: { name: 'Man City',     logo: '/escudos/EN/manchestercity.png', stats: [92, 86, 90, 88, 94, 80], color: '#6ec6ff', form: 'VEVVV', goals: 45, conceded: 19, possession: '65%', wins: 19 },
    DE: { name: 'Bayern Munich',logo: '/escudos/DE/bayernmunchen.png', stats: [96, 84, 88, 90, 92, 82], color: '#ff4444', form: 'VVVPV', goals: 58, conceded: 22, possession: '64%', wins: 21 },
    IT: { name: 'Inter Milan',  logo: '/escudos/IT/inter.png', stats: [88, 90, 80, 86, 88, 75], color: '#6ec6ff', form: 'VVEVV', goals: 40, conceded: 16, possession: '57%', wins: 18 },
    FR: { name: 'PSG',          logo: '/escudos/FR/psg.png', stats: [90, 82, 85, 88, 92, 85], color: '#004170', form: 'VVVEV', goals: 42, conceded: 18, possession: '64%', wins: 17 },
    PT: { name: 'Benfica',      logo: '/escudos/PT/benfica.png', stats: [86, 80, 82, 84, 88, 80], color: '#ff0000', form: 'VVEVV', goals: 38, conceded: 14, possession: '58%', wins: 15 },
    US: { name: 'Inter Miami',  logo: '/escudos/US/intermiami.png', stats: [92, 65, 88, 70, 72, 60], color: '#ff69b4', form: 'VVVEV', goals: 36, conceded: 24, possession: '55%', wins: 15 },
    MX: { name: 'Club América', logo: '/escudos/MX/america.png', stats: [85, 80, 78, 82, 80, 72], color: '#ffd700', form: 'VPVVV', goals: 32, conceded: 18, possession: '56%', wins: 14 },
  };
  return teamDataFallback[league] || teamDataFallback.WC;
};

export const getPlayersData = (leagueId) => {
  const currentLeague = leagueId || useAppStore.getState().league;
  
  if (currentLeague === 'WC') {
    return [
      { name: 'LIONEL MESSI', team: 'Argentina', stats: { shooting: 94, passing: 96, dribbling: 95, physical: 70, defense: 35, speed: 82 }, bio: 'El capitán argentino lidera la creación y la definición. Para este partido de fecha, la probabilidad de gol esperada es del 88% y la cuota de "Más de 1.5 tiros al arco" ofrece un valor excelente.' },
      { name: 'KYLIAN MBAPPÉ', team: 'Francia', stats: { shooting: 92, passing: 80, dribbling: 93, physical: 82, defense: 36, speed: 97 }, bio: 'Aceleración explosiva en transiciones rápidas. Se estima una efectividad del 93% en duelos 1v1 contra la zaga de Uganda. Apuesta recomendada: Gana Francia y gol de Mbappé.' },
      { name: 'LAMINE YAMAL', team: 'España', stats: { shooting: 84, passing: 89, dribbling: 92, physical: 68, defense: 45, speed: 88 }, bio: 'Extremo desequilibrante con gran visión de juego. Probabilidad de asistencia de gol (xA) en esta jornada: 72%. Recomendado: Más de 0.5 asistencias de Yamal.' },
      { name: 'VINICIUS JR.', team: 'Brasil', stats: { shooting: 87, passing: 82, dribbling: 95, physical: 78, defense: 32, speed: 95 }, bio: 'Regates exitosos esperados frente a la zaga uruguaya: 6.5. Probabilidad de gol: 68%. Una opción de gran valor es apostar a que recibe más de 2 faltas durante el encuentro.' },
      { name: 'JUDE BELLINGHAM', team: 'Inglaterra', stats: { shooting: 85, passing: 88, dribbling: 89, physical: 86, defense: 75, speed: 82 }, bio: 'Llegada letal desde segunda línea y gran despliegue físico. Intercepciones esperadas: 6. Probabilidad de ganar duelos individuales en el mediocampo: 80%.' },
      { name: 'SANTIAGO GIMÉNEZ', team: 'México', stats: { shooting: 83, passing: 70, dribbling: 76, physical: 82, defense: 30, speed: 78 }, bio: 'Referencia en punta de ataque. Se prevé que tenga al menos 3 disparos, de los cuales 1.8 irán al arco frente a Suecia. Probabilidad de gol: 65%.' },
      { name: 'LUKA MODRIC', team: 'Croacia', stats: { shooting: 78, passing: 93, dribbling: 87, physical: 72, defense: 68, speed: 69 }, bio: 'Control y distribución quirúrgica del balón en el mediocampo. Precisión de pase esperada: 92%. A sus 40 años, sigue siendo la brújula táctica croata.' },
      { name: 'LUIS DÍAZ', team: 'Colombia', stats: { shooting: 82, passing: 78, dribbling: 90, physical: 80, defense: 40, speed: 92 }, bio: 'Velocidad y desborde por la banda izquierda de Colombia para presionar a Países Bajos. Se proyectan 4 regates exitosos y alta efectividad ofensiva.' },
      { name: 'MOUSA AL-TAMARI', team: 'Jordania', stats: { shooting: 76, passing: 74, dribbling: 85, physical: 75, defense: 42, speed: 88 }, bio: 'El jugador más desequilibrante de Jordania. Tendrá la dura tarea de romper el bloque defensivo de Argentina. Regates completados esperados: 4.' }
    ];
  }
  
  if (currentLeague === 'AR') {
    return [
      { name: 'EDINSON CAVANI', team: 'Boca Juniors', stats: { shooting: 88, passing: 75, dribbling: 72, physical: 80, defense: 45, speed: 76 }, bio: 'Rendimiento estable y jerarquía en el área. Probabilidad de gol en esta fecha clásica: 72%. Excelente opción para primer goleador del partido.' },
      { name: 'MIGUEL BORJA', team: 'River Plate', stats: { shooting: 90, passing: 68, dribbling: 70, physical: 85, defense: 30, speed: 74 }, bio: 'Goleador nato en racha implacable. Probabilidad de gol para esta fecha: 85%. Excelente cuota para gol en cualquier momento.' },
      { name: 'JUANFER QUINTERO', team: 'Racing Club', stats: { shooting: 82, passing: 92, dribbling: 88, physical: 65, defense: 35, speed: 70 }, bio: 'Visión de juego élite y pegada de media distancia. Probabilidad de asistencia de gol en esta fecha: 78%. Gran valor en pases clave.' },
      { name: 'IKER MUNIAIN', team: 'San Lorenzo', stats: { shooting: 78, passing: 86, dribbling: 83, physical: 68, defense: 40, speed: 72 }, bio: 'Inteligencia táctica y distribución refinada. Precisión de pase en zona de finalización: 85%. Eje creador clave para San Lorenzo en esta jornada.' },
      { name: 'RODRIGO CABRAL', team: 'Huracán', stats: { shooting: 74, passing: 76, dribbling: 82, physical: 70, defense: 45, speed: 85 }, bio: 'Extremo picante con gran aceleración en duelos individuales. Se esperan 3.5 regates exitosos por banda y alta participación.' }
    ];
  }

  // Fallback default players for other leagues
  return [
    { name: 'LIONEL MESSI', team: 'Inter Miami', stats: { shooting: 93, passing: 95, dribbling: 94, physical: 70, defense: 32, speed: 80 }, bio: 'Efectividad máxima en tiros libres y creación de juego. Se estiman 1.5 goles/asistencias por partido para esta jornada. Probabilidad de gol: 80%.' },
    { name: 'ERLING HAALAND', team: 'Man City', stats: { shooting: 95, passing: 65, dribbling: 75, physical: 93, defense: 30, speed: 89 }, bio: 'Máquina goleadora de potencia devastadora. Probabilidad de gol esperada en esta fecha: 90%. Gran valor en cuota de Hat-Trick o Doblete.' },
    { name: 'ROBERT LEWANDOWSKI', team: 'Barcelona', stats: { shooting: 91, passing: 72, dribbling: 78, physical: 85, defense: 35, speed: 75 }, bio: 'Posicionamiento impecable en el área rival. Se estiman 4 disparos totales, con 2.2 a puerta frente a su rival en esta fecha.' },
    { name: 'HARRY KANE', team: 'Bayern Munich', stats: { shooting: 92, passing: 84, dribbling: 80, physical: 83, defense: 40, speed: 73 }, bio: 'Goleador integral que retrocede a pivotear. Probabilidad de gol: 82%, probabilidad de asistencia: 45% en esta jornada de Bundesliga.' }
  ];
};
