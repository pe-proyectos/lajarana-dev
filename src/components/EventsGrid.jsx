import { useState, useEffect } from 'react';
import { api } from '../lib/api';

const CATEGORIES = ["Concierto", "Festival", "Fiesta", "Teatro", "Deportes", "Conferencia", "Otro"];
const PAGE_SIZE = 12;

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getPriceRange(ticketTypes) {
  if (!ticketTypes || ticketTypes.length === 0) return null;
  const prices = ticketTypes.map(t => Number(t.price)).filter(p => p > 0);
  if (prices.length === 0) return 'Gratis';
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return `S/ ${min.toFixed(2)}`;
  return `Desde S/ ${min.toFixed(2)}`;
}

export default function EventsGrid() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState(() => {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  });

  function loadEvents(p, cat) {
    setLoading(true);
    const params = { page: p, limit: PAGE_SIZE };
    if (cat) params.category = cat;
    api.getPublicEvents(params)
      .then(data => {
        const list = data.events || (Array.isArray(data) ? data : data.data || []);
        setEvents(list);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || list.length);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => { loadEvents(page, category); }, [page, category]);

  function changeCategory(cat) {
    setCategory(cat === category ? '' : cat);
    setPage(1);
  }

  const filtered = events.filter(e => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (e.title || '').toLowerCase().includes(q) ||
           (e.venue || '').toLowerCase().includes(q) ||
           (e.city || '').toLowerCase().includes(q);
  });

  if (loading && events.length === 0) {
    return (
      <div className="events-page-grid">
        {[1, 2, 3, 4, 5, 6].map(i => (
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

  return (
    <div>
      {/* Category filters */}
      <div className="category-pills">
        <button className={`category-pill${category === '' ? ' category-pill--active' : ''}`} onClick={() => changeCategory('')}>
          Todos
        </button>
        {CATEGORIES.map(c => (
          <button key={c} className={`category-pill${category === c ? ' category-pill--active' : ''}`} onClick={() => changeCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      <div className="events-search-bar">
        <input
          type="text"
          className="form-input events-search-input"
          placeholder="🔍 Buscar por nombre, lugar o ciudad..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="featured-empty">
          <div className="featured-empty-icon">🔍</div>
          <h3>{events.length === 0 ? 'No hay eventos disponibles' : 'Sin resultados'}</h3>
          <p>{events.length === 0 ? 'Pronto publicaremos eventos increíbles. ¡Vuelve pronto!' : 'Intenta con otra búsqueda.'}</p>
        </div>
      ) : (
        <>
          <div className="events-page-grid">
            {filtered.map(evt => (
              <a key={evt.id} href={`/events/${evt.slug}`} className="event-card island">
                <div className="event-card-cover">
                  {evt.coverImage ? (
                    <img src={evt.coverImage} alt={evt.title} loading="lazy" />
                  ) : (
                    <div className="event-card-placeholder">🎉</div>
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
                    {evt.startDate && <span>📅 {formatDate(evt.startDate)}</span>}
                  </div>
                  <div className="event-card-meta">
                    {evt.venue && <span>📍 {evt.venue}</span>}
                    {evt.city && <span> · {evt.city}</span>}
                  </div>
                  <div className="event-card-price">
                    {getPriceRange(evt.ticketTypes) || 'Gratis'}
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button className="pagination-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Anterior</button>
              <div className="pagination-pages">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                  .map((p, i, arr) => (
                    <span key={p}>
                      {i > 0 && arr[i - 1] !== p - 1 && <span className="pagination-dots">...</span>}
                      <button className={`pagination-num${p === page ? ' pagination-num--active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                    </span>
                  ))}
              </div>
              <button className="pagination-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Siguiente →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
