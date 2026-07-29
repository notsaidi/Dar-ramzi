import { useEffect, useRef, useState } from 'react';
import { menuItems, categories } from '../data/menu';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function MenuCard({ item, index, onSelect }) {
  const cardRef = useRef();

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 60, scale: 0.92 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.7,
        delay: (index % 4) * 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, [index]);

  return (
    <div className="menu-card" ref={cardRef}>
      <div className="menu-card-inner">
        {/* 3D pizza orb visual */}
        <div className="menu-card-visual" style={{ '--card-color': item.color }}>
          <div className="menu-card-orb" />
          <div className="menu-card-pizza-icon">🍕</div>
        </div>
        <div className="menu-card-body">
          <div className="menu-card-header">
            <h3 className="menu-card-name">{item.name}</h3>
            <span className="menu-card-price">${item.price}</span>
          </div>
          <span className="menu-card-tag" style={{ '--tag-color': item.color }}>
            {item.tag}
          </span>
          <p className="menu-card-desc">{item.description}</p>
          <button 
            className="menu-card-btn" 
            style={{ '--btn-color': item.color }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item);
            }}
          >
            Customize
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MenuSection({ onSelectMenuItem }) {
  const [active, setActive] = useState('All');
  const sectionRef = useRef();
  const headingRef = useRef();

  const filtered = active === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === active);

  useEffect(() => {
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      }
    );
  }, []);

  return (
    <section className="menu-section" id="menu" ref={sectionRef}>
      <div className="menu-section-header" ref={headingRef}>
        <span className="section-label">Explore</span>
        <h2 className="section-heading">THE MENU</h2>
        <p className="section-sub">Crafted with tradition, served with passion.</p>
      </div>

      <div className="menu-filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${active === cat ? 'filter-btn--active' : ''}`}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {filtered.map((item, i) => (
          <MenuCard key={item.id} item={item} index={i} onSelect={onSelectMenuItem} />
        ))}
      </div>
    </section>
  );
}
