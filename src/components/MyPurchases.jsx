import { useState, useEffect } from 'react';
import { getToken, clearToken } from '../lib/api';

const API = 'https://lajarana-api.luminari.agency/api';

export default function MyPurchases() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) { window.location.href = '/login'; return; }
    const token = getToken();
    fetch(`${API}/orders/my`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
      .then(r => {
        if (r.status === 401) { clearToken(); window.location.href = '/login'; throw new Error('Unauthorized'); }
        return r.json();
      })
      .then(data => {
        setOrders(Array.isArray(data) ? data : data.orders || data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function logout() { clearToken(); window.location.href = '/'; }

  if (loading) return <div className="dash-layout"><div className="loading">Cargando...</div></div>;

  return (
    <div className="dash-layout">
      <header className="dash-header">
        <a href="/" className="logo"><img src="/logo.png" alt="LaJarana" style={{height:'32px',marginRight:'8px',verticalAlign:'middle'}} /> LaJarana</a>
        <div className="dash-header-right">
          <a href="/eventos" className="btn-ghost btn-sm" style={{ fontSize: '0.8rem' }}>Eventos</a>
          <button className="dash-logout" onClick={logout}>Salir</button>
        </div>
      </header>
      <div className="dash-content">
        <h1 className="dash-title gradient-text">Mis Compras</h1>
        <p className="dash-subtitle">Historial de compras y órdenes</p>

        <div className="account-nav">
          <a href="/mi-cuenta" className="account-nav-item">👤 Perfil</a>
          <a href="/mi-cuenta/tickets" className="account-nav-item">🎟️ Mis Entradas</a>
          <a href="/mi-cuenta/compras" className="account-nav-item account-nav-item--active">📦 Mis Compras</a>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--white-60)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📦</div>
            <p style={{ fontSize: '1.1rem', marginBottom: 8 }}>No tienes compras aún</p>
            <p style={{ fontSize: '0.9rem', marginBottom: 24, opacity: 0.7 }}>Cuando compres entradas, tus órdenes aparecerán aquí</p>
            <a href="/eventos" className="btn-primary" style={{ display: 'inline-flex' }}>Explorar eventos →</a>
          </div>
        ) : (
          <div>
            {orders.map(order => (
              <div key={order.id} className="event-row" style={{ cursor: 'default' }}>
                <div className="event-row-info">
                  <h3>{order.event?.title || `Orden #${order.id}`}</h3>
                  <div className="event-row-meta">
                    <span className="event-meta-tag">📅 {new Date(order.createdAt).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="event-meta-tag">🎟️ {order.quantity || order.tickets?.length || 0} entrada{(order.quantity || order.tickets?.length || 0) > 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--lime)', fontWeight: 700, fontSize: '1.1rem' }}>
                    S/ {Number(order.total || 0).toFixed(2)}
                  </div>
                  <span className={`badge ${order.status === 'PAID' ? 'badge-published' : order.status === 'PENDING' ? 'badge-draft' : 'badge-cancelled'}`}>
                    {order.status === 'PAID' ? '✅ Pagado' : order.status === 'PENDING' ? '⏳ Pendiente' : order.status || 'Procesando'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
