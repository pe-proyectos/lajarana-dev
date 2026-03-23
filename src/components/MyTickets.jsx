import { useState, useEffect } from 'react';
import { getToken, clearToken } from '../lib/api';

const API = 'https://lajarana-api.luminari.agency/api';

function TicketQR({ ticket }) {
  const [qrUrl, setQrUrl] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  function fetchQR() {
    const token = getToken();
    fetch(`${API}/tickets/${ticket.id}/qr`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.blob())
      .then(blob => setQrUrl(URL.createObjectURL(blob)))
      .catch(() => setQrUrl(null));
  }

  useEffect(() => { fetchQR(); }, [ticket.id]);

  async function handleRefresh() {
    setRefreshing(true);
    const token = getToken();
    try {
      await fetch(`${API}/tickets/${ticket.id}/refresh-qr`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      fetchQR();
    } catch {}
    setRefreshing(false);
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {qrUrl ? (
        <img src={qrUrl} alt="QR Code" style={{ width: 120, height: 120, borderRadius: 12, background: 'white', padding: 8 }} />
      ) : (
        <div style={{ width: 120, height: 120, borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--white-06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
          🎟️
        </div>
      )}
      <div style={{ fontSize: '0.75rem', color: 'var(--white-60)', marginTop: 8 }}>
        {ticket.status === 'USED' ? '✅ Usado' : ticket.status === 'CANCELLED' ? '❌ Cancelado' : '🎫 Válido'}
      </div>
      {ticket.status === 'VALID' && (
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn-ghost btn-sm"
          style={{ marginTop: 8, fontSize: '0.75rem' }}
        >
          {refreshing ? '...' : '🔄 Actualizar QR'}
        </button>
      )}
    </div>
  );
}

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) { window.location.href = '/login'; return; }
    const token = getToken();
    fetch(`${API}/tickets/my`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
      .then(r => {
        if (r.status === 401) { clearToken(); window.location.href = '/login'; throw new Error('Unauthorized'); }
        return r.json();
      })
      .then(data => {
        setTickets(Array.isArray(data) ? data : data.tickets || data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function logout() { clearToken(); window.location.href = '/'; }

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
        <h1 className="dash-title gradient-text">Mis Entradas</h1>
        <p className="dash-subtitle">Tus entradas compradas con código QR</p>

        <div className="account-nav">
          <a href="/mi-cuenta" className="account-nav-item">👤 Perfil</a>
          <a href="/mi-cuenta/tickets" className="account-nav-item account-nav-item--active">🎟️ Mis Entradas</a>
          <a href="/mi-cuenta/compras" className="account-nav-item">📦 Mis Compras</a>
        </div>

        {tickets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--white-60)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎟️</div>
            <p style={{ fontSize: '1.1rem', marginBottom: 8 }}>No tienes entradas aún</p>
            <p style={{ fontSize: '0.9rem', marginBottom: 24, opacity: 0.7 }}>Explora eventos y compra tu primera entrada</p>
            <a href="/eventos" className="btn-primary" style={{ display: 'inline-flex' }}>Explorar eventos →</a>
          </div>
        ) : (
          <div className="tickets-list">
            {tickets.map(ticket => (
              <div key={ticket.id} className="ticket-card-full island" style={{ padding: 24, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ marginBottom: 8 }}>{ticket.event?.title || 'Evento'}</h3>
                    <div style={{ color: 'var(--white-60)', fontSize: '0.9rem', marginBottom: 4 }}>
                      🎫 {ticket.ticketType?.name || 'Entrada'}
                    </div>
                    {ticket.event?.startDate && (
                      <div style={{ color: 'var(--white-60)', fontSize: '0.85rem' }}>
                        📅 {new Date(ticket.event.startDate).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    )}
                    {ticket.event?.venue && (
                      <div style={{ color: 'var(--white-60)', fontSize: '0.85rem' }}>
                        📍 {ticket.event.venue}
                      </div>
                    )}
                  </div>
                  <TicketQR ticket={ticket} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
