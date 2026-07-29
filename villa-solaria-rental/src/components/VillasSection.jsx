import { useState } from 'react';
import { Bed, Sofa, Utensils, Bath, Users, ArrowRight, ChevronLeft, ChevronRight, X, Image as ImageIcon } from 'lucide-react';
import { villasData } from '../data/villasData';

const getPhotoLabel = (path) => {
  if (!path) return 'House Photo';
  if (path.includes('terrace.jpg')) return 'Terrace & Entrance';
  if (path.includes('bedroom.jpg')) return 'Bedroom with 2 Beds';
  if (path.includes('kitchen.jpg')) return 'Fully Equipped Kitchen';
  if (path.includes('bathroom.jpg')) return 'Bathroom with Washing Machine';
  return 'House Photo';
};

function PhotoGalleryModal({ photos, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const prev = () => setIdx(i => (i - 1 + photos.length) % photos.length);
  const next = () => setIdx(i => (i + 1) % photos.length);

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 3000 }}>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'relative', maxWidth: 900, width: '90vw', borderRadius: 20, overflow: 'hidden',
        background: '#000', boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, zIndex: 10, width: 36, height: 36,
          borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none',
          color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
        }}>
          <X size={20} />
        </button>

        <img
          src={photos[idx]}
          alt={getPhotoLabel(photos[idx])}
          style={{ width: '100%', height: '70vh', objectFit: 'contain', display: 'block' }}
        />

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 24px', background: 'rgba(0,0,0,0.8)'
        }}>
          <button onClick={prev} style={{
            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8,
            padding: '8px 14px', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
          }}>
            <ChevronLeft size={18} /> Prev
          </button>

          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>
            {getPhotoLabel(photos[idx])} — {idx + 1} / {photos.length}
          </span>

          <button onClick={next} style={{
            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8,
            padding: '8px 14px', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
          }}>
            Next <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VillasSection({ onOpenBooking }) {
  const [galleryState, setGalleryState] = useState(null);

  return (
    <section className="villas-section" id="villas">
      <div className="section-header">
        <span className="section-tag">ACCOMMODATIONS</span>
        <h2 className="section-title">The 4 Private Summer Houses</h2>
        <p className="section-subtitle">
          Each house is fully furnished with 2 Bedrooms, Living Room, Kitchen,
          and Bathroom. Rentable per night (12 PM Midday check-in to 12 PM Midday check-out).
        </p>
      </div>

      <div className="villas-grid">
        {villasData.map((villa) => (
          <div key={villa.id} className="glass-card villa-card">
            <div className="villa-image-wrapper" style={{ cursor: 'pointer' }}
              onClick={() => setGalleryState({ photos: villa.photos, startIndex: 0 })}
            >
              <img src={villa.image} alt={villa.name} className="villa-image" />
              <div className="villa-tag-badge">{villa.tag}</div>
              <div className="villa-price-badge">
                <span className="villa-price-number">{villa.pricePerNight} DT</span> / night
              </div>
            </div>

            {/* Mini Photo Strip */}
            {villa.photos && (
              <div style={{
                display: 'flex', gap: 6, padding: '10px 14px', overflowX: 'auto',
                background: 'rgba(0,0,0,0.02)', alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: 4 }}>
                  <ImageIcon size={12} style={{ display: 'inline', marginRight: 2 }} /> Photos:
                </span>
                {villa.photos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo}
                    alt={getPhotoLabel(photo)}
                    onClick={() => setGalleryState({ photos: villa.photos, startIndex: i })}
                    style={{
                      width: 56, height: 42, objectFit: 'cover', borderRadius: 6,
                      cursor: 'pointer', border: '2px solid transparent',
                      transition: 'all 0.2s ease', opacity: 0.88
                    }}
                    onMouseEnter={e => { e.target.style.borderColor = 'var(--terracotta)'; e.target.style.opacity = '1'; }}
                    onMouseLeave={e => { e.target.style.borderColor = 'transparent'; e.target.style.opacity = '0.88'; }}
                  />
                ))}
              </div>
            )}

            <div className="villa-details">
              <h3 className="villa-name font-serif">{villa.name}</h3>
              <p className="villa-sub">{villa.description}</p>

              <div className="villa-specs-grid">
                <div className="spec-item">
                  <Bed size={16} className="spec-icon" />
                  <span><strong>{villa.bedrooms}</strong> Bedrooms</span>
                </div>

                <div className="spec-item">
                  <Sofa size={16} className="spec-icon" />
                  <span><strong>{villa.livingRooms}</strong> Living Room</span>
                </div>

                <div className="spec-item">
                  <Utensils size={16} className="spec-icon" />
                  <span><strong>{villa.kitchens}</strong> Kitchen</span>
                </div>

                <div className="spec-item">
                  <Bath size={16} className="spec-icon" />
                  <span><strong>{villa.bathrooms}</strong> Bathroom</span>
                </div>

                <div className="spec-item" style={{ gridColumn: 'span 2' }}>
                  <Users size={16} className="spec-icon" />
                  <span>Up to <strong>{villa.maxGuests}</strong> Guests ({villa.sqm} m²)</span>
                </div>
              </div>

              <div className="villa-card-footer">
                <button
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px 14px', fontSize: '0.9rem' }}
                  onClick={() => onOpenBooking(villa)}
                >
                  <span>Reserve {villa.name}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full-screen Gallery Modal */}
      {galleryState && (
        <PhotoGalleryModal
          photos={galleryState.photos}
          startIndex={galleryState.startIndex}
          onClose={() => setGalleryState(null)}
        />
      )}
    </section>
  );
}
