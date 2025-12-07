import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthAPI } from '../api';
import { useAuth } from '../App';
import hack from '../assets/hack.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { user } = await AuthAPI.login({ email, password });
      login(user);
      nav('/');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-illustration">
          <img src={hack} alt="Travel illustration" />
        </div>
        <div className="login-form">
          <h2>Welcome back</h2>
          {error && <div style={{color:'crimson', margin:'8px 0'}}>{error}</div>}
          <form onSubmit={onSubmit}>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" type="email" required />
            <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" required />
            <div className="options">
              <span className="muted">Use your TravelMate account</span>
              <Link to="/register">Register</Link>
            </div>
            <button className="btn primary" disabled={loading} type="submit">{loading ? 'Signing in...' : 'Login'}</button>
          </form>
          <div className="divider">or</div>
          <button className="btn" onClick={()=>nav('/register')}>Create a new account</button>
        </div>
      </div>
    </div>
  );
}
