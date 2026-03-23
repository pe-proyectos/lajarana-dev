import { useState, useEffect } from 'react';
import { getToken, clearToken } from '../lib/api';

export default function NavBar({ current = 'home' }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getToken());
  }, []);

  function logout() {
    clearToken();
    window.location.href = '/';
  }

  return (
    <nav className="nav">
      <div className="container nav-inner">
        <a href="/" className="logo"><img src="/logo.png" alt="LaJarana" style={{height:'32px',marginRight:'8px',verticalAlign:'middle'}} /> LaJarana</a>
        
        <button className="nav-mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={`hamburger ${menuOpen ? 'hamburger--open' : ''}`}>
            <span /><span /><span />
          </span>
        </button>

        <div className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`}>
          <a href="/" className={current === 'home' ? 'nav-active' : ''}>Inicio</a>
          <a href="/eventos" className={current === 'eventos' ? 'nav-active' : ''}>Eventos</a>
          {loggedIn ? (
            <>
              <a href="/mi-cuenta" className={current === 'mi-cuenta' ? 'nav-active' : ''}>Mi Cuenta</a>
              <button className="btn-secondary" style={{ padding: '10px 24px', fontSize: '0.9rem' }} onClick={logout}>Salir</button>
            </>
          ) : (
            <>
              <a href="/login" className={current === 'login' ? 'nav-active' : ''}>Iniciar Sesión</a>
              <a href="/register" className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>Registrarse</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
