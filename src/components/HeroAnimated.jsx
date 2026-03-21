import { motion } from 'framer-motion';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function HeroAnimated() {
  return (
    <motion.div
      className="hero-content"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div className="hero-badge" variants={fadeUp}>
        Próximamente
      </motion.div>

      <motion.h1 variants={fadeUp}>
        <span className="gradient-text">Tus entradas,</span>
        <br />
        sin drama.
      </motion.h1>

      <motion.p className="hero-sub" variants={fadeUp}>
        La plataforma de tickets digitales para festivales, fiestas y eventos
        culturales. Vende, gestiona y controla todo desde un solo lugar.
      </motion.p>

      <motion.div className="hero-actions" variants={fadeUp}>
        <a href="#waitlist" className="btn-primary">
          Acceso anticipado →
        </a>
        <a href="#como-funciona" className="btn-secondary">
          Ver cómo funciona
        </a>
      </motion.div>

      {/* Animated gradient blobs */}
      <div className="hero-blob hero-blob--1" />
      <div className="hero-blob hero-blob--2" />
      <div className="hero-blob hero-blob--3" />
    </motion.div>
  );
}
