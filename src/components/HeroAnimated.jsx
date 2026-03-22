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
        🎫 Encuentra eventos increíbles
      </motion.div>

      <motion.h1 variants={fadeUp}>
        <span className="gradient-text">Encuentra eventos</span>
        <br />
        increíbles cerca de ti.
      </motion.h1>

      <motion.p className="hero-sub" variants={fadeUp}>
        Compra entradas para los mejores conciertos, fiestas, festivales y más.
        Recibe tu QR al instante y entra sin colas.
      </motion.p>

      <motion.div className="hero-actions" variants={fadeUp}>
        <a href="/eventos" className="btn-primary">
          Explorar eventos →
        </a>
        <a href="/register" className="btn-secondary">
          Crear mi cuenta
        </a>
      </motion.div>

      {/* Animated gradient blobs */}
      <div className="hero-blob hero-blob--1" />
      <div className="hero-blob hero-blob--2" />
      <div className="hero-blob hero-blob--3" />
    </motion.div>
  );
}
