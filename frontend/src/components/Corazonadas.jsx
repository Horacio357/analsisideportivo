import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Corazonadas = ({ league, matches, players, getTeamLogoPath }) => {
  const allowedLeagues = ['AR', 'US', 'MX', 'ES'];
  const isAllowed = allowedLeagues.includes(league);

  // States to keep track of user votes
  const [votes, setVotes] = useState({}); // { matchId: { winner: 'home'/'draw'/'away', mvp: playerId, scorer: playerId } }

  if (!isAllowed) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel" 
        style={{ textAlign: 'center', padding: '50px 20px', marginTop: '20px' }}
      >
        <h2 className="heading-font" style={{ color: 'var(--text-dim)', marginBottom: '15px' }}>
          Función no disponible
        </h2>
        <p style={{ color: 'var(--text-dim)', fontFamily: 'Outfit' }}>
          La sección de <strong>Corazonadas de la Comunidad</strong> está disponible actualmente solo para las ligas: 
          <br/>🇦🇷 Argentina, 🇺🇸 Estados Unidos, 🇲🇽 México y 🇪🇸 España.
        </p>
        <p style={{ color: 'var(--accent-color)', marginTop: '20px', fontFamily: 'Orbitron', fontSize: '0.8rem' }}>
          ¡Próximamente en más ligas!
        </p>
      </motion.div>
    );
  }

  const handleVote = (matchId, category, value) => {
    setVotes(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [category]: value
      }
    }));
  };

  // Mock initial community data generator based on match
  const getCommunityData = (matchId, type) => {
    // Generate some deterministic random-looking data based on matchId
    const seed = matchId * 13;
    if (type === 'winner') {
      const home = 30 + (seed % 40);
      const draw = 10 + (seed % 20);
      const away = 100 - home - draw;
      return { home, draw, away };
    }
    return null;
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ marginBottom: '25px', textAlign: 'center' }}>
        <h2 className="heading-font" style={{ color: 'var(--accent-color)', fontSize: '1.5rem', marginBottom: '8px' }}>
          Corazonadas de la Comunidad
        </h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontFamily: 'Outfit' }}>
          ¿Qué dice el público? Vota y descubre las tendencias de la comunidad para estos partidos.
        </p>
      </div>

      {matches.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>No hay partidos disponibles.</div>
      ) : (
        matches.map(match => {
          const userVote = votes[match.id] || {};
          const commData = getCommunityData(match.id, 'winner');

          // Adjust data if user voted
          let finalHome = commData.home;
          let finalDraw = commData.draw;
          let finalAway = commData.away;

          if (userVote.winner) {
            if (userVote.winner === 'home') finalHome += 5;
            if (userVote.winner === 'draw') finalDraw += 5;
            if (userVote.winner === 'away') finalAway += 5;
          }

          const total = finalHome + finalDraw + finalAway;
          const homePct = Math.round((finalHome / total) * 100);
          const drawPct = Math.round((finalDraw / total) * 100);
          const awayPct = Math.round((finalAway / total) * 100);

          const winnerChartData = {
            labels: [match.home, 'Empate', match.away],
            datasets: [
              {
                data: [homePct, drawPct, awayPct],
                backgroundColor: ['#00ff88', '#888888', '#ff4444'],
                borderColor: '#0d1117',
                borderWidth: 2,
              },
            ],
          };

          // Players for this match (approximate)
          const matchPlayers = players.filter(p => p.team.includes(match.home) || p.team.includes(match.away));
          const displayPlayers = matchPlayers.length >= 3 ? matchPlayers.slice(0, 5) : players.slice(0, 5); // fallback

          // Mock MVP Data
          const mvpVotes = displayPlayers.map((p, i) => {
            let base = 20 - i * 3;
            if (userVote.mvp === p.name) base += 15;
            return base;
          });

          const mvpChartData = {
            labels: displayPlayers.map(p => p.name.split(' ').pop()),
            datasets: [
              {
                label: 'Votos MVP %',
                data: mvpVotes,
                backgroundColor: 'rgba(0, 255, 136, 0.6)',
                borderColor: '#00ff88',
                borderWidth: 1,
              }
            ]
          };

          // Mock Scorer Data
          const scorerVotes = displayPlayers.map((p, i) => {
            let base = 15 + (i % 2) * 5;
            if (userVote.scorer === p.name) base += 20;
            return base;
          });

          const scorerChartData = {
            labels: displayPlayers.map(p => p.name.split(' ').pop()),
            datasets: [
              {
                label: 'Votos Goleador %',
                data: scorerVotes,
                backgroundColor: 'rgba(255, 68, 68, 0.6)',
                borderColor: '#ff4444',
                borderWidth: 1,
              }
            ]
          };

          const chartOptions = {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              x: { display: false },
              y: { ticks: { color: '#aaa', font: { size: 9, family: 'Orbitron' } }, grid: { display: false } }
            }
          };

          const doughnutOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { color: '#fff', font: { family: 'Outfit', size: 11 } } }
            },
            cutout: '70%'
          };

          return (
            <motion.div 
              key={match.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel"
              style={{ marginBottom: '30px', padding: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}
            >
              {/* Match Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                  {getTeamLogoPath && getTeamLogoPath(match.home) && <img src={getTeamLogoPath(match.home)} alt={match.home} style={{ width: '24px' }}/>}
                  <span className="heading-font" style={{ fontSize: '1.1rem' }}>{match.home}</span>
                </div>
                <div style={{ padding: '0 15px', color: 'var(--accent-secondary)', fontFamily: 'Orbitron', fontWeight: 'bold' }}>VS</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end' }}>
                  <span className="heading-font" style={{ fontSize: '1.1rem' }}>{match.away}</span>
                  {getTeamLogoPath && getTeamLogoPath(match.away) && <img src={getTeamLogoPath(match.away)} alt={match.away} style={{ width: '24px' }}/>}
                </div>
              </div>

              {/* Grid for Charts */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                
                {/* Ganador del Partido */}
                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '15px', textAlign: 'center' }}>
                  <h4 style={{ fontFamily: 'Orbitron', color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '15px' }}>¿QUIÉN GANARÁ?</h4>
                  <div style={{ height: '180px', marginBottom: '15px' }}>
                    <Doughnut data={winnerChartData} options={doughnutOptions} />
                  </div>
                  <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                    <button 
                      disabled={!!userVote.winner}
                      onClick={() => handleVote(match.id, 'winner', 'home')}
                      style={{ padding: '6px 10px', fontSize: '0.75rem', borderRadius: '6px', background: userVote.winner === 'home' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)', color: userVote.winner === 'home' ? '#000' : '#fff', border: '1px solid var(--accent-color)', cursor: userVote.winner ? 'not-allowed' : 'pointer', transition: 'all 0.2s', flex: 1, opacity: userVote.winner && userVote.winner !== 'home' ? 0.3 : 1 }}
                    >
                      Local
                    </button>
                    <button 
                      disabled={!!userVote.winner}
                      onClick={() => handleVote(match.id, 'winner', 'draw')}
                      style={{ padding: '6px 10px', fontSize: '0.75rem', borderRadius: '6px', background: userVote.winner === 'draw' ? '#888' : 'rgba(255,255,255,0.05)', color: userVote.winner === 'draw' ? '#000' : '#fff', border: '1px solid #888', cursor: userVote.winner ? 'not-allowed' : 'pointer', transition: 'all 0.2s', flex: 1, opacity: userVote.winner && userVote.winner !== 'draw' ? 0.3 : 1 }}
                    >
                      Empate
                    </button>
                    <button 
                      disabled={!!userVote.winner}
                      onClick={() => handleVote(match.id, 'winner', 'away')}
                      style={{ padding: '6px 10px', fontSize: '0.75rem', borderRadius: '6px', background: userVote.winner === 'away' ? '#ff4444' : 'rgba(255,255,255,0.05)', color: userVote.winner === 'away' ? '#000' : '#fff', border: '1px solid #ff4444', cursor: userVote.winner ? 'not-allowed' : 'pointer', transition: 'all 0.2s', flex: 1, opacity: userVote.winner && userVote.winner !== 'away' ? 0.3 : 1 }}
                    >
                      Visita
                    </button>
                  </div>
                </div>

                {/* Jugador del Partido */}
                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '15px', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontFamily: 'Orbitron', color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '15px' }}>JUGADOR DEL PARTIDO</h4>
                  <div style={{ height: '140px', marginBottom: '15px', flex: 1 }}>
                    <Bar data={mvpChartData} options={chartOptions} />
                  </div>
                  <select 
                    disabled={!!userVote.mvp}
                    value={userVote.mvp || ''} 
                    onChange={(e) => handleVote(match.id, 'mvp', e.target.value)}
                    style={{ width: '100%', padding: '8px', background: '#0d1117', color: '#fff', border: '1px solid var(--accent-color)', borderRadius: '6px', fontSize: '0.8rem', outline: 'none', cursor: userVote.mvp ? 'not-allowed' : 'pointer', opacity: userVote.mvp ? 0.7 : 1 }}
                  >
                    <option value="" disabled>Votar por el MVP...</option>
                    {displayPlayers.map(p => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Goleador */}
                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '15px', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontFamily: 'Orbitron', color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '15px' }}>GOLEADOR</h4>
                  <div style={{ height: '140px', marginBottom: '15px', flex: 1 }}>
                    <Bar data={scorerChartData} options={{...chartOptions, plugins: {...chartOptions.plugins, legend: {display: false}}}} />
                  </div>
                  <select 
                    disabled={!!userVote.scorer}
                    value={userVote.scorer || ''} 
                    onChange={(e) => handleVote(match.id, 'scorer', e.target.value)}
                    style={{ width: '100%', padding: '8px', background: '#0d1117', color: '#fff', border: '1px solid #ff4444', borderRadius: '6px', fontSize: '0.8rem', outline: 'none', cursor: userVote.scorer ? 'not-allowed' : 'pointer', opacity: userVote.scorer ? 0.7 : 1 }}
                  >
                    <option value="" disabled>Votar por el Goleador...</option>
                    {displayPlayers.map(p => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
};

export default Corazonadas;
