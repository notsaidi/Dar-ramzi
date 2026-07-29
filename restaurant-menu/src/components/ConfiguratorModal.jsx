import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import PizzaModel from './PizzaModel';
import gsap from 'gsap';

export default function ConfiguratorModal({ item, onClose }) {
  const modalRef = useRef();
  
  // Set initial state based on item name
  const isMargherita = item.name.includes('Margherita');
  const isDiavola = item.name.includes('Diavola');
  const isTartufo = item.name.includes('Tartufo');

  const defaultIngredients = useMemo(() => ({
    cheese: true,
    pepperoni: isDiavola || (!isMargherita && !isTartufo),
    basil: isMargherita || isDiavola,
    olive: isTartufo || (!isMargherita && !isDiavola)
  }), [isMargherita, isDiavola, isTartufo]);
  
  const [ingredients, setIngredients] = useState(defaultIngredients);

  const ingredientPrices = {
    cheese: 2,
    pepperoni: 2.5,
    basil: 1,
    olive: 1.5
  };

  const totalPrice = useMemo(() => {
    let price = item.price;
    Object.keys(ingredients).forEach(key => {
      // Add price extra if ingredient is enabled but was not in base defaults
      if (ingredients[key] && !defaultIngredients[key]) {
        price += ingredientPrices[key];
      }
    });
    return price;
  }, [ingredients, defaultIngredients, item.price]);

  const toggleIngredient = (key) => {
    setIngredients(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    gsap.fromTo(modalRef.current, 
      { opacity: 0, backdropFilter: 'blur(0px)' }, 
      { opacity: 1, backdropFilter: 'blur(10px)', duration: 0.4, ease: 'power2.out' }
    );
  }, []);

  const handleClose = () => {
    gsap.to(modalRef.current, { 
      opacity: 0, 
      backdropFilter: 'blur(0px)', 
      duration: 0.3, 
      ease: 'power2.in',
      onComplete: onClose
    });
  };

  return (
    <div className="configurator-modal" ref={modalRef}>
      <button className="configurator-close" onClick={handleClose}>
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className="configurator-content">
        <div className="configurator-canvas">
          <Canvas camera={{ position: [0, 4, 6], fov: 45 }} shadows>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0005} />
            <pointLight position={[-3, 2, -2]} intensity={0.5} color="#CA8A04" />
            
            <PizzaModel 
              scrollDriven={false} 
              autoRotate={true}
              showPlate={true}
              hasCheese={ingredients.cheese}
              hasPepperoni={ingredients.pepperoni}
              hasBasil={ingredients.basil}
              hasOlive={ingredients.olive}
            />
            
            <ContactShadows position={[0, -0.15, 0]} opacity={0.4} scale={10} blur={2} far={4} />
            <OrbitControls 
              enablePan={false} 
              enableZoom={true} 
              minDistance={3} 
              maxDistance={10}
              minPolarAngle={Math.PI / 6} 
              maxPolarAngle={Math.PI / 2 - 0.1}
            />
          </Canvas>
          <div className="configurator-hint">Drag to rotate • Scroll to zoom</div>
        </div>

        <div className="configurator-sidebar">
          <div className="configurator-header">
            <span className="configurator-tag">{item.tag}</span>
            <h2 className="configurator-title">Customize<br/>{item.name}</h2>
            <p className="configurator-desc">{item.description}</p>
          </div>

          <div className="configurator-options">
            <h3 className="options-title">Ingredients</h3>
            
            <div className="option-item">
              <span className="option-label">Extra Cheese {!defaultIngredients.cheese && <small className="price-tag">+$2.00</small>}</span>
              <button 
                className={`toggle-btn ${ingredients.cheese ? 'active' : ''}`}
                onClick={() => toggleIngredient('cheese')}
              >
                <div className="toggle-knob"></div>
              </button>
            </div>
            
            <div className="option-item">
              <span className="option-label">Spicy Pepperoni {!defaultIngredients.pepperoni && <small className="price-tag">+$2.50</small>}</span>
              <button 
                className={`toggle-btn ${ingredients.pepperoni ? 'active' : ''}`}
                onClick={() => toggleIngredient('pepperoni')}
              >
                <div className="toggle-knob"></div>
              </button>
            </div>
            
            <div className="option-item">
              <span className="option-label">Fresh Basil {!defaultIngredients.basil && <small className="price-tag">+$1.00</small>}</span>
              <button 
                className={`toggle-btn ${ingredients.basil ? 'active' : ''}`}
                onClick={() => toggleIngredient('basil')}
              >
                <div className="toggle-knob"></div>
              </button>
            </div>
            
            <div className="option-item">
              <span className="option-label">Black Olives {!defaultIngredients.olive && <small className="price-tag">+$1.50</small>}</span>
              <button 
                className={`toggle-btn ${ingredients.olive ? 'active' : ''}`}
                onClick={() => toggleIngredient('olive')}
              >
                <div className="toggle-knob"></div>
              </button>
            </div>
          </div>

          <div className="configurator-footer">
            <div className="configurator-price">${totalPrice % 1 === 0 ? totalPrice : totalPrice.toFixed(2)}</div>
            <button className="btn-primary w-full" onClick={handleClose}>Confirm & Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}

