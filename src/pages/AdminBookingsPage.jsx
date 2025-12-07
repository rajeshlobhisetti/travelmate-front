import React, { useEffect, useMemo, useState } from 'react';
import { AdminAPI } from '../api';
import { Link } from 'react-router-dom';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');

  useEffect(() => {
    AdminAPI.bookings()
      .then((res) => setBookings(res.bookings || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return bookings;
    return bookings.filter(b => {
      const hay = [
        b.user?.name,
        b.user?.email,
        b.trip?.title,
        b.status
      ].join(' ').toLowerCase();
      return hay.includes(term);
    });
  }, [bookings, q]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{color:'crimson'}}>{error}</div>;

  return (
    <div className="vstack" style={{gap:12}}>
      <div className="hstack" style={{justifyContent:'space-between', alignItems:'center'}}>
        <h2 style={{margin:'8px 4px'}}>Admin: All Bookings</h2>
        <Link to="/admin/trips"><button className="btn2 ghost">Back to Trips</button></Link>
      </div>
      <div className="hstack" style={{justifyContent:'space-between', alignItems:'center'}}>
        <input placeholder="Search by user, email, trip or status" value={q} onChange={(e)=>setQ(e.target.value)} style={{maxWidth:360}} />
        <div className="muted">Total: {filtered.length}</div>
      </div>
      <table style={{width:'100%', borderCollapse:'collapse', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, overflow:'hidden'}}>
        <thead>
          <tr>
            <th style={{textAlign:'left', borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'10px'}}>User</th>
            <th style={{textAlign:'left', borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'10px'}}>Email</th>
            <th style={{textAlign:'left', borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'10px'}}>Trip</th>
            <th style={{textAlign:'left', borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'10px'}}>Days</th>
            <th style={{textAlign:'left', borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'10px'}}>Phone</th>
            <th style={{textAlign:'left', borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'10px'}}>Qty</th>
            <th style={{textAlign:'left', borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'10px'}}>Status</th>
            <th style={{textAlign:'left', borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'10px'}}>Booked Date</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(b => (
            <tr key={b.id}>
              <td style={{borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'10px'}}>{b.user?.name || '—'}</td>
              <td style={{borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'10px'}}>{b.user?.email || '—'}</td>
              <td style={{borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'10px'}}>{b.trip?.title || '—'}</td>
              <td style={{borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'10px'}}>{b.trip?.noOfDays ? `${b.trip.noOfDays} Days` : '—'}</td>
              <td style={{borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'10px'}}>{b.contactPhone}</td>
              <td style={{borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'10px'}}>{b.quantity || 1}</td>
              <td style={{borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'10px'}}>{b.status}</td>
              <td style={{borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'10px'}}>{new Date(b.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

