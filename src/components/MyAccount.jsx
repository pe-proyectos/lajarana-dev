import { useState, useEffect } from 'react';
import { api, getToken, clearToken } from '../lib/api';

export default function MyAccount() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!getToken()) { window.location.href = '/login'; return; }
    api.me()
      .then(data => {
        const u = data.user || data;
        setUser(u);
        setForm({ name: u.name || '', phone: u.phone || '' });
        setLoading(false);
      })
      .catch(() => { clearToken(); window.location.href = '/login'; });
  }, []);

  function logout() { clearToken(); window.location.href = '/'; }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const data = await api.updateProfile(form);
      setUser(data.user || data);
      setEditing(false);
      setMsg('Perfil actualizado');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="dash-layout"><div className="loading">Cargando...</div></div>;

  return (
    <div className="dash-layout">
      <header className="dash-header">
        <a href="/" className="logo"><img src="/logo.png" alt="LaJarana" style={{height:'48px',marginRight:'8px',verticalAlign:'middle'}} /> LaJarana</a>
        <div className="dash-header-right">
          <a href="/eventos" className="btn-ghost btn-sm" style={{ fontSize: '0.8rem' }}>Eventos</a>
          <span className="dash-user-name">{user?.name || user?.email}</span>
          <button className="dash-logout" onClick={logout}>Salir</button>
        </div>
      </header>
      <div className="dash-content">
        <h1 className="dash-title gradient-text">Mi Cuenta</h1>
        <p className="dash-subtitle">Gestiona tu perfil, entradas y compras</p>

        {msg && <div className={msg.includes('actualizado') ? 'success-msg' : 'error-msg'}>{msg}</div>}

        <div className="account-nav">
          <a href="/mi-cuenta" className="account-nav-item account-nav-item--active">👤 Perfil</a>
          <a href="/mi-cuenta/tickets" className="account-nav-item">🎟️ Mis Entradas</a>
          <a href="/mi-cuenta/compras" className="account-nav-item">📦 Mis Compras</a>
        </div>

        <div className="form-card">
          <h2 style={{ marginBottom: 24 }}>Información personal</h2>
          {!editing ? (
            <div>
              <div className="review-grid" style={{ marginBottom: 24 }}>
                <div className="review-item">
                  <span className="review-label">Nombre</span>
                  <span className="review-value">{user?.name || '—'}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Email</span>
                  <span className="review-value">{user?.email}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Teléfono</span>
                  <span className="review-value">{user?.phone || '—'}</span>
                </div>
              </div>
              <button className="btn-secondary btn-sm" onClick={() => setEditing(true)}>Editar perfil</button>
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" className="form-input" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input type="tel" className="form-input" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary btn-sm" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
                <button type="button" className="btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancelar</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
