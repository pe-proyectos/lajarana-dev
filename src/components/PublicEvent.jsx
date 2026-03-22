import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function PublicEvent({ slug }) {
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBuy, setShowBuy] = useState(false);

  useEffect(() => {
    api.getPublicEvent(slug)
      .then(data => {
        const evt = data.event || data;
        setEvent(evt);
        setTickets(evt.ticketTypes || []);
        setLoading(false);
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) return <div className="loading">Cargando evento...</div>;
  if (error) return <div className="dash-content"><div className="error-msg">{error}</div><a href="/" className="back-link">← Volver al inicio</a></div>;

  return (
    <div className="dash-content" style={{ maxWidth: 900 }}>
      <a href="/" className="back-link">← Volver al inicio</a>

      {event.coverImage && <img src={event.coverImage} alt={event.title} className="event-cover" />}

      <h1 className="dash-title gradient-text" style={{ fontSize: '2.2rem' }}>{event.title}</h1>

      <div className="event-details-grid">
        <div>
          {event.description && <p style={{ color: 'var(--white-80)', marginBottom: 24, lineHeight: 1.7 }}>{event.description}</p>}

          <div className="event-info-item">
            <div className="label">📍 Lugar</div>
            <div>{event.venue}{event.address ? `, ${event.address}` : ''}{event.city ? ` — ${event.city}` : ''}</div>
          </div>

          {event.startDate && (
            <div className="event-info-item">
              <div className="label">📅 Fecha</div>
              <div>{new Date(event.startDate).toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              {event.endDate && <div style={{ color: 'var(--white-60)', fontSize: '0.9rem' }}>Hasta: {new Date(event.endDate).toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>}
            </div>
          )}

          {event.maxCapacity && (
            <div className="event-info-item">
              <div className="label">👥 Capacidad</div>
              <div>{event.maxCapacity} personas</div>
            </div>
          )}
        </div>

        <div className="tickets-sidebar">
          <h3 style={{ marginBottom: 16 }}>🎟️ Entradas</h3>
          {tickets.length === 0 ? (
            <p style={{ color: 'var(--white-60)' }}>Entradas próximamente</p>
          ) : (
            <>
              {tickets.map((t, i) => (
                <div key={i} className="ticket-option">
                  <div>
                    <div className="ticket-option-name">{t.name}</div>
                    {t.description && <div style={{ color: 'var(--white-60)', fontSize: '0.8rem' }}>{t.description}</div>}
                  </div>
                  <div className="ticket-option-price">S/ {Number(t.price).toFixed(2)}</div>
                </div>
              ))}
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }} onClick={() => setShowBuy(!showBuy)}>
                {showBuy ? 'Cerrar' : '🎉 Comprar Entradas'}
              </button>
              {showBuy && (
                <div style={{ marginTop: 16, padding: 16, background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--white-06)', textAlign: 'center', color: 'var(--white-60)' }}>
                  <p>🚧 Compra de entradas próximamente</p>
                  <p style={{ fontSize: '0.85rem', marginTop: 8 }}>Estamos trabajando en la pasarela de pago.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
