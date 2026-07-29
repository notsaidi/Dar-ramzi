import { useState, useEffect } from 'react';
import { 
  RefreshCw, Home, Mail, Phone, Calendar, Clock, 
  CheckCircle2, XCircle, Lock, ShieldCheck, AlertCircle 
} from 'lucide-react';
import { fetchBookings, updateBookingStatus, isLiveFirebase, OWNER_EMAIL } from '../firebase/config';

export default function AdminBookingsView({ onClose }) {
  // Simple Host Security PIN Authentication
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
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px', padding: '36px', textAlign: 'center' }}>
          <button className="modal-close-btn" onClick={onClose}>✕</button>

          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(224,122,95,0.12)', color: 'var(--terracotta)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Lock size={28} />
          </div>

          <h2 className="font-serif" style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '6px' }}>
            Host Admin Access
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Enter your Host Security PIN to manage Dar Ramzi requests and accept/decline reservations.
          </p>

          <form onSubmit={handlePinSubmit}>
            <div className="booking-field" style={{ marginBottom: '16px' }}>
              <input
                type="password"
                placeholder="Enter PIN (Default: 1234)"
                value={pin}
                onChange={e => setPin(e.target.value)}
                style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.2em' }}
                autoFocus
              />
            </div>

            {pinError && (
              <div style={{ color: '#B91C1C', fontSize: '0.8rem', marginBottom: '16px', fontWeight: '600' }}>
                Incorrect PIN. Try entering "1234".
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              <ShieldCheck size={18} />
              <span>Unlock Admin Portal</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  const pendingBookings = bookings.filter(b => b.status === 'Pending');
  const acceptedBookings = bookings.filter(b => b.status === 'Accepted' || b.status === 'Confirmed');
  const totalRevenue = acceptedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '960px' }}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <div style={{ padding: '24px 32px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="section-tag" style={{ margin: 0 }}>DAR RAMZI HOST PORTAL</span>
              <span className="midday-badge" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>
                <span>{OWNER_EMAIL}</span>
              </span>
            </div>
            <h2 className="font-serif" style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>
              Manage Reservations & Accept Requests
            </h2>
          </div>

          <button className="btn-secondary" onClick={loadData} style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Dashboard Stats Banner */}
        <div style={{ padding: '16px 32px', background: 'var(--sand-beige)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', borderBottom: '1px solid var(--border-light)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Requests</span>
            <div style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--terracotta)' }}>{pendingBookings.length} Awaiting</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accepted Reservations</span>
            <div style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--pool-deep)' }}>{acceptedBookings.length} Confirmed</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accepted Revenue</span>
            <div style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--text-main)' }}>{totalRevenue} DT</div>
          </div>
        </div>

        {actionSuccess && (
          <div style={{ padding: '12px 32px', background: 'rgba(0,180,216,0.12)', color: 'var(--pool-deep)', fontWeight: '600', fontSize: '0.88rem', borderBottom: '1px solid var(--border-light)' }}>
            ✓ {actionSuccess}
          </div>
        )}

        <div style={{ padding: '24px 32px', overflowY: 'auto', maxHeight: '65vh' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Loading reservations...
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', background: 'var(--sand-beige)', borderRadius: '16px' }}>
              <Home size={36} color="var(--terracotta)" style={{ marginBottom: '12px' }} />
              <h3 className="font-serif" style={{ fontSize: '1.4rem' }}>No Active Requests</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                New guest reservation requests will appear here for your review and approval.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                      padding: '20px 24px',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--terracotta)' }}>
                            REF: {booking.id}
                          </span>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            padding: '3px 10px',
                            borderRadius: '50px',
                            background: isPending ? 'rgba(244,162,97,0.2)' : isAccepted ? 'rgba(0,180,216,0.15)' : 'rgba(220,38,38,0.15)',
                            color: isPending ? '#C85A3F' : isAccepted ? 'var(--pool-deep)' : '#B91C1C'
                          }}>
                            {isPending ? '🟡 Pending Approval' : isAccepted ? '🟢 Accepted (Booked)' : '🔴 Declined'}
                          </span>
                        </div>

                        <h3 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginTop: '4px' }}>
                          {booking.guestName}
                        </h3>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          <span><Mail size={12} style={{ display: 'inline', marginRight: '4px' }} /> {booking.guestEmail}</span>
                          {booking.guestPhone && <span><Phone size={12} style={{ display: 'inline', marginRight: '4px' }} /> {booking.guestPhone}</span>}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div className="total-price-tag" style={{ fontSize: '1.6rem' }}>{booking.totalPrice} DT</div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {booking.nights} Night(s) Stay
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: 'var(--sand-beige)', padding: '12px 16px', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '14px' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>House</span>
                        <strong>{booking.villaName}</strong>
                      </div>

                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Check-in</span>
                        <strong>{booking.checkInDate} (12:00 PM Midday)</strong>
                      </div>

                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Check-out</span>
                        <strong>{booking.checkOutDate} (12:00 PM Midday)</strong>
                      </div>
                    </div>

                    {/* Owner Action Panel */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Submitted on: {new Date(booking.createdAt).toLocaleString()}
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          className="btn-primary"
                          onClick={() => handleStatusChange(booking.id, 'Accepted', booking.guestName)}
                          style={{
                            background: 'linear-gradient(135deg, var(--pool-blue) 0%, var(--pool-deep) 100%)',
                            padding: '8px 18px',
                            fontSize: '0.82rem'
                          }}
                        >
                          <CheckCircle2 size={16} />
                          <span>Accept Request</span>
                        </button>

                        <button
                          onClick={() => handleStatusChange(booking.id, 'Declined', booking.guestName)}
                          style={{
                            padding: '8px 18px',
                            fontSize: '0.82rem',
                            background: 'rgba(220, 38, 38, 0.1)',
                            color: '#B91C1C',
                            border: '1px solid rgba(220, 38, 38, 0.25)',
                            borderRadius: '50px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          <XCircle size={16} style={{ display: 'inline', marginRight: '4px' }} />
                          <span>Decline</span>
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
