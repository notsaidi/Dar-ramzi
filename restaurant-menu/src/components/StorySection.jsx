import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import PizzaModel from './PizzaModel';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stories = [
  {
    id: 'story-1',
    label: 'Our Philosophy',
    heading: 'PUREST\nPROVENANCE',
    body: 'Every ingredient traced to its source. Flour from the Mulino Caputo mills of Naples. Tomatoes grown in the volcanic soil of Campania. Buffalo mozzarella direct from Caserta dairies.',
    align: 'left',
    accentColor: '#DC2626',
  },
  {
    id: 'story-2',
    label: 'The Process',
    heading: 'TIME IS AN\nINGREDIENT',
    body: '72-hour cold-fermented dough gives our crust a light, airy structure and complex, tangy flavour that 2-hour dough simply cannot replicate. Patience is the secret recipe.',
    align: 'right',
    accentColor: '#CA8A04',
  },
  {
    id: 'story-3',
    label: 'Our Classics',
    heading: 'SIGNATURE\nPIZZAS',
    body: 'Perfected over years, ordered thousands of times, never changed. These are the dishes that made us who we are.',
    align: 'left',
    accentColor: '#DC2626',
    showModel: true,
  },
];

function StoryPanel({ story }) {
  const panelRef = useRef();
  const textRef = useRef();
  const modelRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(
        textRef.current.querySelector('.story-heading'),
        { opacity: 0, y: 80, skewY: 6 },
        {
          opacity: 1, y: 0, skewY: 0, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: panelRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
        }
      );
      // Label + body
      gsap.fromTo(
        textRef.current.querySelectorAll('.story-label, .story-body'),
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power2.out', delay: 0.2,
          scrollTrigger: { trigger: panelRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
        }
      );
      // 3D model panel
      if (modelRef.current) {
        gsap.fromTo(
          modelRef.current,
          { opacity: 0, scale: 0.7, y: -40 },
          {
            opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'back.out(1.4)',
            scrollTrigger: { trigger: panelRef.current, start: 'top 60%', toggleActions: 'play none none reverse' },
          }
        );
      }
    }, panelRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className={`story-panel story-panel--${story.align}`} ref={panelRef} id={story.id}>
      <div className="story-canvas-col" ref={modelRef}>
        <Canvas
          camera={{ position: [0, 1.5, 5], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent', width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[4, 6, 4]} intensity={1.6} color="#FFF5E0" />
          <pointLight position={[-3, 2, -2]} intensity={0.5} color={story.accentColor} />
          <PizzaModel scrollDriven={false} autoRotate={true} />
        </Canvas>
      </div>

      <div className="story-text-col" ref={textRef}>
        <span className="story-label" style={{ color: story.accentColor }}>
          {story.label}
        </span>
        <h2
          className="story-heading"
          style={{ '--accent': story.accentColor }}
        >
          {story.heading.split('\n').map((line, i) => (
            <span key={i} className="story-heading-line">{line}</span>
          ))}
        </h2>
        <p className="story-body">{story.body}</p>
      </div>
    </div>
  );
}

export default function StorySection() {
  return (
    <section className="story-section" id="story">
      {stories.map((story) => (
        <StoryPanel key={story.id} story={story} />
      ))}
    </section>
  );
}
