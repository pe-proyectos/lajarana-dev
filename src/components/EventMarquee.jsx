import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function EventMarquee() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.getPublicEvents({ limit: 20 })
      .then(data => {
        const list = Array.isArray(data) ? data : data.events || data.data || [];
        setEvents(list.filter(e => e.startDate && new Date(e.startDate) >= new Date()));
      })
      .catch(() => {});
  }, []);

  if (events.length === 0) return null;

  const content = events.map(e => {
    const city = e.city || 'Perú';
    return `🎉 ${e.title} · 📍 ${city}`;
  }).join('  ·  ');

  return (
    <div className="marquee-wrapper">
      <div className="marquee-track">
        <span className="marquee-content">{content}  ·  </span>
        <span className="marquee-content">{content}  ·  </span>
      </div>
    </div>
  );
}
