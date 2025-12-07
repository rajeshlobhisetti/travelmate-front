import React, { useEffect, useState } from 'react';
import { TripsAPI, AdminAPI } from '../api';
import { Link } from 'react-router-dom';

const emptyForm = {
  title: '',
  description: '',
  location: '',
  price: '',
  startDate: '',
  endDate: '',
  seatsAvailable: '',
  imageUrl: '',
  noOfDays: ''
};

export default function AdminTripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [bookingTripId, setBookingTripId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const load = () => {
    setLoading(true);
    TripsAPI.list()
      .then((res) => setTrips(res.trips || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      seatsAvailable: Number(form.seatsAvailable),
      noOfDays: form.noOfDays ? Number(form.noOfDays) : undefined
    };
    try {
      if (editingId) {
        await TripsAPI.update(editingId, payload);
      } else {
        await TripsAPI.create(payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  const onEdit = (t) => {
    setEditingId(t.id);
    setForm({
      title: t.title,
      description: t.description,
      location: t.location,
      price: String(t.price),
      startDate: t.startDate?.slice(0,10),
      endDate: t.endDate?.slice(0,10),
      seatsAvailable: String(t.seatsAvailable),
      imageUrl: t.imageUrl || '',
      noOfDays: t.noOfDays ? String(t.noOfDays) : ''
    });
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this trip?')) return;
    try {
      await TripsAPI.remove(id);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  const loadBookings = async (tripId) => {
    setLoadingBookings(true);
    setBookingTripId(tripId);
    try {
      const res = await AdminAPI.bookingsForTrip(tripId);
      setBookings(res.bookings || []);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoadingBookings(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{color:'crimson'}}>{error}</div>;

  return (
    <div>
      <div className="hstack" style={{justifyContent:'space-between', alignItems:'center'}}>
        <h2>Admin: Trips</h2>
        <Link to="/admin/bookings"><button className="btn2 ghost">View All Bookings</button></Link>
      </div>
      <form onSubmit={onSubmit} style={{display:'grid', gap:8, maxWidth:700, margin:'12px 0'}}>
        <input placeholder="Title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} required />
        <input placeholder="Location" value={form.location} onChange={(e)=>setForm({...form,location:e.target.value})} required />
        <textarea placeholder="Description" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} required />
        <input type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} required />
        <div style={{display:'flex', gap:8}}>
          <input type="date" value={form.startDate} onChange={(e)=>{
            const startDate = e.target.value;
            let noOfDays = form.noOfDays;
            if (startDate && form.endDate) {
              const ms = new Date(form.endDate) - new Date(startDate);
              noOfDays = Math.max(1, Math.round(ms / (1000*60*60*24)));
            }
            setForm({...form,startDate, noOfDays: noOfDays ? String(noOfDays) : ''});
          }} required />
          <input type="date" value={form.endDate} onChange={(e)=>{
            const endDate = e.target.value;
            let noOfDays = form.noOfDays;
            if (form.startDate && endDate) {
              const ms = new Date(endDate) - new Date(form.startDate);
              noOfDays = Math.max(1, Math.round(ms / (1000*60*60*24)));
            }
            setForm({...form,endDate, noOfDays: noOfDays ? String(noOfDays) : ''});
          }} required />
        </div>
        <input type="number" placeholder="Seats Available" value={form.seatsAvailable} onChange={(e)=>setForm({...form,seatsAvailable:e.target.value})} required />
        <input placeholder="Image URL" value={form.imageUrl} onChange={(e)=>setForm({...form,imageUrl:e.target.value})} />
        <div style={{display:'flex', gap:8}}>
          <input type="number" placeholder="No. of Days" value={form.noOfDays} onChange={(e)=>setForm({...form,noOfDays:e.target.value})} />
        </div>
        <div style={{display:'flex', gap:8}}>
          <button type="submit">{editingId ? 'Update Trip' : 'Create Trip'}</button>
          {editingId && <button type="button" onClick={()=>{setEditingId(null); setForm(emptyForm);}}>Cancel</button>}
        </div>
      </form>

      <h3>All Trips</h3>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
          <tr>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>Title</th>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>Image</th>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>Location</th>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>Days</th>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>Price</th>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>Seats</th>
            <th style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trips.map(t => (
            <tr key={t.id}>
              <td style={{borderBottom:'1px solid #eee'}}>{t.title}</td>
              <td style={{borderBottom:'1px solid #eee'}}>
                {t.imageUrl ? <img src={t.imageUrl} alt={t.title} style={{width:80, height:50, objectFit:'cover', borderRadius:6}}/> : '—'}
              </td>
              <td style={{borderBottom:'1px solid #eee'}}>{t.location}</td>
              <td style={{borderBottom:'1px solid #eee'}}>{t.noOfDays ? `${t.noOfDays} Days` : '—'}</td>
              <td style={{borderBottom:'1px solid #eee'}}>₹{t.price}</td>
              <td style={{borderBottom:'1px solid #eee'}}>{t.seatsAvailable}</td>
              <td style={{borderBottom:'1px solid #eee'}}>
                <button onClick={()=>onEdit(t)}>Edit</button>
                <button onClick={()=>onDelete(t.id)} style={{marginLeft:8}}>Delete</button>
                <button onClick={()=>loadBookings(t.id)} style={{marginLeft:8}}>View Bookings</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {bookingTripId && (
        <div>
          <h3>Bookings for {trips.find(t => t.id === bookingTripId).title}</h3>
          {loadingBookings ? (
            <div>Loading...</div>
          ) : (
            <table style={{width:'100%', borderCollapse:'collapse'}}>
              <thead>
                <tr>
                  <th style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>User</th>
                  <th style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>Email</th>
                  <th style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>Status</th>
                  <th style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>Created</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td style={{borderBottom:'1px solid #eee'}}>{b.user?.name || '—'}</td>
                    <td style={{borderBottom:'1px solid #eee'}}>{b.user?.email || '—'}</td>
                    <td style={{borderBottom:'1px solid #eee'}}>{b.status}</td>
                    <td style={{borderBottom:'1px solid #eee'}}>{new Date(b.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
