import { useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const qrRef = useRef();
  const footerRef = useRef();

  const currentUrl = typeof window !== 'undefined'
    ? window.location.href
    : 'https://piozza-restaurant.com/menu';

  useEffect(() => {
    gsap.fromTo(
      qrRef.current,
      { opacity: 0, scale: 0.8, y: 30 },
      {
        opacity: 1, scale: 1, y: 0, duration: 1, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: footerRef.current, start: 'top 80%' },
      }
    );
  }, []);

  return (
    <footer className="footer" ref={footerRef} id="contact">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">PIOZZA</div>
          <p className="footer-tagline">
            Neapolitan tradition. Modern precision.<br />
            Every slice tells a story.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-nav">
          <h4 className="footer-nav-title">Navigate</h4>
          <ul>
            <li><a href="#hero">Home</a></li>
            <li><a href="#story">Our Story</a></li>
            <li><a href="#menu">Menu</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-info">
          <h4 className="footer-nav-title">Visit Us</h4>
          <ul>
            <li>Via dei Tribunali 32, Napoli</li>
            <li>Mon – Fri: 12:00 – 23:00</li>
            <li>Sat – Sun: 11:00 – 24:00</li>
            <li>+39 081 123 4567</li>
          </ul>
        </div>

        <div className="footer-qr" ref={qrRef}>
          <div className="qr-card">
            <p className="qr-label">Scan to view menu</p>
            <div className="qr-wrapper">
              <QRCodeSVG
                value={currentUrl}
                size={130}
                bgColor="transparent"
                fgColor="#FFFFFF"
                level="M"
              />
            </div>
            <p className="qr-sub">Share this menu instantly</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2024 Piozza. Crafted with passion in Naples.</span>
        <span>All rights reserved.</span>
      </div>
    </footer>
  );
}
