import { useState } from 'react';
import { motion } from 'framer-motion';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const categories = [
  { label: 'Fiestas', emoji: '🎉' },
  { label: 'Conciertos', emoji: '🎵' },
  { label: 'Festivales', emoji: '🎪' },
  { label: 'Talleres', emoji: '🎨' },
  { label: 'Teatro', emoji: '🎭' },
  { label: 'Electrónica', emoji: '⚡' },
];

export default function HeroSearch() {
  const [query, setQuery] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/eventos?q=${encodeURIComponent(query.trim())}`;
    } else {
      window.location.href = '/eventos';
    }
  }

  return (
    <motion.div
      className="hero-search-content"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.h1 className="hero-search-title" variants={fadeUp}>
        Busca tu próximo <span className="gradient-text">evento</span>
      </motion.h1>

      <motion.form className="hero-search-form" variants={fadeUp} onSubmit={handleSubmit}>
        <div className="hero-search-bar">
          <span className="hero-search-icon">🔍</span>
          <input
            type="text"
            placeholder="¿Qué evento buscas?"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="hero-search-input"
            autoComplete="off"
          />
          <button type="submit" className="hero-search-btn">Buscar</button>
        </div>
      </motion.form>

      <motion.div className="hero-categories" variants={fadeUp}>
        {categories.map(cat => (
          <a
            key={cat.label}
            href={`/eventos?q=${encodeURIComponent(cat.label)}`}
            className="hero-category-pill"
          >
            {cat.emoji} {cat.label}
          </a>
        ))}
      </motion.div>

      {/* Subtle blobs */}
      <div className="hero-blob hero-blob--1" />
      <div className="hero-blob hero-blob--2" />
    </motion.div>
  );
}
