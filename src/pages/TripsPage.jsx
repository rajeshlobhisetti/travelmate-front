import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { TripsAPI, BookingsAPI } from '../api';
import { useAuth } from '../App';

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const { user } = useAuth();
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const s = searchParams.get('start') || '';
    const e = searchParams.get('end') || '';
    setStart(s);
    setEnd(e);
    TripsAPI.list({ start: s || undefined, end: e || undefined })
      .then((res) => setTrips(res.trips || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [searchParams]);

  useEffect(() => {
    setQ(searchParams.get('q') || '');
  }, [searchParams]);

  const book = async (id) => {
    if (!user) {
      nav('/login');
      return;
    }
    nav(`/trips/${id}`);
  };

  if (loading) return <div>Loading trips...</div>;
  if (error) return <div style={{color:'crimson'}}>{error}</div>;

  const filtered = trips.filter(t =>
    [t.title, t.location].join(' ').toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="vstack" style={{gap:16}}>
      <section className="hero">
        <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000" alt="Beach" />
        <div className="hero-content">
          <h1>Find your next getaway</h1>
          <p>Curated trips across India. Book with confidence.</p>
        </div>
      </section>

      <div className="hstack" style={{justifyContent:'space-between', marginTop:4}}>
        <h2 style={{margin:'8px 4px'}}>All Trips</h2>
        <input
          placeholder="Search by place or title"
          value={q}
          onChange={(e)=>{
            const v = e.target.value;
            setQ(v);
            const p = new URLSearchParams(searchParams);
            if (v) p.set('q', v); else p.delete('q');
            setSearchParams(p);
          }}
          style={{maxWidth:260}}
        />
      </div>
      <div className="hstack" style={{gap:8, alignItems:'end'}}>
        <div className="vstack" style={{gap:4}}>
          <label className="muted">Start date</label>
          <input type="date" value={start} onChange={(e)=>{
            const v = e.target.value;
            setStart(v);
            const p = new URLSearchParams(searchParams);
            if (v) p.set('start', v); else p.delete('start');
            setSearchParams(p);
          }} />
        </div>
        <div className="vstack" style={{gap:4}}>
          <label className="muted">End date</label>
          <input type="date" value={end} onChange={(e)=>{
            const v = e.target.value;
            setEnd(v);
            const p = new URLSearchParams(searchParams);
            if (v) p.set('end', v); else p.delete('end');
            setSearchParams(p);
          }} />
        </div>
        <button className="btn2 ghost" onClick={()=>{
          const p = new URLSearchParams(searchParams);
          p.delete('start'); p.delete('end');
          setStart(''); setEnd('');
          setSearchParams(p);
        }}>Clear dates</button>
      </div>
      <div className="grid">
        {filtered.map(t => (
          <div key={t.id} className="trip-card">
            {t.imageUrl && <img src={t.imageUrl} alt={t.title} />}
            <div className="card-body">
              <h3>{t.title}</h3>
              <div className="muted">{t.location}</div>
              <div className="muted">{t.startDate ? new Date(t.startDate).toLocaleDateString() : '—'} - {t.endDate ? new Date(t.endDate).toLocaleDateString() : '—'}</div>
              <div className="hstack" style={{gap:8, marginTop:4}}>
                {t.noOfDays ? (<span className="badge ghost">{`${t.noOfDays} Days`}</span>) : null}
              </div>
              <div className="hstack" style={{justifyContent:'space-between'}}>
                <div><strong>₹{t.price}</strong></div>
                <div className="muted">Seats: {t.seatsAvailable}</div>
              </div>
              <div className="hstack" style={{marginTop:6}}>
                <Link to={`/trips/${t.id}`}><button className="btn2 ghost">Details</button></Link>
                <button className="btn2" disabled={t.seatsAvailable <= 0} onClick={()=>book(t.id)}>Book</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
