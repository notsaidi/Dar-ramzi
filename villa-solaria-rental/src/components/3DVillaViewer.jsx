import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows } from '@react-three/drei';

function VillaHouseModel({ accentColor }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Foundation & Deck */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4.5, 0.2, 3.5]} />
        <meshStandardMaterial color="#EAE2B7" roughness={0.7} />
      </mesh>

      {/* Main Living & Kitchen Block */}
      <mesh position={[-0.8, 0.8, 0]}>
        <boxGeometry args={[2.2, 1.4, 2.8]} />
        <meshStandardMaterial color="#FDFBF7" roughness={0.4} />
      </mesh>

      {/* Bedroom 1 Block (Master) */}
      <mesh position={[1.2, 0.8, -0.6]}>
        <boxGeometry args={[1.8, 1.4, 1.6]} />
        <meshStandardMaterial color="#F8F5EE" roughness={0.4} />
      </mesh>

      {/* Bedroom 2 Block */}
      <mesh position={[1.2, 0.8, 0.8]}>
        <boxGeometry args={[1.8, 1.4, 1.2]} />
        <meshStandardMaterial color="#F8F5EE" roughness={0.4} />
      </mesh>

      {/* Slanted Roof Accent */}
      <mesh position={[-0.8, 1.7, 0]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[2.4, 0.15, 3.0]} />
        <meshStandardMaterial color={accentColor || "#E07A5F"} roughness={0.3} />
      </mesh>

      <mesh position={[1.2, 1.7, 0]} rotation={[0, 0, -0.05]}>
        <boxGeometry args={[2.0, 0.15, 3.0]} />
        <meshStandardMaterial color={accentColor || "#E07A5F"} roughness={0.3} />
      </mesh>

      {/* Glass Windows / Sliding Doors */}
      <mesh position={[-0.8, 0.8, 1.41]}>
        <planeGeometry args={[1.8, 1.0]} />
        <meshStandardMaterial color="#00B4D8" transparent opacity={0.6} roughness={0.1} />
      </mesh>

      {/* Private Terrace Plunge Pool / Sunbed */}
      <mesh position={[-1.4, 0.25, 1.2]}>
        <boxGeometry args={[1.2, 0.3, 0.8]} />
        <meshStandardMaterial color="#00B4D8" roughness={0.1} />
      </mesh>

      <ContactShadows position={[0, -0.1, 0]} opacity={0.5} scale={8} blur={1.5} far={4} />
    </group>
  );
}

export default function VillaViewer3D({ villa, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px' }}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <div className="modal-body-grid">
          <div className="modal-viewer-col">
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              zIndex: 10,
              color: '#FFF'
            }}>
              <span className="section-tag" style={{ background: 'rgba(255,255,255,0.2)', color: '#FFF' }}>
                3D VILLA ARCHITECTURE
              </span>
              <h3 className="font-serif" style={{ fontSize: '1.8rem', color: '#FFF' }}>{villa.name}</h3>
            </div>

            <Canvas camera={{ position: [4, 4, 6], fov: 45 }}>
              <ambientLight intensity={0.7} />
              <directionalLight position={[5, 8, 5]} intensity={1.5} color="#FFF5E0" />
              <pointLight position={[-3, 3, -2]} intensity={1} color="#F4A261" />
              
              <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.05}>
                <VillaHouseModel accentColor={villa.accentColor} />
              </Float>

              <OrbitControls enableZoom={true} minDistance={3} maxDistance={10} />
            </Canvas>

            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.8)'
            }}>
              Drag to rotate 3D floorplan view
            </div>
          </div>

          <div className="modal-form-col">
            <h4 className="font-serif" style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>
              Layout & Features
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {villa.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '16px 0' }}>
              <div className="pool-feature-card">
                <div className="pool-feature-title">2 Bedrooms</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{villa.bedConfiguration}</div>
              </div>

              <div className="pool-feature-card">
                <div className="pool-feature-title">Living Room</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Air-conditioned & Smart TV</div>
              </div>

              <div className="pool-feature-card">
                <div className="pool-feature-title">Chef Kitchen</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nespresso, Stove & Fridge</div>
              </div>

              <div className="pool-feature-card">
                <div className="pool-feature-title">Luxury Bathroom</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rain shower & Toiletries</div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-light)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nightly Rate</span>
                <div className="total-price-tag">${villa.pricePerNight} <small style={{ fontSize: '0.9rem' }}>/ night</small></div>
              </div>
              <button className="btn-primary" onClick={() => { onClose(); }}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
