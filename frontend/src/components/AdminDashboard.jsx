import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Lock, Settings, BarChart2, Save, LogOut } from 'lucide-react';

const AdminDashboard = ({ onLogout }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('settings');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [settings, setSettings] = useState({
    vip_payment_link_mensual: '',
    vip_payment_link_trimestral: '',
    vip_payment_link_semestral: '',
    vip_payment_link_anual: '',
    vip_benefits: '',
    news_api_key: '',
    newsdata_api_key: '',
    football_api_key: '',
    betting_api_key: ''
  });
  
  const [analytics, setAnalytics] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://187.127.251.141:8000';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/admin/analytics?password=${password}`);
      setAnalytics(res.data);
      const subsRes = await axios.get(`${apiUrl}/admin/subscribers?password=${password}`);
      setSubscribers(subsRes.data);
      setIsAuthenticated(true);
      fetchSettings();
    } catch (err) {
      setMessage('Contraseña incorrecta');
    }
    setLoading(false);
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${apiUrl}/admin/settings`);
      setSettings({
        vip_payment_link_mensual: res.data.vip_payment_link_mensual || '',
        vip_payment_link_trimestral: res.data.vip_payment_link_trimestral || '',
        vip_payment_link_semestral: res.data.vip_payment_link_semestral || '',
        vip_payment_link_anual: res.data.vip_payment_link_anual || '',
        vip_benefits: res.data.vip_benefits || '',
        news_api_key: res.data.news_api_key || '',
        newsdata_api_key: res.data.newsdata_api_key || '',
        football_api_key: res.data.football_api_key || '',
        betting_api_key: res.data.betting_api_key || ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const updates = [
        { key: 'vip_payment_link_mensual', value: settings.vip_payment_link_mensual },
        { key: 'vip_payment_link_trimestral', value: settings.vip_payment_link_trimestral },
        { key: 'vip_payment_link_semestral', value: settings.vip_payment_link_semestral },
        { key: 'vip_payment_link_anual', value: settings.vip_payment_link_anual },
        { key: 'vip_benefits', value: settings.vip_benefits },
        { key: 'news_api_key', value: settings.news_api_key },
        { key: 'newsdata_api_key', value: settings.newsdata_api_key },
        { key: 'football_api_key', value: settings.football_api_key },
        { key: 'betting_api_key', value: settings.betting_api_key }
      ];
      await axios.post(`${apiUrl}/admin/settings?password=${password}`, updates);
      setMessage('Configuración guardada correctamente');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error al guardar');
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          style={{ background: 'var(--panel-bg)', padding: '30px', borderRadius: '12px', border: '1px solid var(--accent-color)', width: '90%', maxWidth: '400px', textAlign: 'center' }}
        >
          <Lock size={40} color="var(--accent-color)" style={{ marginBottom: '15px' }} />
          <h2 className="heading-font" style={{ color: '#fff', marginBottom: '20px' }}>Acceso Admin</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', color: '#fff', outline: 'none' }}
            />
            <button type="submit" disabled={loading} className="pes-button" style={{ padding: '12px', fontSize: '1rem' }}>
              {loading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>
          {message && <p style={{ color: '#ff4444', marginTop: '15px', fontSize: '0.9rem' }}>{message}</p>}
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="heading-font" style={{ color: 'var(--accent-color)', margin: 0 }}>Panel de Administración</h2>
        <button onClick={onLogout} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <LogOut size={16} /> Salir
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('settings')}
          style={{ flex: 1, padding: '10px', background: activeTab === 'settings' ? 'var(--accent-color)' : 'rgba(0,0,0,0.5)', color: activeTab === 'settings' ? '#000' : '#fff', border: '1px solid var(--accent-color)', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
        >
          <Settings size={18} /> Configuración
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          style={{ flex: 1, padding: '10px', background: activeTab === 'analytics' ? 'var(--accent-color)' : 'rgba(0,0,0,0.5)', color: activeTab === 'analytics' ? '#000' : '#fff', border: '1px solid var(--accent-color)', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
        >
          <BarChart2 size={18} /> Métricas
        </button>
        <button 
          onClick={() => setActiveTab('subscribers')}
          style={{ flex: 1, padding: '10px', background: activeTab === 'subscribers' ? 'var(--accent-color)' : 'rgba(0,0,0,0.5)', color: activeTab === 'subscribers' ? '#000' : '#fff', border: '1px solid var(--accent-color)', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
        >
          Suscriptores
        </button>
        <button 
          onClick={() => setActiveTab('integrations')}
          style={{ flex: 1, padding: '10px', background: activeTab === 'integrations' ? 'var(--accent-color)' : 'rgba(0,0,0,0.5)', color: activeTab === 'integrations' ? '#000' : '#fff', border: '1px solid var(--accent-color)', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
        >
          Integraciones
        </button>
      </div>

      {message && (
        <div style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid var(--accent-color)', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', color: 'var(--accent-color)' }}>
          {message}
        </div>
      )}

      {activeTab === 'settings' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'var(--panel-bg)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>Link de Pago VIP - MENSUAL</label>
            <input 
              type="text" 
              value={settings.vip_payment_link_mensual}
              onChange={(e) => setSettings({...settings, vip_payment_link_mensual: e.target.value})}
              placeholder="https://link.mercadopago.com.ar/..."
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>Link de Pago VIP - TRIMESTRAL</label>
            <input 
              type="text" 
              value={settings.vip_payment_link_trimestral}
              onChange={(e) => setSettings({...settings, vip_payment_link_trimestral: e.target.value})}
              placeholder="https://link.mercadopago.com.ar/..."
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>Link de Pago VIP - SEMESTRAL</label>
            <input 
              type="text" 
              value={settings.vip_payment_link_semestral}
              onChange={(e) => setSettings({...settings, vip_payment_link_semestral: e.target.value})}
              placeholder="https://link.mercadopago.com.ar/..."
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>Link de Pago VIP - ANUAL</label>
            <input 
              type="text" 
              value={settings.vip_payment_link_anual}
              onChange={(e) => setSettings({...settings, vip_payment_link_anual: e.target.value})}
              placeholder="https://link.mercadopago.com.ar/..."
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>Beneficios del Plan VIP (Separados por comas)</label>
            <textarea 
              value={settings.vip_benefits}
              onChange={(e) => setSettings({...settings, vip_benefits: e.target.value})}
              rows={4}
              placeholder="Predicciones VIP, Top 3 MVP, Soporte Prioritario"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
          </div>
          <button onClick={saveSettings} disabled={loading} className="pes-button" style={{ width: '100%', padding: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <Save size={18} /> {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </motion.div>
      )}

      {activeTab === 'analytics' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {analytics.map((record) => (
            <div key={record.id} style={{ background: 'var(--panel-bg)', padding: '15px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '1.1rem' }}>{record.date}</span>
              </div>
              <div style={{ display: 'flex', gap: '20px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{record.visits}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Visitas</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffb700' }}>{record.premium_clicks}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Clicks Premium</div>
                </div>
              </div>
            </div>
          ))}
          {analytics.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-dim)' }}>No hay datos registrados aún.</p>
          )}
        </motion.div>
      )}

      {activeTab === 'subscribers' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'var(--panel-bg)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--accent-color)' }}>Usuarios con Intención de Compra</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '20px' }}>Estos usuarios llenaron su correo y fueron redirigidos a Mercado Pago. Cruza esta lista con tus recibos de pago.</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '10px' }}>ID</th>
                  <th style={{ padding: '10px' }}>Fecha</th>
                  <th style={{ padding: '10px' }}>Correo Electrónico</th>
                  <th style={{ padding: '10px' }}>Plan</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map(sub => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px', color: 'var(--text-dim)' }}>#{sub.id}</td>
                    <td style={{ padding: '10px' }}>{sub.date}</td>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{sub.email}</td>
                    <td style={{ padding: '10px', color: 'var(--accent-color)' }}>{sub.plan_id.toUpperCase()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {subscribers.length === 0 && <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-dim)' }}>No hay registros.</p>}
          </div>
        </motion.div>
      )}

      {activeTab === 'integrations' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'var(--panel-bg)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--accent-color)', marginBottom: '20px' }}>APIs y Proveedores Externos</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>News API Key (newsapi.org)</label>
            <input type="text" value={settings.news_api_key} onChange={(e) => setSettings({...settings, news_api_key: e.target.value})} placeholder="Key de NewsAPI..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>NewsData API Key (newsdata.io)</label>
            <input type="text" value={settings.newsdata_api_key} onChange={(e) => setSettings({...settings, newsdata_api_key: e.target.value})} placeholder="Key de NewsData..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>Football Data API Key (football-data.org)</label>
            <input type="text" value={settings.football_api_key} onChange={(e) => setSettings({...settings, football_api_key: e.target.value})} placeholder="Para usar si activas football-data.org..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>Betting Odds API Key (odds-api.com)</label>
            <input type="text" value={settings.betting_api_key} onChange={(e) => setSettings({...settings, betting_api_key: e.target.value})} placeholder="Para integraciones futuras de cuotas..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', boxSizing: 'border-box' }} />
          </div>

          <button onClick={saveSettings} disabled={loading} className="pes-button" style={{ width: '100%', padding: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <Save size={18} /> {loading ? 'Guardando...' : 'Guardar Integraciones'}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;
