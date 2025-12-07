import React, { useEffect, useState } from 'react';
import { BookingsAPI } from '../api';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    BookingsAPI.my()
      .then((res) => setBookings(res.bookings || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await BookingsAPI.cancel(id);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{color:'crimson'}}>{error}</div>;

  return (
    <div>
      <h2>My Bookings</h2>
      {bookings.length === 0 && <div>No bookings yet.</div>}
      <div className="vstack" style={{gap:12}}>
        {bookings.map(b => (
          <div key={b.id} className="ticket" style={{border:'1px dashed #666', borderRadius:16, padding:16, background:'rgba(255,255,255,0.03)'}}>
            <div className="hstack" style={{justifyContent:'space-between', alignItems:'center'}}>
              <div className="vstack" style={{gap:4}}>
                <div style={{fontSize:18, fontWeight:700}}>{b.trip.title}</div>
                <div className="muted">{b.trip.location}</div>
                <div className="hstack" style={{gap:8}}>
                  {b.trip.noOfDays ? (<span className="badge ghost">{`${b.trip.noOfDays} Days`}</span>) : null}
                </div>
              </div>
              <div className="vstack" style={{textAlign:'right'}}>
                <div><strong>₹{b.trip.price}</strong></div>
                <div className="muted">Qty: {b.quantity || 1}</div>
              </div>
            </div>
            <div className="hstack" style={{justifyContent:'space-between', marginTop:8}}>
              <div className="muted">{new Date(b.trip.startDate).toDateString()} → {new Date(b.trip.endDate).toDateString()}</div>
              <div className="muted">Booked: {new Date(b.createdAt).toLocaleString()}</div>
            </div>
            <div className="hstack" style={{marginTop:10}}>
              <span className="badge ghost">Status: {b.status}</span>
              <span className="badge">Phone: {b.contactPhone}</span>
              <button onClick={()=>cancel(b.id)} className="btn2" style={{marginLeft:'auto'}}>Cancel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

