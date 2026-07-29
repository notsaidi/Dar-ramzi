import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  RefreshCw, Home, Mail, Phone, Calendar, Clock, 
  CheckCircle2, XCircle, Lock, ShieldCheck, ArrowLeft, Sun, Database 
} from 'lucide-react';
import { fetchBookings, updateBookingStatus, OWNER_EMAIL } from '../firebase/config';

export default function AdminPage() {
  const navigate = useNavigate();

  // Host Security PIN Authentication
  const [pin, setPin] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === '1234' || pin === 'admin') {
      setAuthenticated(true);
      setPinError(false);
      loadData();
    } else {
      setPinError(true);
    }
  };

  const loadData = async () => {
    setLoading(true);
    const list = await fetchBookings();
    setBookings(list);
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) {
      loadData();
    }
  }, [authenticated]);

  const handleStatusChange = async (bookingId, newStatus, guestName) => {
    setLoading(true);
    await updateBookingStatus(bookingId, newStatus);
    setActionSuccess(`Reservation for ${guestName} has been ${newStatus.toUpperCase()}.`);
    await loadData();
    setTimeout(() => setActionSuccess(''), 4000);
  };

  if (!authenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-main)',
        padding: '24px'
      }}>
        <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '40px', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(224,122,95,0.12)', color: 'var(--terracotta)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <Lock size={30} />
          </div>

          <h1 className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--text-main)', marginBottom: '8px' }}>
            Dar Ramzi Admin
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '28px' }}>
            Enter your Host Security PIN to manage guest requests and accept/decline reservations.
          </p>

          <form onSubmit={handlePinSubmit}>
            <div className="booking-field" style={{ marginBottom: '20px' }}>
              <input
                type="password"
                placeholder="Enter PIN (Default: 1234)"
                value={pin}
                onChange={e => setPin(e.target.value)}
                style={{ textAlign: 'center', fontSize: '1.3rem', letterSpacing: '0.2em' }}
                autoFocus
              />
            </div>

            {pinError && (
              <div style={{ color: '#B91C1C', fontSize: '0.85rem', marginBottom: '20px', fontWeight: '600' }}>
                Incorrect PIN. Try entering "1234".
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              <ShieldCheck size={18} />
              <span>Login to Host Dashboard</span>
            </button>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
            <button 
              onClick={() => navigate('/')} 
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={14} /> Back to Dar Ramzi Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pendingBookings = bookings.filter(b => b.status === 'Pending');
  const acceptedBookings = bookings.filter(b => b.status === 'Accepted' || b.status === 'Confirmed');
  const totalRevenue = acceptedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', paddingBottom: '60px' }}>
      {/* Top Header */}
      <header className="navbar-wrapper scrolled" style={{ position: 'sticky', top: 0, height: '74px', zIndex: 100 }}>
        <div className="nav-brand">
          <div className="nav-logo-icon">
            <Sun size={24} />
          </div>
          <div>
            <div className="nav-logo-text">DAR RAMZI</div>
            <span className="nav-logo-sub">Host Admin Portal ({OWNER_EMAIL})</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ padding: '10px 18px', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} />
            <span>Guest Website</span>
          </button>
          
          <button className="btn-primary" onClick={loadData} style={{ padding: '10px 18px', fontSize: '0.85rem' }}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            <span>Refresh Data</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ maxW: '1200px', maxWidth: '1100px', margin: '40px auto 0 auto', padding: '0 24px' }}>
        
        {/* Banner Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--terracotta)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pending Requests</span>
            <div style={{ fontSize: '2.2rem', fontWeight: '700', color: 'var(--terracotta)', marginTop: '4px' }}>
              {pendingBookings.length} Awaiting
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--pool-deep)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Accepted Reservations</span>
            <div style={{ fontSize: '2.2rem', fontWeight: '700', color: 'var(--pool-deep)', marginTop: '4px' }}>
              {acceptedBookings.length} Confirmed
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--sun-gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Accepted Total Revenue</span>
            <div style={{ fontSize: '2.2rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '4px' }}>
              {totalRevenue} DT
            </div>
          </div>
        </div>

        {actionSuccess && (
          <div style={{ padding: '16px 24px', background: 'rgba(0,180,216,0.12)', color: 'var(--pool-deep)', fontWeight: '600', fontSize: '0.92rem', borderRadius: '12px', marginBottom: '24px', border: '1px solid rgba(0,180,216,0.3)' }}>
            ✓ {actionSuccess}
          </div>
        )}

        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
            <h2 className="font-serif" style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>
              Incoming Guest Requests ({bookings.length})
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Accepting a request automatically blocks those dates on the guest calendar.
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
              Loading reservations...
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', background: 'var(--sand-beige)', borderRadius: '16px' }}>
              <Home size={40} color="var(--terracotta)" style={{ marginBottom: '12px' }} />
              <h3 className="font-serif" style={{ fontSize: '1.5rem' }}>No Active Requests</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '6px' }}>
                New guest reservation requests submitted through the site will automatically appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {bookings.map((booking) => {
                const isPending = booking.status === 'Pending';
                const isAccepted = booking.status === 'Accepted' || booking.status === 'Confirmed';
                const isDeclined = booking.status === 'Declined';

                return (
                  <div 
                    key={booking.id} 
                    style={{
                      background: '#FFFFFF',
                      border: isPending 
                        ? '2px solid var(--terracotta)' 
                        : isAccepted 
                        ? '1px solid var(--pool-blue)' 
                        : '1px solid var(--border-light)',
                      borderRadius: '16px',
                      padding: '24px',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--terracotta)', letterSpacing: '0.05em' }}>
                            REF: {booking.id}
                          </span>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            padding: '4px 12px',
                            borderRadius: '50px',
                            background: isPending ? 'rgba(244,162,97,0.2)' : isAccepted ? 'rgba(0,180,216,0.15)' : 'rgba(220,38,38,0.15)',
                            color: isPending ? '#C85A3F' : isAccepted ? 'var(--pool-deep)' : '#B91C1C'
                          }}>
                            {isPending ? '🟡 Pending Approval' : isAccepted ? '🟢 Accepted (Dates Booked)' : '🔴 Declined'}
                          </span>
                        </div>

                        <h3 className="font-serif" style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginTop: '6px' }}>
                          {booking.guestName}
                        </h3>
                        <div style={{ display: 'flex', gap: '20px', fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          <span><Mail size={14} style={{ display: 'inline', marginRight: '4px' }} /> {booking.guestEmail}</span>
                          {booking.guestPhone && <span><Phone size={14} style={{ display: 'inline', marginRight: '4px' }} /> {booking.guestPhone}</span>}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div className="total-price-tag" style={{ fontSize: '1.8rem' }}>{booking.totalPrice} DT</div>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                          {booking.nights} Night(s) Stay
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', background: 'var(--sand-beige)', padding: '16px 20px', borderRadius: '12px', fontSize: '0.88rem', marginBottom: '16px' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem', textTransform: 'uppercase' }}>House</span>
                        <strong>{booking.villaName}</strong>
                      </div>

                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem', textTransform: 'uppercase' }}>Check-in</span>
                        <strong>{booking.checkInDate} (12:00 PM Midday)</strong>
                      </div>

                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem', textTransform: 'uppercase' }}>Check-out</span>
                        <strong>{booking.checkOutDate} (12:00 PM Midday)</strong>
                      </div>
                    </div>

                    {booking.specialNotes && (
                      <div style={{ marginBottom: '16px', fontSize: '0.88rem', color: 'var(--text-muted)', background: 'rgba(244,162,97,0.1)', padding: '10px 14px', borderRadius: '10px' }}>
                        <strong>Guest Note:</strong> "{booking.specialNotes}"
                      </div>
                    )}

                    {/* Owner Action Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        Request Received: {new Date(booking.createdAt).toLocaleString()}
                      </div>

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          className="btn-primary"
                          onClick={() => handleStatusChange(booking.id, 'Accepted', booking.guestName)}
                          style={{
                            background: 'linear-gradient(135deg, var(--pool-blue) 0%, var(--pool-deep) 100%)',
                            padding: '10px 22px',
                            fontSize: '0.88rem'
                          }}
                        >
                          <CheckCircle2 size={16} />
                          <span>Accept Request</span>
                        </button>

                        <button
                          onClick={() => handleStatusChange(booking.id, 'Declined', booking.guestName)}
                          style={{
                            padding: '10px 22px',
                            fontSize: '0.88rem',
                            background: 'rgba(220, 38, 38, 0.1)',
                            color: '#B91C1C',
                            border: '1px solid rgba(220, 38, 38, 0.25)',
                            borderRadius: '50px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          <XCircle size={16} style={{ display: 'inline', marginRight: '4px' }} />
                          <span>Decline Request</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
