import React, { useEffect, useState, createContext, useContext } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthAPI } from './api';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import TripsPage from './pages/TripsPage';
import TripDetailPage from './pages/TripDetailPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminTripsPage from './pages/AdminTripsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminBookingsPage from './pages/AdminBookingsPage';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggle = () => setMenuOpen((v) => !v);
  const [query, setQuery] = useState('');
  const nav = useNavigate();

  const onSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length === 0) {
      nav('/trips');
    } else {
      nav(`/trips?q=${encodeURIComponent(q)}`);
    }
  };
  return (
    <nav className="site-nav">
      <Link to="/" className="brand">TravelMate</Link>
      <form className="nav-search" onSubmit={onSearch}>
        <input
          className="nav-search-input"
          type="search"
          placeholder="Search trips..."
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
        />
      </form>
      <div className="spacer" />
      {user ? (
        <>
          <span style={{marginRight:8}}>Hi, {user.name}</span>
          {user.role !== 'ADMIN' && (
            <Link to="/bookings" className="btn2 ghost" style={{marginRight:8}}>My Bookings</Link>
          )}
          <button className="btn2 ghost" onClick={logout}>Logout</button>
        </>
      ) : (
        <div className="dropdown">
          <button className="btn2" onClick={toggle}>Login ▾</button>
          {menuOpen && (
            <div className="dropdown-menu" style={{minWidth:140}}>
              <Link to="/login" onClick={()=>setMenuOpen(false)}>User</Link>
              <Link to="/admin/login" onClick={()=>setMenuOpen(false)}>Admin</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

function Protected({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AuthAPI.me()
      .then((res) => setUser(res.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = (u) => setUser(u);
  const logout = async () => {
    try { await AuthAPI.logout(); } catch {}
    setUser(null);
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      <BrowserRouter>
        <Navbar />
        <div className="container" style={{padding:16}}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/trips/:id" element={<TripDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/bookings" element={<Protected><MyBookingsPage /></Protected>} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/trips" element={<Protected role="ADMIN"><AdminTripsPage /></Protected>} />
            <Route path="/admin/bookings" element={<Protected role="ADMIN"><AdminBookingsPage /></Protected>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <footer className="site-footer">© {new Date().getFullYear()} TravelMate • Plan. Book. Explore.</footer>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
