import { useState, useEffect } from 'react';
import { Sun, Calendar, ShieldCheck, UserCheck } from 'lucide-react';

export default function Navbar({ onOpenBooking, onOpenAdmin, onOpenCalendar }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-brand">
        <div className="nav-logo-icon">
          <Sun size={24} />
        </div>
        <div>
          <div className="nav-logo-text">DAR RAMZI</div>
          <span className="nav-logo-sub">Summer Houses & Resort Pool</span>
        </div>
      </div>

      <nav>
        <ul className="nav-links">
          <li><a href="#villas" className="nav-link">Houses</a></li>
          <li><a href="#pool" className="nav-link">Resort Pool</a></li>
          <li><a href="#amenities" className="nav-link">Estate Highlights</a></li>
          <li>
            <div className="midday-badge">
              <Calendar size={14} />
              <span>Midday-to-Midday Stays (12 PM)</span>
            </div>
          </li>
        </ul>
      </nav>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button 
          className="btn-secondary" 
          onClick={onOpenAdmin}
          title="View Host Admin Reservations"
          style={{ padding: '10px 16px', fontSize: '0.8rem' }}
        >
          <UserCheck size={16} />
          <span>Host Portal</span>
        </button>

        <button className="btn-primary" onClick={() => onOpenBooking(null)}>
          <ShieldCheck size={18} />
          <span>Reserve Now</span>
        </button>
      </div>
    </header>
  );
}
