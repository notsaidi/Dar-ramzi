import { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, useTexture } from '@react-three/drei';
import * as THREE from 'three';

function Plate() {
  return (
    <group position={[0, -0.15, 0]}>
      {/* Plate Base */}
      <mesh receiveShadow>
        <cylinderGeometry args={[3.0, 2.7, 0.1, 64]} />
        <meshStandardMaterial color="#E8E8E8" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Plate Rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <torusGeometry args={[2.9, 0.1, 16, 64]} />
        <meshStandardMaterial color="#F5F5F5" roughness={0.2} metalness={0.1} />
      </mesh>
    </group>
  );
}

function PhotorealisticPizzaMesh() {
  const texture = useTexture('/pizza-texture.png');
  texture.colorSpace = THREE.SRGBColorSpace;
  
  // Materials: [side, top, bottom]
  const materials = [
    new THREE.MeshStandardMaterial({ color: '#A05020', roughness: 0.9, metalness: 0 }),
    new THREE.MeshStandardMaterial({ map: texture, roughness: 0.3, metalness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: '#703010', roughness: 1.0, metalness: 0 })
  ];

  return (
    <mesh position={[0, 0.05, 0]} castShadow receiveShadow material={materials}>
      {/* 
        The pizza fills the square image, so mapping it to the top circle 
        of the cylinder creates a perfect 3D pizza!
      */}
      <cylinderGeometry args={[2.5, 2.45, 0.1, 64]} />
    </mesh>
  );
}

function PizzaGroup({ scrollDriven, autoRotate, showPlate }) {
  const groupRef = useRef();
  const scroll = scrollDriven ? useScroll() : null;

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    if (autoRotate) {
      groupRef.current.rotation.y += delta * 0.3;
    }
    if (scrollDriven && scroll) {
      const offset = scroll.offset;
      groupRef.current.rotation.y = offset * Math.PI * 3;
      groupRef.current.position.y = Math.sin(offset * Math.PI) * 0.3;
      groupRef.current.scale.setScalar(0.8 + offset * 0.4);
    }
    // Gentle float if not scrolling or not in configurator
    if (!scrollDriven && !showPlate) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <group ref={groupRef} rotation={showPlate ? [0, 0, 0] : [0.45, 0, 0]}>
      {showPlate && <Plate />}
      <PhotorealisticPizzaMesh />
    </group>
  );
}

export default function PizzaModel(props) {
  return (
    <Suspense fallback={null}>
      <PizzaGroup {...props} />
    </Suspense>
  );
}
