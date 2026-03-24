import { useState, useEffect } from 'react';
import { getToken, clearToken } from '../lib/api';

const API = 'https://lajarana-api.luminari.agency/api';

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const items = order.items || [];
  const totalQty = items.reduce((sum, i) => sum + (i.quantity || 0), 0);

  const statusMap = {
    PAID: { label: '✅ Pagado', cls: 'purchase-status--paid' },
    PENDING: { label: '⏳ Pendiente', cls: 'purchase-status--pending' },
    CANCELLED: { label: '❌ Cancelado', cls: 'purchase-status--cancelled' },
  };
  const st = statusMap[order.status] || { label: order.status || 'Procesando', cls: 'purchase-status--pending' };

  return (
    <div className={`purchase-card ${expanded ? 'purchase-card--expanded' : ''}`}>
      <div className="purchase-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="purchase-card-left">
          <div className="purchase-event-name">{order.event?.title || `Orden #${order.id.slice(-6)}`}</div>
          <div className="purchase-meta">
            <span>📅 {new Date(order.createdAt).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span>🎟️ {totalQty} entrada{totalQty !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div className="purchase-card-right">
          <div className="purchase-total">S/ {Number(order.total || 0).toFixed(2)}</div>
          <span className={`purchase-status ${st.cls}`}>{st.label}</span>
          <span className={`purchase-chevron ${expanded ? 'purchase-chevron--open' : ''}`}>▾</span>
        </div>
      </div>

      {expanded && (
        <div className="purchase-details">
          <div className="purchase-details-divider" />

          {/* Order info */}
          <div className="purchase-info-grid">
            <div className="purchase-info-item">
              <span className="purchase-info-label">ID de orden</span>
              <span className="purchase-info-value" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                {order.id.slice(-8).toUpperCase()}
              </span>
            </div>
            {order.event?.startDate && (
              <div className="purchase-info-item">
                <span className="purchase-info-label">Fecha del evento</span>
                <span className="purchase-info-value">
                  {new Date(order.event.startDate).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            )}
            {order.event?.venue && (
              <div className="purchase-info-item">
                <span className="purchase-info-label">Lugar</span>
                <span className="purchase-info-value">📍 {order.event.venue}</span>
              </div>
            )}
            {order.paymentMethod && (
              <div className="purchase-info-item">
                <span className="purchase-info-label">Método de pago</span>
                <span className="purchase-info-value">{order.paymentMethod}</span>
              </div>
            )}
          </div>

          {/* Items breakdown */}
          <div className="purchase-items-title">Detalle de entradas</div>
          <div className="purchase-items-list">
            {items.map((item, i) => (
              <div key={item.id || i} className="purchase-item-row">
                <div className="purchase-item-left">
                  <span className="purchase-item-type">🎫 {item.ticketType?.name || 'Entrada'}</span>
                  <span className="purchase-item-qty">×{item.quantity}</span>
                </div>
                <div className="purchase-item-right">
                  <span className="purchase-item-unit">S/ {Number(item.unitPrice || 0).toFixed(2)} c/u</span>
                  <span className="purchase-item-subtotal">S/ {Number(item.subtotal || 0).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="purchase-total-row">
            <span>Total</span>
            <span className="purchase-total-amount">S/ {Number(order.total || 0).toFixed(2)}</span>
          </div>

          {/* Actions */}
          <div className="purchase-actions">
            {order.status === 'PAID' && (
              <a href="/mi-cuenta/tickets" className="purchase-action-btn purchase-action-btn--primary">
                🎟️ Ver mis entradas
              </a>
            )}
            {order.event?.slug && (
              <a href={`/events/${order.event.slug}`} className="purchase-action-btn purchase-action-btn--ghost">
                🎭 Ver evento
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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

  const paidCount = orders.filter(o => o.status === 'PAID').length;
  const totalSpent = orders.filter(o => o.status === 'PAID').reduce((s, o) => s + Number(o.total || 0), 0);

  if (loading) return <div className="dash-layout"><div className="loading">Cargando...</div></div>;

  return (
    <div className="dash-layout">
      <header className="dash-header">
        <a href="/" className="logo"><img src="/logo.png" alt="LaJarana" style={{height:'48px',marginRight:'8px',verticalAlign:'middle'}} /> LaJarana</a>
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
          <div className="purchase-empty">
            <div className="purchase-empty-icon">📦</div>
            <p className="purchase-empty-title">No tienes compras aún</p>
            <p className="purchase-empty-sub">Cuando compres entradas, tus órdenes aparecerán aquí</p>
            <a href="/eventos" className="btn-primary" style={{ display: 'inline-flex', marginTop: 24 }}>Explorar eventos →</a>
          </div>
        ) : (
          <>
            {/* Summary stats */}
            <div className="purchase-stats">
              <div className="purchase-stat">
                <span className="purchase-stat-value">{orders.length}</span>
                <span className="purchase-stat-label">Órdenes</span>
              </div>
              <div className="purchase-stat">
                <span className="purchase-stat-value">{paidCount}</span>
                <span className="purchase-stat-label">Pagadas</span>
              </div>
              <div className="purchase-stat">
                <span className="purchase-stat-value">S/ {totalSpent.toFixed(2)}</span>
                <span className="purchase-stat-label">Total gastado</span>
              </div>
            </div>

            {/* Orders list */}
            <div className="purchase-list">
              {orders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
