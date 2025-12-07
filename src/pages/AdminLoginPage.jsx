import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminAPI } from '../api';
import { useAuth } from '../App';

export default function AdminLoginPage() {
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
      const { user } = await AdminAPI.login({ email, password });
      login(user);
      nav('/admin/trips');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth:420, margin:'40px auto'}}>
      <h2>Admin Login</h2>
      {error && <div style={{color:'crimson', margin:'8px 0'}}>{error}</div>}
      <form onSubmit={onSubmit}>
        <div style={{display:'flex', flexDirection:'column', gap:10}}>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Admin Email" type="email" required />
          <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" required />
          <button disabled={loading} type="submit">{loading ? 'Signing in...' : 'Login as Admin'}</button>
        </div>
      </form>
      <div className="muted" style={{marginTop:8}}>Use the admin credentials you provided.</div>
    </div>
  );
}
