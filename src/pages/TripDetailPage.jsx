import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TripsAPI, BookingsAPI } from '../api';
import { useAuth } from '../App';

export default function TripDetailPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [guestNames, setGuestNames] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    TripsAPI.get(id)
      .then((res) => setTrip(res.trip))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const book = async () => {
    if (!user) return nav('/login');
    try {
      const guests = guestNames
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .map(name => ({ name }));
      if (!contactPhone.trim()) {
        alert('Please enter your contact phone number');
        return;
      }
      await BookingsAPI.create(id, { quantity, guests: guests.length ? guests : undefined, contactPhone });
      alert('Booking confirmed');
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{color:'crimson'}}>{error}</div>;
  if (!trip) return <div>Not found</div>;

  return (
    <div className="vstack" style={{gap:16}}>
      {trip.imageUrl && (
        <section className="hero" style={{minHeight:320}}>
          <img src={trip.imageUrl} alt={trip.title} />
          <div className="hero-content">
            <h1>{trip.title}</h1>
            <p>{trip.location}</p>
          </div>
        </section>
      )}
      {!trip.imageUrl && <h2>{trip.title}</h2>}
      <div className="trip-card" style={{maxWidth:900, margin:'0 auto', width:'100%'}}>
        {trip.imageUrl && <img src={trip.imageUrl} alt={trip.title} style={{display:'none'}}/>}
        <div className="card-body">
          <div className="hstack" style={{justifyContent:'space-between'}}>
            <div className="vstack">
              <div><strong>₹{trip.price}</strong></div>
              <div className="muted">{new Date(trip.startDate).toDateString()} - {new Date(trip.endDate).toDateString()}</div>
              <div className="hstack" style={{gap:8, marginTop:4}}>
                {trip.noOfDays ? (<span className="badge ghost">{`${trip.noOfDays} Days`}</span>) : null}
              </div>
            </div>
            <div className="muted">Seats available: {trip.seatsAvailable}</div>
          </div>
          <p style={{marginTop:8}}>{trip.description}</p>
          <div className="vstack" style={{gap:8, marginTop:8}}>
            <div className="hstack" style={{gap:8}}>
              <label>Quantity</label>
              <input type="number" min={1} max={20} value={quantity} onChange={(e)=>setQuantity(Number(e.target.value))} style={{width:100}} />
            </div>
            <input placeholder="Contact phone (required)" value={contactPhone} onChange={(e)=>setContactPhone(e.target.value)} />
            <input placeholder="Guest names (comma separated)" value={guestNames} onChange={(e)=>setGuestNames(e.target.value)} />
            <div className="hstack">
              <button className="btn2" disabled={trip.seatsAvailable <= 0} onClick={book}>Book this trip</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

