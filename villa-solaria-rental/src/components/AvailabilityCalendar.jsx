import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, Home, ArrowRight } from 'lucide-react';
import { villasData } from '../data/villasData';
import { fetchBookings, getTodayStr, getOneMonthAheadStr } from '../firebase/config';

export default function AvailabilityCalendar({ initialHouseId, onSelectDateAndHouse, onClose }) {
  const [selectedHouseId, setSelectedHouseId] = useState(initialHouseId || villasData[0].id);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      const list = await fetchBookings();
      setBookings(list);
      setLoading(false);
    };
    loadBookings();
  }, []);

  const selectedHouse = useMemo(() => 
    villasData.find(v => v.id === selectedHouseId) || villasData[0], 
    [selectedHouseId]
  );

  // Filter bookings for selected house
  const houseBookings = useMemo(() => {
    return bookings.filter(b => b.villaId === selectedHouseId);
  }, [bookings, selectedHouseId]);

  // Navigate Months
  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Calendar matrix calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Date window: today → 1 month ahead
  const todayStr = getTodayStr();
  const oneMonthAheadStr = getOneMonthAheadStr();

  // Helper to check date status (Available, Booked, Pending, Out-of-Window)
  const getDateStatus = (day) => {
    const checkDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const checkTime = new Date(checkDateStr).getTime();

    // Past dates or beyond 1 month ahead → locked/out-of-window
    if (checkDateStr < todayStr || checkDateStr > oneMonthAheadStr) {
      return { status: checkDateStr < todayStr ? 'past' : 'future-locked' };
    }

    for (const b of houseBookings) {
      if (b.status === 'Declined') continue;
      
      const inTime = new Date(b.checkInDate).getTime();
      const outTime = new Date(b.checkOutDate).getTime();

      if (checkTime >= inTime && checkTime <= outTime) {
        if (b.status === 'Accepted' || b.status === 'Confirmed') {
          return { status: 'booked', booking: b };
        }
        if (b.status === 'Pending') {
          return { status: 'pending', booking: b };
        }
      }
    }

    return { status: 'available' };
  };

  const handleDateClick = (day, dateStatus) => {
    if (dateStatus.status === 'booked' || dateStatus.status === 'past' || dateStatus.status === 'future-locked') return;
    
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (onSelectDateAndHouse) {
      onSelectDateAndHouse(selectedHouse, formattedDate);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '880px' }}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <div style={{ padding: '24px 32px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="section-tag" style={{ margin: 0 }}>LIVE AVAILABILITY CALENDAR</span>
              <div className="midday-badge" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>
                <Clock size={12} />
                <span>12:00 PM Midday Cycles</span>
              </div>
            </div>
            <h2 className="font-serif" style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>
              Availability Calendar — <span style={{ color: 'var(--terracotta)' }}>{selectedHouse.name}</span>
            </h2>
          </div>

          {/* Show house switcher tabs ONLY if not opened for a specific house */}
          {!initialHouseId ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              {villasData.map(h => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHouseId(h.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '50px',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    background: selectedHouseId === h.id ? 'var(--terracotta)' : 'var(--sand-beige)',
                    color: selectedHouseId === h.id ? '#FFF' : 'var(--text-main)',
                    transition: 'var(--transition)'
                  }}
                >
                  {h.name}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ 
              padding: '8px 18px', 
              borderRadius: '50px', 
              background: 'linear-gradient(135deg, #E07A5F 0%, #D97706 100%)', 
              color: '#FFF', 
              fontWeight: '700', 
              fontSize: '0.9rem',
              boxShadow: '0 4px 12px rgba(224, 122, 95, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Home size={16} />
              <span>{selectedHouse.name}</span>
            </div>
          )}
        </div>

        <div style={{ padding: '28px 32px' }}>
          {/* Calendar Header Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 className="font-serif" style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>
              {monthName} — <span style={{ color: 'var(--terracotta)' }}>{selectedHouse.name}</span>
            </h3>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-secondary" onClick={prevMonth} style={{ padding: '8px 12px' }}>
                <ChevronLeft size={16} />
              </button>
              <button className="btn-secondary" onClick={nextMonth} style={{ padding: '8px 12px' }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
          </div>

          {/* Calendar Days Matrix */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
            {/* Empty slots for month start padding */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} style={{ height: '64px', borderRadius: '12px', background: 'rgba(0,0,0,0.02)' }} />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStatus = getDateStatus(day);
              const isAvailable = dateStatus.status === 'available';
              const isBooked = dateStatus.status === 'booked';
              const isPending = dateStatus.status === 'pending';
              const isPast = dateStatus.status === 'past';
              const isFutureLocked = dateStatus.status === 'future-locked';
              const isLocked = isPast || isFutureLocked;

              return (
                <div
                  key={day}
                  onClick={() => handleDateClick(day, dateStatus)}
                  style={{
                    height: '64px',
                    borderRadius: '12px',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    opacity: isLocked ? 0.35 : 1,
                    background: isBooked 
                      ? 'rgba(220, 38, 38, 0.12)' 
                      : isPending 
                      ? 'rgba(244, 162, 97, 0.18)'
                      : isLocked
                      ? 'rgba(0,0,0,0.04)'
                      : '#FFFFFF',
                    border: isBooked 
                      ? '1px solid rgba(220, 38, 38, 0.3)' 
                      : isPending 
                      ? '1px solid rgba(244, 162, 97, 0.4)'
                      : '1px solid var(--border-light)',
                    transition: 'all 0.2s ease',
                    boxShadow: isAvailable ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem', color: isBooked ? '#B91C1C' : isPending ? '#C85A3F' : isLocked ? '#AAA' : 'var(--text-main)' }}>
                      {day}
                    </span>
                    {!isLocked && (
                      <span style={{ fontSize: '0.65rem', fontWeight: '700', borderRadius: '50px', padding: '2px 6px', background: isBooked ? '#B91C1C' : isPending ? '#F4A261' : 'var(--pool-blue)', color: '#FFF' }}>
                        {isBooked ? 'Booked' : isPending ? 'Pending' : 'Free'}
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.7rem', color: isBooked ? '#B91C1C' : isLocked ? '#BBB' : 'var(--text-muted)', fontWeight: '600' }}>
                    {isPast ? '—' : isFutureLocked ? '—' : isBooked ? '🔴 Occupied' : isPending ? '🟡 Reviewing' : '🟢 300 DT'}
                  </div>
                </div>
              );
            })}

          </div>

          {/* Calendar Status Legend */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--pool-blue)' }} />
                <span><strong>🟢 Green</strong>: Free Date (Click to Reserve)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#B91C1C' }} />
                <span><strong>🔴 Red</strong>: Booked / Occupied</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F4A261' }} />
                <span><strong>🟡 Yellow</strong>: Pending Owner Approval</span>
              </div>
            </div>

            <button 
              className="btn-primary" 
              onClick={() => onSelectDateAndHouse(selectedHouse, null)}
              style={{ padding: '10px 20px', fontSize: '0.85rem' }}
            >
              <span>Reserve {selectedHouse.name}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
