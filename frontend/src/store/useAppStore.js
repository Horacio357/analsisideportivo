import { create } from 'zustand';
import axios from 'axios';

// Client-side converter helper to ensure consistent betting board format
export const fillFallbackBettingDetails = (m, leagueId) => {
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

export const WC_KNOCKOUT = [
  {
    name: 'Octavos',
    matches: [
      { id: 'r16-1', home: 'Argentina', away: 'Ecuador', homeScore: 2, awayScore: 0, status: 'finished' },
      { id: 'r16-2', home: 'Brasil', away: 'Uruguay', homeScore: 3, awayScore: 1, status: 'finished' },
      { id: 'r16-3', home: 'España', away: 'Marruecos', homeScore: 1, awayScore: 0, status: 'finished' },
      { id: 'r16-4', home: 'Francia', away: 'Polonia', homeScore: 2, awayScore: 1, status: 'finished' },
      { id: 'r16-5', home: 'Alemania', away: 'Japón', homeScore: 3, awayScore: 0, status: 'finished' },
      { id: 'r16-6', home: 'Portugal', away: 'Ghana', homeScore: 2, awayScore: 1, status: 'finished' },
      { id: 'r16-7', home: 'Países Bajos', away: 'Corea del Sur', homeScore: 0, awayScore: 1, status: 'finished' },
      { id: 'r16-8', home: 'México', away: 'Sudáfrica', homeScore: 2, awayScore: 1, status: 'finished' },
    ]
  },
  {
    name: 'Cuartos',
    matches: [
      { id: 'qf-1', home: 'Argentina', away: 'Brasil', homeProb: 52, drawProb: 28, awayProb: 20 },
      { id: 'qf-2', home: 'España', away: 'Francia', homeProb: 48, drawProb: 26, awayProb: 26 },
      { id: 'qf-3', home: 'Alemania', away: 'Portugal', homeProb: 50, drawProb: 26, awayProb: 24 },
      { id: 'qf-4', home: 'Corea del Sur', away: 'México', homeProb: 45, drawProb: 28, awayProb: 27 },
    ]
  },
  {
    name: 'Semis',
    matches: [
      { id: 'sf-1', home: 'TBD', away: 'TBD' },
      { id: 'sf-2', home: 'TBD', away: 'TBD' },
    ]
  },
  {
    name: 'Final 🏆',
    matches: [
      { id: 'final', home: 'TBD', away: 'TBD' },
    ]
  },
];

export const allMatchesFallback = {
  WC: [
    {
      id: 200, home: 'Argentina', homeLogo: '/escudos/WC/argentina.png', away: 'Arabia Saudita', awayLogo: '/escudos/WC/arabiasaudita.png', homeProb: 88, drawProb: 9, awayProb: 3, prediction: 'Local',
      group_name: 'Grupo C', confidence: 'ALTA', status: 'finished', homeScore: 2, awayScore: 1,
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
      group_name: 'Grupo E', confidence: 'ALTA', status: 'live', homeScore: 1, awayScore: 0,
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
      id: 202, home: 'Francia', homeLogo: '/escudos/WC/francia.png', away: 'Senegal', awayLogo: '/escudos/WC/senegal.png', homeProb: 85, drawProb: 12, awayProb: 3, prediction: 'Local',
      group_name: 'Grupo D', confidence: 'ALTA',
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
      group_name: 'Grupo C', confidence: 'MEDIA',
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
      group_name: 'Grupo B', confidence: 'MEDIA',
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
      group_name: 'Grupo G', confidence: 'MEDIA',
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
      group_name: 'Grupo A', confidence: 'VALUE BET',
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
      group_name: 'Grupo F', confidence: 'VALUE BET',
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
      // 🇦🇷 Argentina
      { name: 'LIONEL MESSI', team: 'Argentina', stats: { shooting: 94, passing: 96, dribbling: 95, physical: 70, defense: 35, speed: 82 }, bio: 'El capitán argentino. Probabilidad de gol esperada: 88%.' },
      { name: 'ÁNGEL DI MARÍA', team: 'Argentina', stats: { shooting: 85, passing: 88, dribbling: 90, physical: 70, defense: 38, speed: 85 }, bio: 'Desequilibrante por las bandas y experto en jugadas a balón parado.' },
      { name: 'JULIÁN ÁLVAREZ', team: 'Argentina', stats: { shooting: 86, passing: 80, dribbling: 84, physical: 78, defense: 42, speed: 86 }, bio: 'Delantero versátil y letal. Campeón del mundo con Argentina.' },
      // 🇫🇷 Francia / France
      { name: 'KYLIAN MBAPPÉ', team: 'Francia', stats: { shooting: 92, passing: 80, dribbling: 93, physical: 82, defense: 36, speed: 97 }, bio: 'Aceleración explosiva. Efectividad del 93% en duelos 1v1.' },
      { name: 'ANTOINE GRIEZMANN', team: 'Francia', stats: { shooting: 86, passing: 84, dribbling: 83, physical: 78, defense: 50, speed: 80 }, bio: 'Inteligencia táctica y remate preciso desde segunda línea.' },
      { name: 'OUSMANE DEMBÉLÉ', team: 'Francia', stats: { shooting: 82, passing: 78, dribbling: 91, physical: 72, defense: 35, speed: 94 }, bio: 'Extremo desequilibrante con velocidad demoledora.' },
      // 🇪🇸 España / Spain
      { name: 'LAMINE YAMAL', team: 'España', stats: { shooting: 84, passing: 89, dribbling: 92, physical: 68, defense: 45, speed: 88 }, bio: 'La joya del fútbol español. xA: 72%.' },
      { name: 'ÁLVARO MORATA', team: 'España', stats: { shooting: 84, passing: 76, dribbling: 74, physical: 82, defense: 42, speed: 78 }, bio: 'Referente en el área y buen juego aéreo.' },
      { name: 'PEDRI', team: 'España', stats: { shooting: 78, passing: 92, dribbling: 88, physical: 70, defense: 60, speed: 80 }, bio: 'Mediocampista de clase mundial. Control y distribución exquisita.' },
      // 🇧🇷 Brasil / Brazil
      { name: 'VINICIUS JR.', team: 'Brasil', stats: { shooting: 87, passing: 82, dribbling: 95, physical: 78, defense: 32, speed: 95 }, bio: 'Regates exitosos esperados: 6.5. Probabilidad de gol: 68%.' },
      { name: 'RODRYGO', team: 'Brasil', stats: { shooting: 84, passing: 80, dribbling: 88, physical: 72, defense: 35, speed: 88 }, bio: 'Extremo versátil con llegada letal desde segunda línea.' },
      { name: 'RAPHINHA', team: 'Brasil', stats: { shooting: 83, passing: 82, dribbling: 87, physical: 74, defense: 38, speed: 88 }, bio: 'Extremo derecho con gol y asistencias. Motor del ataque brasileño.' },
      // 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra / England
      { name: 'JUDE BELLINGHAM', team: 'Inglaterra', stats: { shooting: 85, passing: 88, dribbling: 89, physical: 86, defense: 75, speed: 82 }, bio: 'Llegada letal desde segunda línea. 80% de duelos ganados.' },
      { name: 'HARRY KANE', team: 'Inglaterra', stats: { shooting: 92, passing: 84, dribbling: 80, physical: 83, defense: 40, speed: 73 }, bio: 'Goleador integral. Probabilidad de gol: 82%.' },
      { name: 'BUKAYO SAKA', team: 'Inglaterra', stats: { shooting: 83, passing: 84, dribbling: 88, physical: 74, defense: 60, speed: 86 }, bio: 'Extremo derecho consistente y desequilibrante de Arsenal.' },
      // 🇲🇽 México / Mexico
      { name: 'SANTIAGO GIMÉNEZ', team: 'México', stats: { shooting: 83, passing: 70, dribbling: 76, physical: 82, defense: 30, speed: 78 }, bio: 'Referencia en punta. Probabilidad de gol: 65%.' },
      { name: 'HIRVING LOZANO', team: 'México', stats: { shooting: 80, passing: 74, dribbling: 87, physical: 75, defense: 35, speed: 92 }, bio: 'El Chucky: velocidad y desborde por la banda.' },
      { name: 'ALEXIS VEGA', team: 'México', stats: { shooting: 78, passing: 76, dribbling: 83, physical: 72, defense: 38, speed: 86 }, bio: 'Extremo creativo con buen disparo. Gran amenaza del Tri.' },
      // 🇿🇦 Sudáfrica / South Africa
      { name: 'PERCY TAU', team: 'Sudáfrica', stats: { shooting: 78, passing: 76, dribbling: 84, physical: 72, defense: 38, speed: 86 }, bio: 'Capitán y figura de Sudáfrica. Extremo zurdo desequilibrante.' },
      { name: 'EVIDENCE MAKGOPA', team: 'Sudáfrica', stats: { shooting: 80, passing: 68, dribbling: 74, physical: 80, defense: 32, speed: 84 }, bio: 'Delantero centro con gran velocidad y buen remate.' },
      { name: 'BONGANI ZUNGU', team: 'Sudáfrica', stats: { shooting: 72, passing: 80, dribbling: 76, physical: 80, defense: 78, speed: 76 }, bio: 'Mediocampista de contención y recuperación. Motor del equipo.' },
      // 🇭🇷 Croacia / Croatia
      { name: 'LUKA MODRIC', team: 'Croacia', stats: { shooting: 78, passing: 93, dribbling: 87, physical: 72, defense: 68, speed: 69 }, bio: 'La brújula táctica croata. Precisión de pase: 92%.' },
      { name: 'IVAN PERISIC', team: 'Croacia', stats: { shooting: 82, passing: 80, dribbling: 82, physical: 80, defense: 60, speed: 80 }, bio: 'Extremo polivalente y llegada al área. Gran amenaza a balón parado.' },
      { name: 'MATEO KOVACIC', team: 'Croacia', stats: { shooting: 74, passing: 88, dribbling: 86, physical: 76, defense: 72, speed: 80 }, bio: 'Mediocampista dinámico con excelente técnica y recuperación.' },
      // 🇨🇴 Colombia
      { name: 'LUIS DÍAZ', team: 'Colombia', stats: { shooting: 82, passing: 78, dribbling: 90, physical: 80, defense: 40, speed: 92 }, bio: '4 regates exitosos esperados por banda.' },
      { name: 'JAMES RODRÍGUEZ', team: 'Colombia', stats: { shooting: 84, passing: 92, dribbling: 85, physical: 68, defense: 38, speed: 74 }, bio: 'Cerebro creativo de Colombia. Visión de juego única.' },
      { name: 'RAFAEL SANTOS BORRÉ', team: 'Colombia', stats: { shooting: 83, passing: 70, dribbling: 76, physical: 78, defense: 30, speed: 80 }, bio: 'Delantero de área con buen olfato y remate.' },
      // 🇳🇱 Países Bajos / Netherlands
      { name: 'VIRGIL VAN DIJK', team: 'Países Bajos', stats: { shooting: 72, passing: 78, dribbling: 65, physical: 92, defense: 94, speed: 78 }, bio: 'Defensa monumental. 7 duelos aéreos ganados esperados.' },
      { name: 'CODY GAKPO', team: 'Países Bajos', stats: { shooting: 83, passing: 78, dribbling: 84, physical: 78, defense: 42, speed: 84 }, bio: 'Extremo zurdo con gol. Gran amenaza en transiciones.' },
      { name: 'MEMPHIS DEPAY', team: 'Países Bajos', stats: { shooting: 85, passing: 80, dribbling: 86, physical: 76, defense: 40, speed: 84 }, bio: 'Delantero versátil con gran remate y liderazgo.' },
      // 🇵🇹 Portugal
      { name: 'CRISTIANO RONALDO', team: 'Portugal', stats: { shooting: 93, passing: 76, dribbling: 84, physical: 86, defense: 38, speed: 82 }, bio: 'Goleador histórico. Decisivo en momentos clave. Gol: 75%.' },
      { name: 'BERNARDO SILVA', team: 'Portugal', stats: { shooting: 82, passing: 90, dribbling: 88, physical: 74, defense: 52, speed: 82 }, bio: 'Motor del mediocampo portugués. Inteligencia táctica y precisión.' },
      { name: 'RAFAEL LEÃO', team: 'Portugal', stats: { shooting: 83, passing: 78, dribbling: 90, physical: 78, defense: 32, speed: 92 }, bio: 'Extremo veloz con desborde e imprevisibilidad.' },
      // 🇲🇦 Marruecos / Morocco
      { name: 'ACHRAF HAKIMI', team: 'Marruecos', stats: { shooting: 78, passing: 82, dribbling: 86, physical: 80, defense: 80, speed: 92 }, bio: 'Uno de los mejores laterales del mundo. Alto impacto ofensivo.' },
      { name: 'HAKIM ZIYECH', team: 'Marruecos', stats: { shooting: 82, passing: 86, dribbling: 84, physical: 68, defense: 42, speed: 78 }, bio: 'Zurdo mágico con remate potente. Creador nato.' },
      { name: 'YOUSSEF EN-NESYRI', team: 'Marruecos', stats: { shooting: 84, passing: 68, dribbling: 72, physical: 84, defense: 30, speed: 80 }, bio: 'Delantero de área con buen juego aéreo y velocidad.' },
      // 🇺🇸 EE.UU. / USA / United States
      { name: 'CHRISTIAN PULISIC', team: 'EE.UU.', stats: { shooting: 82, passing: 80, dribbling: 88, physical: 72, defense: 45, speed: 90 }, bio: 'El Capitán América. Gran desborde, visión y técnica.' },
      { name: 'TYLER ADAMS', team: 'EE.UU.', stats: { shooting: 70, passing: 82, dribbling: 78, physical: 82, defense: 85, speed: 80 }, bio: 'Mediocampista de contención. Pieza clave del sistema.' },
      { name: 'GIOVANNI REYNA', team: 'EE.UU.', stats: { shooting: 80, passing: 84, dribbling: 86, physical: 70, defense: 45, speed: 82 }, bio: 'Mediocampista creativo con gran técnica y visión de juego.' },
      // 🇸🇦 Arabia Saudita
      { name: 'SALEM AL-DAWSARI', team: 'Arabia Saudita', stats: { shooting: 76, passing: 74, dribbling: 85, physical: 75, defense: 42, speed: 88 }, bio: 'El más desequilibrante de Arabia Saudita. Goleador histórico.' },
      { name: 'SALEH AL-SHEHRI', team: 'Arabia Saudita', stats: { shooting: 72, passing: 70, dribbling: 78, physical: 72, defense: 45, speed: 82 }, bio: 'Delantero con buen posicionamiento en el área.' },
      // 🇳🇿 Nueva Zelanda / New Zealand
      { name: 'CHRIS WOOD', team: 'Nueva Zelanda', stats: { shooting: 82, passing: 68, dribbling: 70, physical: 84, defense: 32, speed: 74 }, bio: 'Delantero de área con buen juego aéreo. Referente absoluto.' },
      { name: 'LIBERATO CACACE', team: 'Nueva Zelanda', stats: { shooting: 72, passing: 76, dribbling: 78, physical: 74, defense: 68, speed: 80 }, bio: 'Lateral versátil que también puede jugar de extremo.' },
      // 🇸🇪 Suecia / Sweden
      { name: 'ALEXANDER ISAK', team: 'Suecia', stats: { shooting: 86, passing: 74, dribbling: 84, physical: 82, defense: 32, speed: 88 }, bio: 'Delantero veloz y técnico. Uno de los mejores de su generación.' },
      { name: 'DEJAN KULUSEVSKI', team: 'Suecia', stats: { shooting: 80, passing: 80, dribbling: 84, physical: 78, defense: 50, speed: 84 }, bio: 'Extremo/mediocampista con buen remate y visión de juego.' },
      // 🇪🇨 Ecuador
      { name: 'ENNER VALENCIA', team: 'Ecuador', stats: { shooting: 84, passing: 72, dribbling: 76, physical: 80, defense: 38, speed: 78 }, bio: 'El rey del gol ecuatoriano. Histórico goleador de su selección.' },
      { name: 'MOISÉS CAICEDO', team: 'Ecuador', stats: { shooting: 72, passing: 84, dribbling: 80, physical: 82, defense: 84, speed: 82 }, bio: 'Mediocampista de primer nivel mundial. Potente y preciso.' },
      // 🇺🇾 Uruguay
      { name: 'FEDERICO VALVERDE', team: 'Uruguay', stats: { shooting: 82, passing: 86, dribbling: 84, physical: 84, defense: 72, speed: 88 }, bio: 'Mediocampista completo y dinámico. Uno de los mejores del mundo.' },
      { name: 'DARWIN NÚÑEZ', team: 'Uruguay', stats: { shooting: 85, passing: 70, dribbling: 80, physical: 86, defense: 30, speed: 90 }, bio: 'Delantero potente y explosivo. Fuerte en el juego directo.' },
      { name: 'RODRIGO BENTANCUR', team: 'Uruguay', stats: { shooting: 74, passing: 86, dribbling: 80, physical: 80, defense: 76, speed: 78 }, bio: 'Mediocampista sólido y distribuidor de calidad.' },
      // 🇸🇳 Senegal
      { name: 'SADIO MANÉ', team: 'Senegal', stats: { shooting: 84, passing: 78, dribbling: 88, physical: 80, defense: 50, speed: 90 }, bio: 'Goleador histórico y figura máxima de Senegal.' },
      { name: 'ISMAÏLA SARR', team: 'Senegal', stats: { shooting: 78, passing: 74, dribbling: 86, physical: 76, defense: 40, speed: 92 }, bio: 'Extremo técnico con enorme desborde y velocidad.' },
      // 🇨🇦 Canadá / Canada
      { name: 'ALPHONSO DAVIES', team: 'Canadá', stats: { shooting: 78, passing: 80, dribbling: 88, physical: 78, defense: 75, speed: 97 }, bio: 'El más rápido del mundial. Lateral izquierdo de impacto global.' },
      { name: 'JONATHAN DAVID', team: 'Canadá', stats: { shooting: 88, passing: 76, dribbling: 82, physical: 78, defense: 32, speed: 86 }, bio: 'Goleador top en Europa. Referente del ataque canadiense.' },
      // 🇶🇦 Qatar
      { name: 'AKRAM AFIF', team: 'Qatar', stats: { shooting: 80, passing: 78, dribbling: 86, physical: 70, defense: 42, speed: 86 }, bio: 'El mejor jugador de Qatar. Extremo izquierdo con gran técnica y desborde.' },
      { name: 'ALMOEZ ALI', team: 'Qatar', stats: { shooting: 82, passing: 68, dribbling: 74, physical: 76, defense: 30, speed: 80 }, bio: 'Goleador histórico de Qatar. Delantero de área con buen posicionamiento.' },
      { name: 'HASSAN AL-HAYDOS', team: 'Qatar', stats: { shooting: 76, passing: 82, dribbling: 80, physical: 68, defense: 45, speed: 76 }, bio: 'Capitán histórico de Qatar. Motor creativo del mediocampo.' },
      // 🇨🇭 Suiza / Switzerland
      { name: 'GRANIT XHAKA', team: 'Suiza', stats: { shooting: 76, passing: 88, dribbling: 78, physical: 82, defense: 82, speed: 72 }, bio: 'Motor y cerebro del mediocampo suizo. Precisión y temperamento.' },
      { name: 'XHERDAN SHAQIRI', team: 'Suiza', stats: { shooting: 82, passing: 82, dribbling: 86, physical: 72, defense: 50, speed: 80 }, bio: 'Extremo desequilibrante con remate potente. El más creativo de Suiza.' },
      { name: 'BREEL EMBOLO', team: 'Suiza', stats: { shooting: 82, passing: 70, dribbling: 78, physical: 82, defense: 35, speed: 84 }, bio: 'Delantero físico con buena velocidad y remate. Referente del ataque.' },
      // 🇰🇷 Corea del Sur / Korea Republic
      { name: 'SON HEUNG-MIN', team: 'Corea del Sur', stats: { shooting: 86, passing: 78, dribbling: 84, physical: 74, defense: 45, speed: 86 }, bio: 'Capitán y figura de Corea del Sur. Goleador de primer nivel mundial.' },
      { name: 'LEE KANG-IN', team: 'Corea del Sur', stats: { shooting: 82, passing: 84, dribbling: 88, physical: 68, defense: 48, speed: 82 }, bio: 'Extremo creativo con técnica exquisita. La joya más brillante del equipo.' },
      { name: 'HWANG HEE-CHAN', team: 'Corea del Sur', stats: { shooting: 82, passing: 70, dribbling: 78, physical: 78, defense: 38, speed: 88 }, bio: 'Delantero veloz con buen remate. Gran trabajo en profundidad.' },
      // 🇨🇿 República Checa / Czechia
      { name: 'PATRIK SCHICK', team: 'República Checa', stats: { shooting: 86, passing: 72, dribbling: 76, physical: 82, defense: 30, speed: 78 }, bio: 'Goleador de élite en la Bundesliga. Técnica y potencia en el área.' },
      { name: 'TOMÁŠ SOUČEK', team: 'República Checa', stats: { shooting: 76, passing: 80, dribbling: 74, physical: 88, defense: 80, speed: 74 }, bio: 'Mediocampista poderoso con llegada al área. Especialista en goles de cabeza.' },
      { name: 'VLADIMÍR COUFAL', team: 'República Checa', stats: { shooting: 68, passing: 76, dribbling: 74, physical: 80, defense: 82, speed: 80 }, bio: 'Lateral derecho ofensivo con gran energía y proyección.' },
      // 🇭🇹 Haití / Haiti
      { name: 'FRANTZDY PIERROT', team: 'Haití', stats: { shooting: 78, passing: 68, dribbling: 76, physical: 74, defense: 32, speed: 84 }, bio: 'Delantero veloz de Haití. Capacidad de desequilibrar en velocidad.' },
      { name: 'NICOLAS GÉLO CIUS', team: 'Haití', stats: { shooting: 72, passing: 74, dribbling: 78, physical: 72, defense: 45, speed: 82 }, bio: 'Extremo con buen desborde y llegada al área.' },
      // 🏴󠁧󠁢󠁳󠁣󠁴󠁿 Escocia / Scotland
      { name: 'ANDY ROBERTSON', team: 'Escocia', stats: { shooting: 72, passing: 84, dribbling: 80, physical: 78, defense: 84, speed: 84 }, bio: 'Capitán de Escocia y uno de los mejores laterales del mundo.' },
      { name: 'SCOTT MCTOMINAY', team: 'Escocia', stats: { shooting: 78, passing: 80, dribbling: 76, physical: 86, defense: 80, speed: 78 }, bio: 'Mediocampista box-to-box con gran llegada al área y carácter.' },
      { name: 'LYNDON DYKES', team: 'Escocia', stats: { shooting: 78, passing: 65, dribbling: 68, physical: 84, defense: 32, speed: 74 }, bio: 'Delantero referencia de área. Poderoso en el juego aéreo.' },
      // 🇵🇱 Polonia
      { name: 'ROBERT LEWANDOWSKI', team: 'Polonia', stats: { shooting: 92, passing: 78, dribbling: 82, physical: 85, defense: 30, speed: 75 }, bio: 'Goleador legendario y capitán polaco.' },
      // 🇯🇵 Japón
      { name: 'TAKEFUSA KUBO', team: 'Japón', stats: { shooting: 80, passing: 85, dribbling: 88, physical: 65, defense: 45, speed: 86 }, bio: 'Extremo veloz y muy habilidoso.' },
      // 🇬🇭 Ghana
      { name: 'MOHAMMED KUDUS', team: 'Ghana', stats: { shooting: 82, passing: 80, dribbling: 86, physical: 78, defense: 50, speed: 85 }, bio: 'Mediocampista ofensivo desequilibrante.' },
      // 🇦🇺 Australia
      { name: 'MATHEW LECKIE', team: 'Australia', stats: { shooting: 78, passing: 74, dribbling: 80, physical: 76, defense: 48, speed: 88 }, bio: 'Capitán y alma de Australia. Extremo veloz con gol importante.' },
      { name: 'MITCHELL DUKE', team: 'Australia', stats: { shooting: 76, passing: 66, dribbling: 68, physical: 80, defense: 32, speed: 72 }, bio: 'Delantero de área con buen juego aéreo. Referente del ataque.' },
      { name: 'AJDIN HRUSTIC', team: 'Australia', stats: { shooting: 74, passing: 82, dribbling: 76, physical: 70, defense: 52, speed: 76 }, bio: 'Mediocampista creativo con buen pase y visión de juego.' },
      // 🇹🇷 Turquía / Turkey
      { name: 'ARDA GÜLER', team: 'Turquía', stats: { shooting: 84, passing: 86, dribbling: 90, physical: 68, defense: 42, speed: 84 }, bio: 'El prodigio turco del Real Madrid. Técnica, visión y remate extraordinarios.' },
      { name: 'HAKAN ÇALHANOĞLU', team: 'Turquía', stats: { shooting: 82, passing: 90, dribbling: 82, physical: 74, defense: 62, speed: 76 }, bio: 'Motor creativo del Inter y Turquía. Pase largo y remate de primera.' },
      { name: 'KEREM AKTÜRKOĞLU', team: 'Turquía', stats: { shooting: 80, passing: 76, dribbling: 86, physical: 72, defense: 38, speed: 88 }, bio: 'Extremo desequilibrante con velocidad y buen disparo.' },
      // 🇩🇪 Alemania / Germany
      { name: 'FLORIAN WIRTZ', team: 'Alemania', stats: { shooting: 86, passing: 90, dribbling: 90, physical: 70, defense: 48, speed: 84 }, bio: 'El mejor joven de Europa. Creatividad y decisión desequilibrante.' },
      { name: 'JAMAL MUSIALA', team: 'Alemania', stats: { shooting: 85, passing: 86, dribbling: 92, physical: 70, defense: 48, speed: 86 }, bio: 'Driblador natural con visión y gol. La joya del Bayern y Alemania.' },
      { name: 'KAI HAVERTZ', team: 'Alemania', stats: { shooting: 84, passing: 82, dribbling: 82, physical: 80, defense: 52, speed: 80 }, bio: 'Mediapunta versátil con llegada al área y buen juego de cabeza.' },
      // 🇨🇼 Curaçao
      { name: 'LEANDRO BACUNA', team: 'Curaçao', stats: { shooting: 74, passing: 76, dribbling: 72, physical: 78, defense: 65, speed: 74 }, bio: 'Capitán de Curaçao. Versátil y con experiencia en ligas europeas.' },
      { name: 'JARCHINIO ANTONIA', team: 'Curaçao', stats: { shooting: 76, passing: 72, dribbling: 80, physical: 70, defense: 40, speed: 86 }, bio: 'Extremo veloz y desequilibrante. El más peligroso del equipo en ataque.' },
      // 🇧🇪 Bélgica / Belgium
      { name: 'ROMELU LUKAKU', team: 'Bélgica', stats: { shooting: 88, passing: 68, dribbling: 76, physical: 90, defense: 30, speed: 84 }, bio: 'Delantero físico imponente. Uno de los goleadores más temibles de Europa.' },
      { name: 'KEVIN DE BRUYNE', team: 'Bélgica', stats: { shooting: 84, passing: 96, dribbling: 86, physical: 78, defense: 55, speed: 80 }, bio: 'El mejor asistidor del mundo. Visión y remate de primer nivel.' },
      { name: 'DRIES MERTENS', team: 'Bélgica', stats: { shooting: 84, passing: 80, dribbling: 82, physical: 68, defense: 42, speed: 80 }, bio: 'Extremo/delantero con excelente técnica y pegada. Gran experiencia.' },
      // 🇪🇬 Egipto / Egypt
      { name: 'MOHAMED SALAH', team: 'Egipto', stats: { shooting: 90, passing: 82, dribbling: 89, physical: 76, defense: 45, speed: 90 }, bio: 'La estrella absoluta de Egipto. Máquina de goles y asistencias en Liverpool.' },
      { name: 'OMAR MARMOUSH', team: 'Egipto', stats: { shooting: 84, passing: 76, dribbling: 84, physical: 76, defense: 38, speed: 88 }, bio: 'Extremo explosivo con gran gol. Referente del ataque egipcio.' },
      { name: 'TRÉZÉGUET', team: 'Egipto', stats: { shooting: 80, passing: 74, dribbling: 82, physical: 72, defense: 38, speed: 84 }, bio: 'Extremo zurdo con buen regate y llegada. Veterano de experiencia.' },
      // 🇮🇶 Irak / Iraq
      { name: 'AYMEN HUSSEIN', team: 'Irak', stats: { shooting: 78, passing: 70, dribbling: 76, physical: 74, defense: 32, speed: 78 }, bio: 'Goleador de Irak. Delantero con buen posicionamiento y remate.' },
      { name: 'AMJAD ATTWAN', team: 'Irak', stats: { shooting: 72, passing: 76, dribbling: 74, physical: 72, defense: 48, speed: 76 }, bio: 'Mediocampista creativo. Motor del juego ofensivo iraquí.' },
      // 🇳🇴 Noruega / Norway
      { name: 'ERLING HAALAND', team: 'Noruega', stats: { shooting: 95, passing: 65, dribbling: 75, physical: 93, defense: 30, speed: 89 }, bio: 'El mejor delantero del planeta. Probabilidad de gol: 95%.' },
      { name: 'MARTIN ØDEGAARD', team: 'Noruega', stats: { shooting: 82, passing: 91, dribbling: 86, physical: 70, defense: 62, speed: 78 }, bio: 'Capitán y cerebro de Noruega. Control y distribución excelentes.' },
      { name: 'ALEXANDER SØRLOTH', team: 'Noruega', stats: { shooting: 84, passing: 68, dribbling: 70, physical: 86, defense: 32, speed: 80 }, bio: 'Delantero físico con buena llegada y remate. Competencia interna sana.' },
      // 🇬🇭 Ghana
      { name: 'JORDAN AYEW', team: 'Ghana', stats: { shooting: 78, passing: 74, dribbling: 78, physical: 76, defense: 45, speed: 80 }, bio: 'Veterano del equipo. Versátil y con experiencia europea.' },
      { name: 'MOHAMMED KUDUS', team: 'Ghana', stats: { shooting: 82, passing: 78, dribbling: 88, physical: 74, defense: 45, speed: 86 }, bio: 'La joya de Ghana. Mediocampista desequilibrante con gran remate.' },
      { name: 'INAKI WILLIAMS', team: 'Ghana', stats: { shooting: 80, passing: 72, dribbling: 84, physical: 82, defense: 40, speed: 92 }, bio: 'Extremo veloz que optó por Ghana. Desborde y proyección constante.' },
      // 🇵🇦 Panamá / Panama
      { name: 'ROLANDO BLACKBURN', team: 'Panamá', stats: { shooting: 76, passing: 65, dribbling: 72, physical: 78, defense: 30, speed: 78 }, bio: 'Delantero referencia de Panamá. Buen remate y posicionamiento.' },
      { name: 'ADALBERTO CARRASQUILLA', team: 'Panamá', stats: { shooting: 72, passing: 80, dribbling: 76, physical: 72, defense: 58, speed: 74 }, bio: 'Mediocampista creativo y organizador del juego panameño.' },
      // 🇧🇦 Bosnia y Herzegovina / Bosnia-H
      { name: 'EDIN DŽEKO', team: 'Bosnia y Herzegovina', stats: { shooting: 84, passing: 74, dribbling: 72, physical: 82, defense: 30, speed: 72 }, bio: 'Leyenda e ídolo de Bosnia. Goleador histórico con gran olfato.' },
      { name: 'SEAD KOLAŠINAC', team: 'Bosnia y Herzegovina', stats: { shooting: 68, passing: 74, dribbling: 72, physical: 84, defense: 82, speed: 78 }, bio: 'Lateral izquierdo poderoso con buen empuje ofensivo.' },
      // 🇵🇾 Paraguay
      { name: 'MIGUEL ALMIRÓN', team: 'Paraguay', stats: { shooting: 78, passing: 80, dribbling: 84, physical: 76, defense: 58, speed: 88 }, bio: 'Mediocampista dinámico con gran despliegue físico. Motor del equipo.' },
      { name: 'JULIO ENCISO', team: 'Paraguay', stats: { shooting: 80, passing: 76, dribbling: 84, physical: 70, defense: 40, speed: 84 }, bio: 'Joven talento con excelente técnica y llegada al área. Gran futuro.' },
      { name: 'ANTONIO SANABRIA', team: 'Paraguay', stats: { shooting: 82, passing: 68, dribbling: 72, physical: 78, defense: 30, speed: 78 }, bio: 'Delantero de área con buen olfato goleador y remate.' },
      // 🇸🇦 Arabia Saudita / Saudi Arabia
      { name: 'SALEM AL-DAWSARI', team: 'Arabia Saudita', stats: { shooting: 78, passing: 76, dribbling: 84, physical: 70, defense: 40, speed: 84 }, bio: 'Extremo desequilibrante y goleador. Figura histórica del fútbol saudí.' },
      { name: 'MOHAMMED AL-QASIM', team: 'Arabia Saudita', stats: { shooting: 74, passing: 72, dribbling: 76, physical: 74, defense: 42, speed: 80 }, bio: 'Mediocampista con buena distribución y visión táctica.' },
      // 🇯🇵 Japón / Japan
      { name: 'TAKUMI MINAMINO', team: 'Japón', stats: { shooting: 82, passing: 78, dribbling: 82, physical: 72, defense: 50, speed: 84 }, bio: 'Mediapunta versátil. Motor y goleador de la selección japonesa.' },
      { name: 'RITSU DOAN', team: 'Japón', stats: { shooting: 80, passing: 76, dribbling: 84, physical: 70, defense: 48, speed: 86 }, bio: 'Extremo izquierdo veloz con remate potente. Decisivo en grandes partidos.' },
      { name: 'AO TANAKA', team: 'Japón', stats: { shooting: 72, passing: 82, dribbling: 76, physical: 76, defense: 76, speed: 78 }, bio: 'Mediocampista completo con gran capacidad de recuperación.' },
      // 🇨🇱 Chile
      { name: 'ALEXIS SÁNCHEZ', team: 'Chile', stats: { shooting: 84, passing: 80, dribbling: 88, physical: 76, defense: 48, speed: 84 }, bio: 'Leyenda viva del fútbol chileno. Carácter y calidad en cada partido.' },
      { name: 'CHARLES ARÁNGUIZ', team: 'Chile', stats: { shooting: 74, passing: 86, dribbling: 80, physical: 78, defense: 76, speed: 76 }, bio: 'Mediocampista de jerarquía. Inteligencia táctica y distribución precisa.' },
    ];
  }

  
  if (currentLeague === 'AR') {
    return [
      { name: 'EDINSON CAVANI', team: 'Boca Juniors', stats: { shooting: 88, passing: 75, dribbling: 72, physical: 80, defense: 45, speed: 76 }, bio: 'Jerarquía en el área. Probabilidad de gol en el clásico: 72%.' },
      { name: 'KEVIN MAC ALLISTER', team: 'Boca Juniors', stats: { shooting: 75, passing: 84, dribbling: 80, physical: 76, defense: 62, speed: 78 }, bio: 'Mediocampista con buena llegada y visión de juego.' },
      { name: 'MIGUEL BORJA', team: 'River Plate', stats: { shooting: 90, passing: 68, dribbling: 70, physical: 85, defense: 30, speed: 74 }, bio: 'Goleador nato en racha. Probabilidad de gol: 85%.' },
      { name: 'PABLO SOLARI', team: 'River Plate', stats: { shooting: 80, passing: 76, dribbling: 85, physical: 72, defense: 38, speed: 88 }, bio: 'Extremo desequilibrante con gran velocidad y remate.' },
      { name: 'JUANFER QUINTERO', team: 'Racing Club', stats: { shooting: 82, passing: 92, dribbling: 88, physical: 65, defense: 35, speed: 70 }, bio: 'Visión de juego élite. Probabilidad de asistencia: 78%.' },
      { name: 'ROGER MARTÍNEZ', team: 'Racing Club', stats: { shooting: 84, passing: 72, dribbling: 82, physical: 78, defense: 32, speed: 86 }, bio: 'Delantero explosivo con buen remate y desborde.' },
      { name: 'SILVIO ROMERO', team: 'Independiente', stats: { shooting: 84, passing: 68, dribbling: 72, physical: 80, defense: 35, speed: 74 }, bio: 'Goleador histórico del Rojo. Referente en el área rival.' },
      { name: 'ALEX MEZA', team: 'Independiente', stats: { shooting: 76, passing: 74, dribbling: 80, physical: 72, defense: 42, speed: 84 }, bio: 'Extremo zurdo con desborde y llegada al área.' },
      { name: 'IKER MUNIAIN', team: 'San Lorenzo', stats: { shooting: 78, passing: 86, dribbling: 83, physical: 68, defense: 40, speed: 72 }, bio: 'Inteligencia táctica y distribución refinada. Eje creador clave.' },
      { name: 'ADAM BAREIRO', team: 'San Lorenzo', stats: { shooting: 82, passing: 68, dribbling: 74, physical: 78, defense: 30, speed: 80 }, bio: 'Delantero paraguayo con buen olfato goleador.' },
      { name: 'RODRIGO CABRAL', team: 'Huracán', stats: { shooting: 74, passing: 76, dribbling: 82, physical: 70, defense: 45, speed: 85 }, bio: 'Extremo con gran aceleración. 3.5 regates exitosos esperados.' },
      { name: 'IGNACIO PUSSETTO', team: 'Huracán', stats: { shooting: 78, passing: 72, dribbling: 78, physical: 76, defense: 38, speed: 82 }, bio: 'Extremo versátil con gol y buena proyección ofensiva.' },
    ];
  }

  if (currentLeague === 'ES') {
    return [
      { name: 'VINICIUS JR.', team: 'Real Madrid', stats: { shooting: 88, passing: 82, dribbling: 95, physical: 78, defense: 32, speed: 95 }, bio: 'Desequilibrante absoluto en La Liga. Probabilidad de gol: 72%.' },
      { name: 'KYLIAN MBAPPÉ', team: 'Real Madrid', stats: { shooting: 93, passing: 80, dribbling: 93, physical: 82, defense: 36, speed: 97 }, bio: 'Nuevo galáctico de velocidad letal. Excelente en transiciones.' },
      { name: 'LAMINE YAMAL', team: 'Barcelona', stats: { shooting: 84, passing: 89, dribbling: 92, physical: 68, defense: 45, speed: 88 }, bio: 'La joya del Barça. Extremo desequilibrante con gran visión.' },
      { name: 'ROBERT LEWANDOWSKI', team: 'Barcelona', stats: { shooting: 91, passing: 72, dribbling: 78, physical: 85, defense: 35, speed: 75 }, bio: 'Posicionamiento impecable. 2.2 disparos a puerta esperados.' },
      { name: 'ANTOINE GRIEZMANN', team: 'Atlético Madrid', stats: { shooting: 86, passing: 84, dribbling: 83, physical: 78, defense: 50, speed: 80 }, bio: 'Líder del Atleti. Inteligencia táctica y remate preciso.' },
      { name: 'ÁLVARO MORATA', team: 'Atlético Madrid', stats: { shooting: 84, passing: 76, dribbling: 74, physical: 82, defense: 42, speed: 78 }, bio: 'Referente en el área. Goleador de la selección española.' },
      { name: 'YOUSSEF EN-NESYRI', team: 'Sevilla', stats: { shooting: 84, passing: 68, dribbling: 72, physical: 84, defense: 30, speed: 80 }, bio: 'Juego aéreo excelente y gran velocidad. Goleador natural.' },
      { name: 'IÑAKI WILLIAMS', team: 'Athletic Club', stats: { shooting: 80, passing: 72, dribbling: 84, physical: 82, defense: 40, speed: 92 }, bio: 'El más rápido de La Liga. Desborde y proyección constante.' },
      { name: 'MIKEL OYARZABAL', team: 'Real Sociedad', stats: { shooting: 83, passing: 84, dribbling: 82, physical: 72, defense: 48, speed: 78 }, bio: 'Capitán y eje creador de la Real. Remate preciso y buen juego asociativo.' },
    ];
  }

  if (currentLeague === 'EN') {
    return [
      { name: 'ERLING HAALAND', team: 'Man City', stats: { shooting: 95, passing: 65, dribbling: 75, physical: 93, defense: 30, speed: 89 }, bio: 'Máquina goleadora. Probabilidad de gol: 90%. Gran valor en doblete.' },
      { name: 'KEVIN DE BRUYNE', team: 'Man City', stats: { shooting: 84, passing: 96, dribbling: 86, physical: 78, defense: 55, speed: 80 }, bio: 'El mejor asistidor de la Premier. Visión de juego extraordinaria.' },
      { name: 'BUKAYO SAKA', team: 'Arsenal', stats: { shooting: 83, passing: 84, dribbling: 88, physical: 74, defense: 60, speed: 86 }, bio: 'Extremo derecho de Arsenal. Consistente y desequilibrante.' },
      { name: 'MARTIN ØDEGAARD', team: 'Arsenal', stats: { shooting: 82, passing: 91, dribbling: 86, physical: 70, defense: 62, speed: 78 }, bio: 'Capitán y cerebro del Arsenal. Control y distribución excelentes.' },
      { name: 'MOHAMED SALAH', team: 'Liverpool', stats: { shooting: 90, passing: 82, dribbling: 89, physical: 76, defense: 45, speed: 90 }, bio: 'Máquina de goles y asistencias. El mejor jugador de la Premier esta temporada.' },
      { name: 'VIRGIL VAN DIJK', team: 'Liverpool', stats: { shooting: 72, passing: 78, dribbling: 65, physical: 92, defense: 94, speed: 78 }, bio: 'Mejor defensa del mundo. Dominador aéreo y organizador defensivo.' },
      { name: 'COLE PALMER', team: 'Chelsea', stats: { shooting: 86, passing: 88, dribbling: 88, physical: 72, defense: 48, speed: 80 }, bio: 'Revelación de la temporada. Goleador y asistidor de clase mundial.' },
      { name: 'NICOLAS JACKSON', team: 'Chelsea', stats: { shooting: 82, passing: 70, dribbling: 80, physical: 80, defense: 32, speed: 86 }, bio: 'Delantero dinámico con velocidad y buen remate.' },
      { name: 'OLLIE WATKINS', team: 'Aston Villa', stats: { shooting: 85, passing: 74, dribbling: 78, physical: 80, defense: 40, speed: 84 }, bio: 'Delantero en estado de gracia. Uno de los mejores de la Premier.' },
      { name: 'SON HEUNG-MIN', team: 'Tottenham', stats: { shooting: 86, passing: 78, dribbling: 84, physical: 74, defense: 45, speed: 86 }, bio: 'Capitán y figura del Tottenham. Zurdo y derecho con igual efectividad.' },
    ];
  }

  if (currentLeague === 'DE') {
    return [
      { name: 'HARRY KANE', team: 'Bayern Munich', stats: { shooting: 92, passing: 84, dribbling: 80, physical: 83, defense: 40, speed: 73 }, bio: 'El goleador total. Probabilidad de gol en Bundesliga: 85%.' },
      { name: 'JAMAL MUSIALA', team: 'Bayern Munich', stats: { shooting: 85, passing: 86, dribbling: 92, physical: 70, defense: 48, speed: 86 }, bio: 'La joya del Bayern. Desequilibrante y creador de alto nivel.' },
      { name: 'SERHOU GUIRASSY', team: 'Borussia Dortmund', stats: { shooting: 88, passing: 68, dribbling: 74, physical: 84, defense: 32, speed: 82 }, bio: 'Delantero potente con gran pegada. Goleador natural del Dortmund.' },
      { name: 'JULIAN BRANDT', team: 'Borussia Dortmund', stats: { shooting: 80, passing: 88, dribbling: 84, physical: 72, defense: 50, speed: 80 }, bio: 'Mediocampista creativo con buena llegada al área y visión.' },
      { name: 'GRANIT XHAKA', team: 'Bayer Leverkusen', stats: { shooting: 76, passing: 88, dribbling: 78, physical: 82, defense: 82, speed: 72 }, bio: 'Motor del mediocampo del Leverkusen. Precisión y temperamento.' },
      { name: 'FLORIAN WIRTZ', team: 'Bayer Leverkusen', stats: { shooting: 86, passing: 90, dribbling: 90, physical: 70, defense: 48, speed: 84 }, bio: 'El mejor joven de Europa. Creatividad e impacto desequilibrante.' },
      { name: 'LOIS OPENDA', team: 'RB Leipzig', stats: { shooting: 86, passing: 72, dribbling: 82, physical: 78, defense: 35, speed: 90 }, bio: 'Delantero explosivo con gran velocidad y definición.' },
      { name: 'XAVI SIMONS', team: 'RB Leipzig', stats: { shooting: 82, passing: 86, dribbling: 88, physical: 68, defense: 45, speed: 86 }, bio: 'Mediocampista creativo de alto vuelo. Llegada al área y remate.' },
    ];
  }

  if (currentLeague === 'IT') {
    return [
      { name: 'LAUTARO MARTÍNEZ', team: 'Inter Milan', stats: { shooting: 90, passing: 76, dribbling: 82, physical: 82, defense: 38, speed: 82 }, bio: 'Goleador del Inter y la selección argentina. Probabilidad de gol: 82%.' },
      { name: 'MARCUS THURAM', team: 'Inter Milan', stats: { shooting: 84, passing: 72, dribbling: 80, physical: 86, defense: 35, speed: 84 }, bio: 'Delantero físico y veloz. Excelente en el juego asociativo con Lautaro.' },
      { name: 'RAFAEL LEÃO', team: 'AC Milan', stats: { shooting: 83, passing: 78, dribbling: 90, physical: 78, defense: 32, speed: 92 }, bio: 'Extremo desequilibrante del Milan. Velocidad e imprevisibilidad.' },
      { name: 'OLIVIER GIROUD', team: 'AC Milan', stats: { shooting: 84, passing: 76, dribbling: 68, physical: 84, defense: 38, speed: 68 }, bio: 'Referente del área y juego de pivote. Experto en aprovechar centros.' },
      { name: 'DUŠAN VLAHOVIĆ', team: 'Juventus', stats: { shooting: 90, passing: 70, dribbling: 74, physical: 86, defense: 32, speed: 80 }, bio: 'Delantero poderoso con gran disparo. Referente de la Juventus.' },
      { name: 'KHVICHA KVARATSKHELIA', team: 'Napoli', stats: { shooting: 84, passing: 82, dribbling: 92, physical: 74, defense: 40, speed: 88 }, bio: 'Extremo zurdo de ensueño. Desequilibrante y goleador del Napoli.' },
      { name: 'VICTOR OSIMHEN', team: 'Napoli', stats: { shooting: 90, passing: 68, dribbling: 80, physical: 88, defense: 30, speed: 90 }, bio: 'Delantero físico y veloz. Uno de los más letales de Europa.' },
    ];
  }

  if (currentLeague === 'US') {
    return [
      { name: 'LIONEL MESSI', team: 'Inter Miami', stats: { shooting: 93, passing: 95, dribbling: 94, physical: 70, defense: 32, speed: 80 }, bio: 'Efectividad máxima. Se estiman 1.5 goles/asistencias por partido.' },
      { name: 'LUIS SUÁREZ', team: 'Inter Miami', stats: { shooting: 88, passing: 78, dribbling: 82, physical: 78, defense: 35, speed: 76 }, bio: 'Veterano goleador. Inteligencia y olfato en el área.' },
      { name: 'RIQUI PUIG', team: 'LA Galaxy', stats: { shooting: 78, passing: 86, dribbling: 88, physical: 64, defense: 45, speed: 80 }, bio: 'Mediocampista creativo con gran técnica y llegada al área.' },
      { name: 'DEJAN JOVELJIĆ', team: 'LA Galaxy', stats: { shooting: 82, passing: 70, dribbling: 76, physical: 80, defense: 30, speed: 82 }, bio: 'Delantero con gran potencia de disparo y posicionamiento.' },
      { name: 'DANTE VANZEIR', team: 'NY Red Bulls', stats: { shooting: 80, passing: 72, dribbling: 78, physical: 76, defense: 35, speed: 84 }, bio: 'Extremo dinámico con gol. Referente ofensivo del equipo.' },
      { name: 'FACUNDO TORRES', team: 'Orlando City', stats: { shooting: 82, passing: 78, dribbling: 86, physical: 72, defense: 38, speed: 84 }, bio: 'Extremo izquierdo desequilibrante. El mejor jugador del Orlando City.' },
    ];
  }

  if (currentLeague === 'MX') {
    return [
      { name: 'HENRY MARTÍN', team: 'Club América', stats: { shooting: 86, passing: 72, dribbling: 74, physical: 80, defense: 38, speed: 78 }, bio: 'Goleador histórico del América. Referente del ataque azulcrema.' },
      { name: 'JULIAN QUIÑONES', team: 'Club América', stats: { shooting: 82, passing: 74, dribbling: 86, physical: 76, defense: 32, speed: 90 }, bio: 'Extremo veloz y desequilibrante. Gran capacidad de desborde.' },
      { name: 'ROBERTO ALVARADO', team: 'Chivas', stats: { shooting: 80, passing: 80, dribbling: 84, physical: 72, defense: 48, speed: 82 }, bio: 'El Piojo: motor y figura de las Chivas. Gol y creación de juego.' },
      { name: 'ALEXIS VEGA', team: 'Chivas', stats: { shooting: 82, passing: 74, dribbling: 84, physical: 72, defense: 38, speed: 86 }, bio: 'Extremo desequilibrante con gran remate. Uno de los mejores de la Liga MX.' },
      { name: 'GONZALO CARNEIRO', team: 'Cruz Azul', stats: { shooting: 84, passing: 68, dribbling: 72, physical: 82, defense: 32, speed: 78 }, bio: 'Delantero físico con buen cabezazo y posicionamiento en el área.' },
      { name: 'JUAN PABLO VIGÓN', team: 'Cruz Azul', stats: { shooting: 72, passing: 86, dribbling: 78, physical: 76, defense: 62, speed: 74 }, bio: 'Mediocampista de control y distribución. Buen trabajo defensivo.' },
      { name: 'JORGE RUVALCABA', team: 'Pumas UNAM', stats: { shooting: 78, passing: 76, dribbling: 80, physical: 72, defense: 42, speed: 84 }, bio: 'Extremo veloz de los Pumas. Creador de juego por las bandas.' },
    ];
  }

  if (currentLeague === 'BR') {
    return [
      { name: 'PEDRO', team: 'Flamengo', stats: { shooting: 88, passing: 72, dribbling: 78, physical: 82, defense: 32, speed: 76 }, bio: 'Goleador del Flamengo y la selección. Probabilidad de gol: 80%.' },
      { name: 'ARRASCAETA', team: 'Flamengo', stats: { shooting: 82, passing: 88, dribbling: 86, physical: 68, defense: 40, speed: 80 }, bio: 'Mediocampista uruguayo de alto nivel. Creación y gol desde segunda línea.' },
      { name: 'RAPHAEL VEIGA', team: 'Palmeiras', stats: { shooting: 86, passing: 82, dribbling: 82, physical: 72, defense: 48, speed: 78 }, bio: 'Mediocampista goleador del Palmeiras. Gran pegada de media distancia.' },
      { name: 'RONY', team: 'Palmeiras', stats: { shooting: 82, passing: 74, dribbling: 86, physical: 76, defense: 38, speed: 88 }, bio: 'Extremo desequilibrante y goleador del Verdão.' },
      { name: 'YUÍ BISSOLI', team: 'Corinthians', stats: { shooting: 80, passing: 68, dribbling: 72, physical: 82, defense: 32, speed: 76 }, bio: 'Delantero de área con buen remate y posicionamiento.' },
      { name: 'CALLERI', team: 'São Paulo', stats: { shooting: 86, passing: 70, dribbling: 72, physical: 80, defense: 32, speed: 74 }, bio: 'Goleador histórico del São Paulo. Referente en el área.' },
      { name: 'HULK', team: 'Atletico MG', stats: { shooting: 88, passing: 70, dribbling: 74, physical: 88, defense: 35, speed: 76 }, bio: 'Veterano con potencia devastadora. Tiros libres peligrosos.' },
      { name: 'TIQUINHO SOARES', team: 'Botafogo', stats: { shooting: 86, passing: 68, dribbling: 70, physical: 82, defense: 30, speed: 74 }, bio: 'Delantero goleador del Botafogo. Constancia y efectividad.' },
    ];
  }

  // Fallback default players for other leagues (EU, FR, PT)
  return [
    { name: 'ERLING HAALAND', team: 'Man City', stats: { shooting: 95, passing: 65, dribbling: 75, physical: 93, defense: 30, speed: 89 }, bio: 'Máquina goleadora de potencia devastadora. Probabilidad de gol: 90%.' },
    { name: 'KYLIAN MBAPPÉ', team: 'PSG', stats: { shooting: 92, passing: 80, dribbling: 93, physical: 82, defense: 36, speed: 97 }, bio: 'Aceleración explosiva en transiciones rápidas. Efectividad del 93% en duelos.' },
    { name: 'ROBERT LEWANDOWSKI', team: 'Barcelona', stats: { shooting: 91, passing: 72, dribbling: 78, physical: 85, defense: 35, speed: 75 }, bio: 'Posicionamiento impecable. 2.2 disparos a puerta esperados por partido.' },
    { name: 'HARRY KANE', team: 'Bayern Munich', stats: { shooting: 92, passing: 84, dribbling: 80, physical: 83, defense: 40, speed: 73 }, bio: 'Goleador integral. Probabilidad de gol: 82%, probabilidad de asistencia: 45%.' },
    { name: 'VINICIUS JR.', team: 'Real Madrid', stats: { shooting: 87, passing: 82, dribbling: 95, physical: 78, defense: 32, speed: 95 }, bio: 'Regates exitosos esperados: 6.5. Probabilidad de gol: 68%.' },
    { name: 'CRISTIANO RONALDO', team: 'Al Nassr', stats: { shooting: 93, passing: 76, dribbling: 84, physical: 86, defense: 38, speed: 82 }, bio: 'Goleador histórico. Aún decisivo. Probabilidad de gol: 75%.' },
  ];
};
