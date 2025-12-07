import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TripsAPI } from '../api';

export default function HomePage() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    TripsAPI.list()
      .then((res) => setTrips((res.trips || []).slice(0, 6)))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="vstack" style={{gap:16}}>
      <section className="hero" style={{minHeight:360}}>
        <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000" alt="Snow mountains and lake" />
        <div className="hero-content">
          <h1>Book your next adventure</h1>
          <p>Easy planning and a smooth, ticket-like booking experience.</p>
          <div className="hstack" style={{marginTop:12}}>
            <Link to="/trips"><button className="btn2">Explore Trips</button></Link>
            <a href="#featured" className="btn2 ghost">Featured</a>
          </div>
        </div>
      </section>

      <section id="featured" className="vstack" style={{gap:8}}>
        <h2 style={{margin:'8px 4px'}}>Featured this week</h2>
        {error && <div style={{color:'crimson'}}>{error}</div>}
        <div className="grid">
          {trips.map(t => (
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
                  <Link to="/trips"><button className="btn2">See all</button></Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="vstack" style={{gap:8}}>
        <h2 style={{margin:'8px 4px'}}>Why TravelMate?</h2>
        <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))'}}>
          <div className="trip-card"><div className="card-body"><h3>Carefully curated</h3><div className="muted">Trips selected for weekends and short breaks.</div></div></div>
          <div className="trip-card"><div className="card-body"><h3>Budget-friendly</h3><div className="muted">Transparent pricing, no hidden fees.</div></div></div>
          <div className="trip-card"><div className="card-body"><h3>Easy booking</h3><div className="muted">Login, pick a trip, and you’re set.</div></div></div>
          <div className="trip-card"><div className="card-body"><h3>Trusted support</h3><div className="muted">We’re here to help before and during your trip.</div></div></div>
        </div>
      </section>
    </div>
  );
}

