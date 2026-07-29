import { Droplets } from 'lucide-react';
import { resortInfo, propertyPhotos } from '../data/villasData';

export default function PoolSection() {
  return (
    <section className="pool-section" id="pool">
      <div className="section-header">
        <span className="section-tag" style={{ color: 'var(--pool-deep)', borderColor: 'rgba(0, 180, 216, 0.3)' }}>
          THE HEART OF VILLA SOLARIA
        </span>
        <h2 className="section-title">The Shared Resort Pool</h2>
        <p className="section-subtitle">
          Designed for relaxation, swimming, and summer gatherings. Shared exclusively
          between our 4 private rental houses.
        </p>
      </div>

      <div className="pool-showcase-grid">
        <div className="pool-canvas-card" style={{ position: 'relative' }}>
          <img
            src={propertyPhotos.pool}
            alt="Villa Solaria Resort Pool"
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              borderRadius: 28
            }}
          />
          <div style={{
            position: 'absolute', top: 20, left: 20, zIndex: 10
          }}>
            <div className="midday-badge" style={{ background: 'rgba(255,255,255,0.95)' }}>
              <Droplets size={14} color="var(--pool-deep)" />
              <span>{resortInfo.poolSpecs.size} Pool</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-serif" style={{ fontSize: '2.2rem', marginBottom: '16px', color: 'var(--text-main)' }}>
            Lounge Chairs, Shade & Open Sky
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Whether you want a morning swim before check-out or an afternoon splash,
            the shared outdoor pool features blue mosaic tiles, crystal-clear water,
            and dedicated poolside seating for all guests.
          </p>

          <div className="pool-feature-list">
            <div className="pool-feature-card">
              <div className="pool-feature-title">Dimensions</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{resortInfo.poolSpecs.size}</div>
            </div>

            <div className="pool-feature-card">
              <div className="pool-feature-title">Water</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{resortInfo.poolSpecs.heating}</div>
            </div>

            <div className="pool-feature-card">
              <div className="pool-feature-title">Depth</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{resortInfo.poolSpecs.depth}</div>
            </div>

            <div className="pool-feature-card">
              <div className="pool-feature-title">Design</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{resortInfo.poolSpecs.lighting}</div>
            </div>
          </div>

          <div style={{ marginTop: '28px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {resortInfo.poolSpecs.amenities.map((item, idx) => (
              <span key={idx} style={{
                fontSize: '0.8rem',
                fontWeight: '600',
                padding: '6px 14px',
                borderRadius: '50px',
                background: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                color: 'var(--pool-deep)'
              }}>
                ✓ {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
