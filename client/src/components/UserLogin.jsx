import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityKey, setSecurityKey] = useState('');
  const [err, setErr] = useState('');
  const [mode, setMode] = useState('login'); // 'login' or 'create'
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setIsLoading(true);

    try {
      if (mode === 'create') {
        const res = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, securityKey }),
        });
        if (!res.ok) throw new Error('Admin creation failed');
        alert('Admin created successfully. You can now log in.');
        setMode('login');
        setIsLoading(false);
        return;
      }

      // LOGIN
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Login failed');

      const loginData = await res.json();

// Save the token in localStorage (or sessionStorage)
localStorage.setItem('adminToken', loginData.token);

navigate('/');
      
    } catch (e) {
      setErr(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Admin Portal</h1>
          <p style={styles.subtitle}>
            {mode === 'login' ? 'Sign in to access personalised feed' : 'Create a new  account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            <label style={{...styles.label, top: email ? '-10px' : '16px', fontSize: email ? '12px' : '16px'}}>User Email</label>
          </div>

          <div style={styles.inputGroup}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
            <label style={{...styles.label, top: password ? '-10px' : '16px', fontSize: password ? '12px' : '16px'}}>Password</label>
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeToggle}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          {mode === 'create' && (
            <div style={styles.inputGroup}>
              <input
                type="text"
                value={securityKey}
                onChange={(e) => setSecurityKey(e.target.value)}
                required
                style={styles.input}
              />
            </div>
          )}

          <button
            type="submit"
            style={{...styles.submitBtn, ...(isLoading ? styles.submitBtnLoading : {})}}
            disabled={isLoading}
          >
            {isLoading ? <div style={styles.spinner}></div> : (mode === 'login' ? 'Login' : 'Create Account')}
          </button>
        </form>

        {err && <div style={styles.errorMessage}>{err}</div>}

        <div style={styles.modeToggle}>
          <p style={styles.toggleText}>
            {mode === 'login' ? "Don't have an  account?" : 'Already have an account?'}
            <button
              onClick={() => setMode(mode === 'login' ? 'create' : 'login')}
              style={styles.toggleBtn}
            >
              {mode === 'login' ? 'Create user' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
const styles = { container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100vw', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', padding: '20px', }, card: { background: 'white', borderRadius: '12px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px', padding: '40px 30px', position: 'relative', }, header: { textAlign: 'center', marginBottom: '30px' }, title: { color: '#333', fontSize: '28px', marginBottom: '10px', fontWeight: 600 }, subtitle: { color: '#666', fontSize: '16px', margin: 0 }, form: { display: 'flex', flexDirection: 'column', gap: '20px' }, inputGroup: { position: 'relative', marginBottom: '10px' }, input: { width: '100%', padding: '16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px', color: '#333', boxSizing: 'border-box', backgroundColor: '#f9f9f9', outline: 'none', }, label: { position: 'absolute', left: '16px', color: '#999', transition: 'all 0.2s ease', pointerEvents: 'none', backgroundColor: 'white', padding: '0 4px', }, eyeToggle: { position: 'absolute', right: '16px', top: '16px', cursor: 'pointer', userSelect: 'none', fontSize: '18px', }, submitBtn: { background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', padding: '16px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50px', transition: 'all 0.3s ease', }, submitBtnLoading: { background: 'linear-gradient(135deg,#8898ee 0%,#8a69b0 100%)', cursor: 'not-allowed' }, spinner: { width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '50%', borderTopColor: 'white', animation: 'spin 1s ease-in-out infinite', }, errorMessage: { backgroundColor: '#ffebee', color: '#d32f2f', padding: '12px', borderRadius: '8px', marginTop: '20px', textAlign: 'center', fontSize: '14px', borderLeft: '4px solid #d32f2f', }, modeToggle: { textAlign: 'center', marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #eee' }, toggleText: { color: '#666', margin: 0, fontSize: '14px' }, toggleBtn: { background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', fontWeight: 600, marginLeft: '5px', textDecoration: 'underline' }, }; // Add spinner animation const styleSheet = document.createElement('style'); styleSheet.innerText = @keyframes spin { to { transform: rotate(360deg); } } ; document.head.appendChild(styleSheet);

// Keep your styles and spinner animation as-is
