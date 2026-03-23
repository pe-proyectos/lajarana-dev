import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useScrollReveal } from '../hooks/useScrollReveal';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getPriceRange(ticketTypes) {
  if (!ticketTypes || ticketTypes.length === 0) return null;
  const prices = ticketTypes.map(t => Number(t.price)).filter(p => p > 0);
  if (prices.length === 0) return 'Gratis';
  const min = Math.min(...prices);
  return `Desde S/ ${min.toFixed(2)}`;
}

function getBadges(evt) {
  const badges = [];
  const tt = evt.ticketTypes || [];

  // Gratis
  if (tt.length > 0 && tt.every(t => Number(t.price) === 0)) {
    badges.push({ label: 'Gratis', cls: 'event-badge--gratis' });
  }

  // Últimas entradas (>80% sold)
  if (tt.length > 0) {
    const totalQty = tt.reduce((s, t) => s + (t.quantity || 0), 0);
    const totalSold = tt.reduce((s, t) => s + (t.sold || 0), 0);
    if (totalQty > 0 && totalSold / totalQty > 0.8) {
      badges.push({ label: 'Últimas entradas', cls: 'event-badge--ultimas' });
    }
    // Popular (many sales)
    if (totalSold >= 50) {
      badges.push({ label: '🔥 Popular', cls: 'event-badge--popular' });
    }
  }

  // Nuevo (created in last 7 days)
  if (evt.createdAt) {
    const created = new Date(evt.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    if (created >= weekAgo) {
      badges.push({ label: 'Nuevo', cls: 'event-badge--nuevo' });
    }
  }

  return badges;
}

export default function FeaturedEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useScrollReveal('.reveal', 80);

  useEffect(() => {
    api.getPublicEvents()
      .then(data => {
        const list = Array.isArray(data) ? data : data.events || data.data || [];
        setEvents(list.slice(0, 6));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="featured-events-grid">
        {[1, 2, 3].map(i => (
          <div key={i} className="event-card-skeleton island">
            <div className="skeleton-cover" />
            <div className="skeleton-body">
              <div className="skeleton-line skeleton-line--short" />
              <div className="skeleton-line" />
              <div className="skeleton-line skeleton-line--short" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="featured-empty">
        <div className="featured-empty-icon">🎭</div>
        <h3>Próximamente</h3>
        <p>Estamos preparando los mejores eventos para ti. ¡Vuelve pronto!</p>
        <a href="/register" className="btn-secondary" style={{ marginTop: 16 }}>
          ¿Organizas eventos? Regístrate →
        </a>
      </div>
    );
  }

  return (
    <div className="featured-events-grid" ref={containerRef}>
      {events.map((evt, i) => {
        const badges = getBadges(evt);
        return (
          <a key={evt.id} href={`/events/${evt.slug}`} className="event-card island reveal">
            <div className="event-card-cover">
              {evt.coverImage ? (
                <img src={evt.coverImage} alt={evt.title} loading="lazy" />
              ) : (
                <div className="event-card-placeholder">🎉</div>
              )}
              {badges.length > 0 && (
                <div className="event-card-badges">
                  {badges.map((b, j) => (
                    <span key={j} className={`event-badge ${b.cls}`}>{b.label}</span>
                  ))}
                </div>
              )}
              {evt.startDate && (
                <div className="event-card-date">
                  <span className="event-card-date-day">{new Date(evt.startDate).getDate()}</span>
                  <span className="event-card-date-month">{new Date(evt.startDate).toLocaleDateString('es-PE', { month: 'short' }).toUpperCase()}</span>
                </div>
              )}
              {evt.category && (
                <div className="event-card-category">{evt.category}</div>
              )}
            </div>
            <div className="event-card-body">
              <h3 className="event-card-title">{evt.title}</h3>
              <div className="event-card-meta">
                {evt.venue && <span>📍 {evt.venue}</span>}
                {evt.city && <span> · {evt.city}</span>}
              </div>
              <div className="event-card-price">
                {getPriceRange(evt.ticketTypes) || 'Gratis'}
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
