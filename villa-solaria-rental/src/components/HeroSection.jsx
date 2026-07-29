import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshWobbleMaterial } from '@react-three/drei';
import { Calendar, Users, Home, ArrowRight, Clock, Sun } from 'lucide-react';
import { villasData } from '../data/villasData';

function LightBlueWobbleCanvas() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1 - 0.6;
      meshRef.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.2) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -1, 0]} rotation={[-Math.PI / 3, 0, 0]}>
      <planeGeometry args={[30, 30, 64, 64]} />
      <MeshWobbleMaterial
        color="#38BDF8" // Vibrant Light Blue / Sky Blue
        factor={0.4}
        speed={1.5}
        roughness={0.1}
        metalness={0.2}
        transparent={true}
        opacity={0.45}
      />
    </mesh>
  );
}

// Custom Sun + Surfboard Graphic Component
function SunAndSurfboardGraphic() {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '70px', height: '70px', flexShrink: 0 }}>
      <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Sun Glow */}
        <circle cx="45" cy="45" r="24" fill="url(#sunGlow)" />
        {/* Sun Rays */}
        <g stroke="#FBBF24" strokeWidth="4" strokeLinecap="round">
          <line x1="45" y1="10" x2="45" y2="2" />
          <line x1="45" y1="88" x2="45" y2="80" />
          <line x1="10" y1="45" x2="2" y2="45" />
          <line x1="88" y1="45" x2="80" y2="45" />
          <line x1="20" y1="20" x2="14" y2="14" />
          <line x1="70" y1="70" x2="64" y2="64" />
          <line x1="20" y1="70" x2="14" y2="76" />
          <line x1="70" y1="20" x2="76" y2="14" />
        </g>
        {/* Surfboard Leaning Across Sun */}
        <g transform="translate(38, 8) rotate(24)">
          {/* Surfboard body */}
          <path d="M10 0 C18 16, 18 64, 10 78 C2 64, 2 16, 10 0 Z" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2.5" />
          {/* Stringer line */}
          <line x1="10" y1="6" x2="10" y2="72" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 3" />
          {/* Decorative stripe */}
          <path d="M4 30 Q10 24 16 30" stroke="#00B4D8" strokeWidth="2.5" fill="none" />
        </g>
        <defs>
          <radialGradient id="sunGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(45 45) rotate(90) scale(24)">
            <stop stopColor="#FDE047" />
            <stop offset="0.6" stopColor="#FBBF24" />
            <stop offset="1" stopColor="#F59E0B" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function HeroSection({ onOpenBooking }) {
  const [selectedVillaId, setSelectedVillaId] = useState(villasData[0].id);
  const [checkInDate, setCheckInDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    return tomorrow.toISOString().split('T')[0];
  });
  const [guests, setGuests] = useState(4);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const villa = villasData.find(v => v.id === selectedVillaId) || villasData[0];
    onOpenBooking(villa, { checkInDate, checkOutDate, guests });
  };

  return (
    <section 
      className="hero-section" 
      id="hero" 
      style={{ 
        background: 'linear-gradient(135deg, #FFFFFF 0%, #E0F2FE 45%, #BAE6FD 100%)', 
        color: '#0F172A', 
        position: 'relative', 
        overflow: 'hidden' 
      }}
    >
      {/* 3D Light Blue Animated Wobble Background */}
      <div className="hero-background-canvas">
        <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FFFFFF" />
          <pointLight position={[-5, 5, 2]} intensity={2.0} color="#7DD3FC" />
          <LightBlueWobbleCanvas />
        </Canvas>
      </div>

      <div className="hero-content-grid">
        <div className="hero-text-col">
          <div className="hero-badge-row" style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
            <span 
              className="section-tag" 
              style={{ 
                color: '#92400E', 
                backgroundColor: '#FDE68A', 
                borderColor: '#F59E0B',
                fontWeight: '800',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.25)'
              }}
            >
              ☀️ WELCOME TO DAR RAMZI
            </span>
            <div 
              className="midday-badge" 
              style={{ 
                color: '#0284C7', 
                backgroundColor: '#E0F2FE', 
                borderColor: '#7DD3FC',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '700'
              }}
            >
              <Clock size={14} color="#0284C7" />
              <span>Check-in / out at 12:00 PM Midday</span>
            </div>
          </div>

          {/* Title Row with Sun + Surfboard Graphic on the left */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
            <SunAndSurfboardGraphic />
            <h1 className="hero-title" style={{ color: '#0F172A', fontSize: 'clamp(2.8rem, 5.5vw, 4.5rem)', lineHeight: '1.05', margin: 0 }}>
              Dar Ramzi <br />
              <span style={{ 
                color: '#D97706',
                fontWeight: '800'
              }}>
                Summer Estate
              </span>
            </h1>
          </div>

          <p className="hero-subtitle" style={{ color: '#334155', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '32px', fontWeight: '500' }}>
            Experience 4 private 2-bedroom rental houses centered around a 
            sun-drenched resort pool. Midday-to-midday per night stays at 300 DT / night 
            tailored for ultimate relaxation.
          </p>

          <div className="hero-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', borderTop: '1px solid rgba(2, 132, 199, 0.2)', paddingTop: '24px' }}>
            <div>
              <div className="stat-number" style={{ color: '#D97706', fontSize: '2.2rem', fontWeight: '800' }}>4</div>
              <div className="stat-label" style={{ color: '#1E293B', fontSize: '0.85rem', fontWeight: '600' }}>Private 2-Bed Houses</div>
            </div>
            <div>
              <div className="stat-number" style={{ color: '#D97706', fontSize: '2.2rem', fontWeight: '800' }}>1</div>
              <div className="stat-label" style={{ color: '#1E293B', fontSize: '0.85rem', fontWeight: '600' }}>Shared Resort Pool</div>
            </div>
            <div>
              <div className="stat-number" style={{ color: '#D97706', fontSize: '2.2rem', fontWeight: '800' }}>300 DT</div>
              <div className="stat-label" style={{ color: '#1E293B', fontSize: '0.85rem', fontWeight: '600' }}>Rate / Night</div>
            </div>
          </div>
        </div>

        <div>
          {/* Floating Search & Booking Widget */}
          <div className="hero-booking-card" style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 40px rgba(14, 165, 233, 0.15)', borderTop: '4px solid #FBBF24', borderLeft: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
            <h3 className="font-serif" style={{ fontSize: '1.6rem', marginBottom: '8px', color: '#0F172A' }}>
              Reserve Your Stay
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#D97706', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sun size={14} color="#F59E0B" /> Every 24-hour night cycle runs 12:00 PM Midday to 12:00 PM Midday
            </p>

            <form onSubmit={handleSearchSubmit}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div className="booking-field">
                  <label style={{ color: '#475569' }}><Home size={14} style={{ display: 'inline', marginRight: '4px' }} /> Select House</label>
                  <select value={selectedVillaId} onChange={(e) => setSelectedVillaId(e.target.value)} style={{ color: '#0F172A', background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                    {villasData.map(villa => (
                      <option key={villa.id} value={villa.id}>
                        {villa.name} — {villa.pricePerNight} DT/night (2 Bed, Kitchen, Bath)
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="booking-field">
                    <label style={{ color: '#475569' }}><Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} /> Check-in (12 PM)</label>
                    <input 
                      type="date" 
                      value={checkInDate} 
                      onChange={(e) => setCheckInDate(e.target.value)} 
                      required 
                      style={{ color: '#0F172A', background: '#FFFBEB', border: '1px solid #FDE68A' }}
                    />
                    <span className="midday-note" style={{ color: '#D97706' }}>Starts at 12:00 PM</span>
                  </div>

                  <div className="booking-field">
                    <label style={{ color: '#475569' }}><Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} /> Check-out (12 PM)</label>
                    <input 
                      type="date" 
                      value={checkOutDate} 
                      onChange={(e) => setCheckOutDate(e.target.value)} 
                      required 
                      style={{ color: '#0F172A', background: '#FFFBEB', border: '1px solid #FDE68A' }}
                    />
                    <span className="midday-note" style={{ color: '#D97706' }}>Ends at 12:00 PM</span>
                  </div>
                </div>

                <div className="booking-field">
                  <label style={{ color: '#475569' }}><Users size={14} style={{ display: 'inline', marginRight: '4px' }} /> Guests</label>
                  <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} style={{ color: '#0F172A', background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                    <option value={5}>5 Guests</option>
                    <option value={6}>6 Guests</option>
                  </select>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', boxShadow: '0 8px 20px rgba(245, 158, 11, 0.35)' }}>
                  <span>Check Availability & Reserve</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
