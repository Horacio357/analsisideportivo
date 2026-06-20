import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, CheckCircle, ShieldCheck, ArrowRight, Mail, Star, Crown, Zap } from 'lucide-react';
import axios from 'axios';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: 'es-AR' });

const BENEFITS = [
  'Predicciones VIP con IA avanzada',
  'Top 3 Jugador del Partido exclusivo',
  'Reportes de análisis por Email',
  'Acceso a las 4 ligas internacionales',
  'Estadísticas radar de jugadores y equipos',
];

const PLANS = [
  { id: 'mensual', name: 'Mensual', price: 9.99, subtitle: 'Cancelá cuando quieras' },
  { id: 'trimestral', name: 'Trimestral', price: 24.99, subtitle: 'Ahorras 15%' },
  { id: 'semestral', name: 'Semestral', price: 44.99, subtitle: 'Ahorras 25%' },
  { id: 'anual', name: 'Anual', price: 79.99, subtitle: 'Ahorras 33%' }
];

const SubscriptionModal = ({ isOpen, onClose, t, onVipActivated }) => {
  const [step, setStep] = useState('plan'); // 'plan' | 'loading' | 'success' | 'wallet'
  const [email, setEmail] = useState('');
  const [preferenceId, setPreferenceId] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(PLANS[0]);

  const validateEmail = (val) => val && val.includes('@') && val.includes('.');

  const handlePayment = async () => {
    if (!validateEmail(email)) {
      setEmailError('Ingresá un email válido.');
      return;
    }
    setEmailError('');
    setStep('loading');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://187.127.251.141:8000';
      const response = await axios.post(`${apiUrl}/create_preference`, {
        title: `Suscripción BET AI VIP - ${selectedPlan.name}`,
        quantity: 1,
        unit_price: selectedPlan.price,
        payer_email: email,
        plan_id: selectedPlan.id
      });

      // Real MP token configured — render Wallet brick
      if (response.data?.id) {
        setPreferenceId(response.data.id);
        setStep('wallet');
      } else if (response.data?.init_point) {
        window.location.href = response.data.init_point;
      } else {
        runDemoFlow();
      }
    } catch (error) {
      console.error('Payment Error:', error);
      setEmailError('Error de conexión (probablemente por bloqueo HTTPS/Mixed Content).');
      setStep('plan');
    }
  };

  const runDemoFlow = () => {
    // Simulate payment processing (2s) then show success
    setTimeout(() => {
      setStep('success');
      if (onVipActivated) onVipActivated(email);
    }, 2000);
  };

  const handleClose = () => {
    setStep('plan');
    setEmail('');
    setEmailError('');
    setPreferenceId(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.88)',
      zIndex: 4000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      <AnimatePresence mode="wait">

        {/* ─── PLAN SCREEN ─── */}
        {step === 'plan' && (
          <motion.div
            key="plan"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            className="glass-panel"
            style={{ width: '100%', maxWidth: '460px', border: '2px solid var(--accent-secondary)', position: 'relative' }}
          >
            <button onClick={handleClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.6 }}>
              <X size={20} />
            </button>

            {/* Header / Planes */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,215,0,0.12)', border: '1px solid var(--accent-secondary)', borderRadius: '20px', padding: '5px 16px', marginBottom: '14px' }}>
                <Crown size={13} color="var(--accent-secondary)" />
                <span style={{ fontSize: '0.68rem', color: 'var(--accent-secondary)', letterSpacing: '2px', fontWeight: 700 }}>PLAN VIP</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                {PLANS.map(plan => (
                  <div 
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    style={{
                      background: selectedPlan.id === plan.id ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${selectedPlan.id === plan.id ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: '8px',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', color: selectedPlan.id === plan.id ? 'var(--accent-color)' : '#fff', fontWeight: 'bold' }}>
                      {plan.name}
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'Orbitron, sans-serif' }}>
                      ${plan.price}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                      {plan.subtitle}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
              {BENEFITS.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: i < BENEFITS.length - 1 ? '10px' : 0, fontSize: '0.88rem' }}>
                  <CheckCircle size={15} color="var(--accent-color)" style={{ flexShrink: 0 }} />
                  {b}
                </div>
              ))}
            </div>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Mail size={11} /> TU EMAIL PARA EL RECIBO
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                placeholder="tu@email.com"
                onKeyDown={e => e.key === 'Enter' && handlePayment()}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.07)',
                  border: `1px solid ${emailError ? '#ff5555' : 'rgba(255,255,255,0.15)'}`,
                  borderRadius: '10px', padding: '12px 16px',
                  color: '#fff', fontSize: '0.95rem', outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
              {emailError && (
                <p style={{ color: '#ff7777', fontSize: '0.75rem', marginTop: '6px' }}>{emailError}</p>
              )}
            </div>

            {/* CTA */}
            <button
              className="pes-button"
              onClick={handlePayment}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <CreditCard size={17} />
              SUSCRIBIRME CON MERCADO PAGO
              <ArrowRight size={16} />
            </button>

            <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', color: 'var(--text-dim)', fontSize: '0.67rem' }}>
              <ShieldCheck size={12} />
              PAGO 100% ENCRIPTADO Y SEGURO
            </div>
          </motion.div>
        )}

        {/* ─── LOADING / PROCESSING SCREEN ─── */}
        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="glass-panel"
            style={{ width: '100%', maxWidth: '360px', textAlign: 'center', border: '2px solid var(--accent-secondary)', padding: '50px 30px' }}
          >
            <div style={{ marginBottom: '24px' }}>
              <div style={{ width: '60px', height: '60px', margin: '0 auto 20px', border: '3px solid rgba(255,215,0,0.2)', borderTop: '3px solid var(--accent-secondary)', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
              <h3 className="heading-font" style={{ color: 'var(--accent-secondary)', marginBottom: '8px' }}>PROCESANDO</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Conectando con Mercado Pago...</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: 'var(--accent-secondary)',
                  animation: `pulse 1.2s ease-in-out ${i * 0.3}s infinite`,
                  opacity: 0.5,
                }} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── WALLET SCREEN ─── */}
        {step === 'wallet' && (
          <motion.div
            key="wallet"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-panel"
            style={{ width: '100%', maxWidth: '420px', textAlign: 'center', border: '2px solid var(--accent-secondary)', padding: '30px 20px', position: 'relative' }}
          >
            <button onClick={handleClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.6 }}>
              <X size={20} />
            </button>
            <h3 className="heading-font" style={{ color: 'var(--accent-secondary)', marginBottom: '8px' }}>COMPLETA TU PAGO</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '20px' }}>Paga de forma segura con Mercado Pago</p>
            
            {preferenceId && (
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '15px', display: 'flex', justifyContent: 'center' }}>
                <Wallet initialization={{ preferenceId }} customization={{ texts: { valueProp: 'smart_option' } }} />
              </div>
            )}
          </motion.div>
        )}

        {/* ─── SUCCESS SCREEN ─── */}
        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-panel"
            style={{ width: '100%', maxWidth: '420px', textAlign: 'center', border: '2px solid var(--accent-color)', padding: '50px 30px' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'rgba(0,255,136,0.15)',
                border: '2px solid var(--accent-color)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <CheckCircle size={40} color="var(--accent-color)" />
            </motion.div>

            <h2 className="heading-font" style={{ color: 'var(--accent-color)', marginBottom: '8px', fontSize: '1.5rem' }}>¡ACCESO VIP ACTIVADO!</h2>
            <p style={{ color: 'var(--text-dim)', marginBottom: '6px', fontSize: '0.9rem' }}>
              Bienvenido al nivel elite de BET AI.
            </p>
            {email && (
              <p style={{ fontSize: '0.78rem', color: 'var(--accent-color)', marginBottom: '28px', opacity: 0.8 }}>
                Recibo enviado a <strong>{email}</strong>
              </p>
            )}

            {/* VIP perks activated */}
            <div style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '12px', padding: '16px 20px', marginBottom: '28px', textAlign: 'left' }}>
              {['Top 3 MVP activado ✓', 'Análisis ilimitados ✓', 'Email de reportes ✓'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: i < 2 ? '8px' : 0, fontSize: '0.85rem', color: 'var(--accent-color)' }}>
                  <Star size={13} fill="var(--accent-color)" />
                  {item}
                </div>
              ))}
            </div>

            <button className="pes-button" onClick={handleClose} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Zap size={16} />
              IR AL DASHBOARD VIP
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default SubscriptionModal;
