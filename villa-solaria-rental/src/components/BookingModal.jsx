import { useState, useMemo } from 'react';
import { Calendar, Clock, ShieldCheck, CheckCircle2, Home, User, Mail, Phone, Info } from 'lucide-react';
import { villasData } from '../data/villasData';
import { saveBooking, OWNER_EMAIL } from '../firebase/config';

export default function BookingModal({ villa: initialVilla, initialDates, onOpenCalendar, onClose }) {
  const [selectedVillaId, setSelectedVillaId] = useState(
    initialVilla ? initialVilla.id : villasData[0].id
  );
  const selectedVilla = useMemo(
    () => villasData.find(v => v.id === selectedVillaId) || villasData[0],
    [selectedVillaId]
  );

  const [checkInDate, setCheckInDate] = useState(() => {
    if (initialDates?.checkInDate) return initialDates.checkInDate;
    return new Date().toISOString().split('T')[0];
  });

  const [checkOutDate, setCheckOutDate] = useState(() => {
    if (initialDates?.checkOutDate) return initialDates.checkOutDate;
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });

  const [guestsCount, setGuestsCount] = useState(initialDates?.guests ?? 2);

  // Guest info
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  // Night count (12:00 PM Midday to 12:00 PM Midday cycles)
  const nightCount = useMemo(() => {
    try {
      const d1 = new Date(checkInDate);
      const d2 = new Date(checkOutDate);
      const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 1;
    } catch { 
      return 1; 
    }
  }, [checkInDate, checkOutDate]);

  const totalPrice = useMemo(() => {
    return selectedVilla.pricePerNight * nightCount;
  }, [selectedVilla.pricePerNight, nightCount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!guestName || !guestEmail) {
      alert('Please fill in your name and email address.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      villaId: selectedVilla.id,
      villaName: selectedVilla.name,
      pricePerNight: selectedVilla.pricePerNight,
      checkInDate,
      checkOutDate,
      nights: nightCount,
      guests: guestsCount,
      totalPrice,
      guestName,
      guestEmail,
      guestPhone,
      specialNotes
    };

    const res = await saveBooking(payload);
    setIsSubmitting(false);

    if (res.success) {
      setConfirmation({ ...payload, bookingId: res.bookingId });
    }
  };

  if (confirmation) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px', padding: '48px', textAlign: 'center' }}>
          <button className="modal-close-btn" onClick={onClose}>✕</button>

          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,180,216,0.12)', color: 'var(--pool-deep)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <CheckCircle2 size={36} />
          </div>

          <h2 className="font-serif" style={{ fontSize: '2.2rem', marginBottom: 8, color: 'var(--text-main)' }}>
            Reservation Request Sent!
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.95rem' }}>
            Thank you, <strong>{confirmation.guestName}</strong>. An email notification has been sent to <strong>{OWNER_EMAIL}</strong> and your request is pending owner review.
          </p>

          <div style={{ background: 'var(--sand-beige)', padding: 24, borderRadius: 16, textAlign: 'left', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, marginBottom: 10, borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Booking Reference</span>
              <span style={{ fontWeight: 700, color: 'var(--terracotta-dark)' }}>{confirmation.bookingId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>House</span><strong>{confirmation.villaName}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Check-in</span><strong>{confirmation.checkInDate} — 12:00 PM Midday</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Check-out</span><strong>{confirmation.checkOutDate} — 12:00 PM Midday</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Duration</span><strong>{confirmation.nights} Night(s)</strong></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-light)' }}>
              <span style={{ fontWeight: 700 }}>Total Stay Price</span>
              <span className="total-price-tag" style={{ fontSize: '1.4rem' }}>{confirmation.totalPrice} DT</span>
            </div>
          </div>

          <button className="btn-primary" onClick={onClose}>Return to Dar Ramzi</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: 840 }}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <div style={{ padding: '24px 32px 16px', borderBottom: '1px solid var(--border-light)' }}>
          <div className="midday-badge" style={{ marginBottom: 8 }}>
            <Clock size={14} />
            <span>12:00 PM Midday Check-in → 12:00 PM Midday Check-out</span>
          </div>
          <h2 className="font-serif" style={{ fontSize: '2rem', color: 'var(--text-main)' }}>
            Reserve {selectedVilla.name}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Rate: <strong style={{ color: 'var(--terracotta)' }}>{selectedVilla.pricePerNight} DT / night</strong> (2 Bedrooms, Living Room, Kitchen, Bathroom)
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body-grid">
            {/* LEFT: Villa & Date selection */}
            <div style={{ padding: '28px 32px', borderRight: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: 18 }}>
              
              <div className="booking-field">
                <label><Home size={13} style={{ display: 'inline', marginRight: 4 }} /> Select House</label>
                <select value={selectedVillaId} onChange={e => setSelectedVillaId(e.target.value)}>
                  {villasData.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name} — {v.pricePerNight} DT/night (2 Bed, Kitchen, Bath)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="booking-field">
                  <label><Calendar size={13} style={{ display: 'inline', marginRight: 4 }} /> Check-in Date</label>
                  <input type="date" value={checkInDate} onChange={e => setCheckInDate(e.target.value)} required />
                  <span className="midday-note">Starts 12:00 PM</span>
                </div>
                <div className="booking-field">
                  <label><Calendar size={13} style={{ display: 'inline', marginRight: 4 }} /> Check-out Date</label>
                  <input type="date" value={checkOutDate} onChange={e => setCheckOutDate(e.target.value)} required />
                  <span className="midday-note">Ends 12:00 PM</span>
                </div>
              </div>

              {onOpenCalendar && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onOpenCalendar}
                  style={{ fontSize: '0.8rem', padding: '8px 12px', width: '100%' }}
                >
                  <Calendar size={14} />
                  <span>View Live Availability Calendar</span>
                </button>
              )}

              <div className="booking-field">
                <label>Number of Guests</label>
                <select value={guestsCount} onChange={e => setGuestsCount(Number(e.target.value))}>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>

              <div style={{ background: 'var(--sand-beige)', padding: '16px', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <Info size={14} style={{ display: 'inline', marginRight: 6, color: 'var(--terracotta)' }} />
                Your request is sent directly to <strong>{OWNER_EMAIL}</strong> for owner review & approval.
              </div>
            </div>

            {/* RIGHT: Guest Info & Summary */}
            <div className="modal-form-col">
              <h4 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>Your Contact Info</h4>

              <div className="booking-field">
                <label><User size={13} style={{ display: 'inline', marginRight: 4 }} /> Full Name</label>
                <input type="text" placeholder="e.g. Mohamed Ali" value={guestName} onChange={e => setGuestName(e.target.value)} required />
              </div>

              <div className="booking-field">
                <label><Mail size={13} style={{ display: 'inline', marginRight: 4 }} /> Email Address</label>
                <input type="email" placeholder="you@example.com" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} required />
              </div>

              <div className="booking-field">
                <label><Phone size={13} style={{ display: 'inline', marginRight: 4 }} /> Phone Number</label>
                <input type="tel" placeholder="+216 XX XXX XXX" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} />
              </div>

              <div className="booking-field">
                <label>Special Requests (Optional)</label>
                <input type="text" placeholder="e.g. Estimated arrival time" value={specialNotes} onChange={e => setSpecialNotes(e.target.value)} />
              </div>

              {/* Price Summary */}
              <div style={{ marginTop: 'auto' }}>
                <div style={{ background: 'var(--sand-beige)', borderRadius: 14, padding: '18px 20px', marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Rate ({nightCount} night{nightCount > 1 ? 's' : ''})</span>
                    <span>{selectedVilla.pricePerNight} DT × {nightCount}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, marginTop: 8, borderTop: '1px solid var(--border-light)' }}>
                    <span style={{ fontWeight: 700 }}>Total</span>
                    <div className="total-price-tag" style={{ fontSize: '1.6rem' }}>
                      {totalPrice} DT
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%' }}
                  disabled={isSubmitting}
                >
                  <ShieldCheck size={18} />
                  <span>{isSubmitting ? 'Sending Request...' : 'Confirm Reservation Request'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
