import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Environment, Stars } from '@react-three/drei';
import PizzaModel from './PizzaModel';

export default function HeroSection() {
  const [webGLSupported] = useState(() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  });

  return (
    <section className="hero-section" id="hero">
      <div className="hero-canvas-wrapper">
        {webGLSupported ? (
          <Canvas
            camera={{ position: [0, 2, 6], fov: 50 }}
            dpr={[1, 2]}
            shadows
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[5, 8, 5]}
              intensity={1.8}
              color="#FFF5E0"
              castShadow
              shadow-bias={-0.0005}
            />
            <pointLight position={[-4, 3, -3]} intensity={0.6} color="#DC2626" />
            <pointLight position={[4, -2, 4]} intensity={0.4} color="#CA8A04" />
            <Stars radius={80} depth={30} count={800} factor={3} saturation={0} fade speed={0.5} />
            <PizzaModel scrollDriven={false} autoRotate={true} />
          </Canvas>
        ) : (
          <div className="hero-fallback">
            <div className="pizza-emoji-fallback">🍕</div>
          </div>
        )}
      </div>

      <div className="hero-content">
        <span className="hero-label">Est. 2018 · Napoli Inspired</span>
        <h1 className="hero-heading">
          THE PERFECT<br />
          <span className="hero-heading-accent">SLICE</span>
        </h1>
        <p className="hero-sub">
          72-hour cold-fermented dough. San Marzano tomatoes.<br />
          Wood-fired at 450°C. This is not fast food.
        </p>
        <div className="hero-actions">
          <a href="#menu" className="btn-primary">View Menu</a>
          <a href="#story" className="btn-ghost">Our Story</a>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
