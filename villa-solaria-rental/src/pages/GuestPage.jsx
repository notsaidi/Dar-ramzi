import { useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import VillasSection from '../components/VillasSection';
import PoolSection from '../components/PoolSection';
import BookingModal from '../components/BookingModal';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import { Sun, Heart, Clock, UserCheck } from 'lucide-react';
import { OWNER_EMAIL } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

export default function GuestPage() {
  const navigate = useNavigate();
  const [bookingVilla, setBookingVilla] = useState(null);
  const [initialBookingDates, setInitialBookingDates] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleOpenBooking = (villa = null, dates = null) => {
    setBookingVilla(villa);
    setInitialBookingDates(dates);
  };

  const handleCalendarSelect = (house, selectedDate) => {
    setShowCalendar(false);
    if (selectedDate) {
      const d2 = new Date(selectedDate);
      d2.setDate(d2.getDate() + 2);
      handleOpenBooking(house, {
        checkInDate: selectedDate,
        checkOutDate: d2.toISOString().split('T')[0]
      });
    } else {
      handleOpenBooking(house, null);
    }
  };

  return (
    <div className="guest-page-container">
      <Navbar 
        onOpenBooking={(villa) => handleOpenBooking(villa, null)} 
        onOpenAdmin={() => navigate('/admin')}
        onOpenCalendar={() => setShowCalendar(true)}
      />

      <main>
        <HeroSection 
          onOpenBooking={(villa, dates) => handleOpenBooking(villa, dates)} 
        />

        <VillasSection 
          onOpenBooking={(villa) => handleOpenBooking(villa, null)}
        />

        <PoolSection />

        {/* Resort Estate Highlights Section */}
        <section className="estate-section" id="amenities">
          <div className="section-header">
            <span className="section-tag">THE ESTATE PROPERTY</span>
            <h2 className="section-title">Designed for Summer Gatherings</h2>
            <p className="section-subtitle">
              Enjoy 1 central swimming pool, Mediterranean landscaping, gated security, 
              and 4 independent houses.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}>
            <div className="glass-card" style={{ padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(224,122,95,0.12)', color: 'var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Clock size={24} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Midday-to-Midday Stays</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Check-in starts at 12:00 PM Midday and check-out finishes at 12:00 PM Midday. Enjoy 24 full hours per night cycle.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0,180,216,0.12)', color: 'var(--pool-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Sun size={24} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>1 Shared Resort Pool</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                15m x 8m swimming pool with blue mosaic tiles, poolside seating, and sun shade.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(244,162,97,0.15)', color: 'var(--sun-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Heart size={24} />
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>4 Summer Houses</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Each house features 2 bedrooms, spacious living room, kitchen, and bathroom with washing machine.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      {showCalendar && (
        <AvailabilityCalendar 
          onSelectDateAndHouse={handleCalendarSelect}
          onClose={() => setShowCalendar(false)}
        />
      )}

      {bookingVilla !== null && (
        <BookingModal 
          villa={bookingVilla} 
          initialDates={initialBookingDates}
          onOpenCalendar={() => { setBookingVilla(null); setShowCalendar(true); }}
          onClose={() => { setBookingVilla(null); setInitialBookingDates(null); }} 
        />
      )}

      {/* Footer */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>DAR RAMZI</h3>
            <p style={{ color: '#A0A5B5', fontSize: '0.9rem', marginBottom: '20px' }}>
              Summer villa sanctuary. Family estate offering 
              4 private 2-bedroom rental houses and 1 central resort pool.
            </p>
            <div className="midday-badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--sun-gold)' }}>
              <Clock size={14} />
              <span>Rental Hours: 12:00 PM to 12:00 PM Midday</span>
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#villas">Private Houses</a></li>
              <li><a href="#pool">Resort Pool</a></li>
              <li><button onClick={() => setShowCalendar(true)} style={{ background: 'none', color: '#A0A5B5', fontSize: '0.9rem' }}>Availability Calendar</button></li>
              <li>
                <button onClick={() => navigate('/admin')} style={{ background: 'none', color: 'var(--sun-gold)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <UserCheck size={14} /> Host Admin Page
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Accommodations</h4>
            <ul>
              <li>House 1 (300 DT/night)</li>
              <li>House 2 (300 DT/night)</li>
              <li>House 3 (300 DT/night)</li>
              <li>House 4 (300 DT/night)</li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Estate Contact</h4>
            <ul>
              <li>📍 Mediterranean Coast</li>
              <li>✉️ {OWNER_EMAIL}</li>
              <li>📞 Direct Host Support</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© 2026 Dar Ramzi. All rights reserved. Family Business Property.</div>
          <div>Check-in: 12:00 PM Midday | Check-out: 12:00 PM Midday</div>
        </div>
      </footer>
    </div>
  );
}
