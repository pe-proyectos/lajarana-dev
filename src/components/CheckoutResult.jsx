import { useState, useEffect } from 'react';
import { api, getToken } from '../lib/api';

const STATUS_CONFIG = {
  success: {
    icon: '🎉',
    title: '¡Compra exitosa!',
    subtitle: 'Tus entradas están listas',
    color: 'var(--lime)',
  },
  failure: {
    icon: '😞',
    title: 'Pago fallido',
    subtitle: 'No pudimos procesar tu pago',
    color: 'var(--coral)',
  },
  pending: {
    icon: '⏳',
    title: 'Pago pendiente',
    subtitle: 'Estamos procesando tu pago',
    color: 'var(--violet)',
  },
};

export default function CheckoutResult({ status }) {
  const [order, setOrder] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order');
    if (!orderId || !getToken()) { setLoading(false); return; }

    api.getPaymentStatus(orderId)
      .then(data => {
        setOrder(data.order);
        setTickets(data.tickets || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const config = STATUS_CONFIG[status] || STATUS_CONFIG.failure;

  return (
    <div style={{ paddingTop: 120, minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: 500, width: '100%', textAlign: 'center', padding: '0 20px' }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>{config.icon}</div>
        <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: 8 }}>{config.title}</h1>
        <p style={{ color: 'var(--white-60)', marginBottom: 32 }}>{config.subtitle}</p>

        {loading && <p>Cargando detalles...</p>}

        {order && (
          <div className="form-card" style={{ textAlign: 'left', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'var(--white-60)' }}>Evento</span>
              <span>{order.event?.title}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'var(--white-60)' }}>Total</span>
              <span style={{ fontWeight: 700, color: config.color }}>S/ {Number(order.total).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--white-60)' }}>Estado</span>
              <span>{order.status === 'PAID' ? '✅ Pagado' : order.status === 'PENDING' ? '⏳ Pendiente' : '❌ Fallido'}</span>
            </div>
          </div>
        )}

        {status === 'success' && tickets.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ color: 'var(--lime)', fontWeight: 600, marginBottom: 12 }}>
              🎟️ {tickets.length} entrada{tickets.length > 1 ? 's' : ''} generada{tickets.length > 1 ? 's' : ''}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {status === 'success' && (
            <a href="/mi-cuenta/tickets" className="btn-primary" style={{ justifyContent: 'center', textDecoration: 'none' }}>
              Ver mis entradas →
            </a>
          )}
          {status === 'failure' && (
            <button className="btn-primary" onClick={() => window.history.back()} style={{ justifyContent: 'center' }}>
              Intentar de nuevo
            </button>
          )}
          {status === 'pending' && (
            <button className="btn-primary" onClick={() => window.location.reload()} style={{ justifyContent: 'center' }}>
              Verificar estado
            </button>
          )}
          <a href="/eventos" className="btn-secondary" style={{ justifyContent: 'center', textDecoration: 'none' }}>
            Ver más eventos
          </a>
        </div>
      </div>
    </div>
  );
}
