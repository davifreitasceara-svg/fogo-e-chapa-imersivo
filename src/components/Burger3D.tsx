import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Float, useCursor } from "@react-three/drei";
import * as THREE from "three";

function BurgerModel() {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  // Animated explode effect
  const explodeFactor = useRef(0);

  useFrame((state, delta) => {
    if (group.current) {
      // Auto-rotation slow
      group.current.rotation.y += delta * 0.15;
      
      // Smooth interpolation for the explode effect
      const target = hovered ? 1 : 0;
      explodeFactor.current = THREE.MathUtils.lerp(explodeFactor.current, target, 5 * delta);
      
      // Top Bun
      group.current.children[0].position.y = 1.9 + explodeFactor.current * 1.5;
      // Tomato
      group.current.children[1].position.y = 1.6 + explodeFactor.current * 1.0;
      // Onion
      group.current.children[2].position.y = 1.45 + explodeFactor.current * 0.8;
      // Lettuce
      group.current.children[3].position.y = 1.3 + explodeFactor.current * 0.5;
      // Cheese 1
      group.current.children[4].position.y = 1.1 + explodeFactor.current * 0.2;
      // Meat 1
      group.current.children[5].position.y = 0.8;
      // Cheese 2
      group.current.children[6].position.y = 0.5 - explodeFactor.current * 0.2;
      // Meat 2
      group.current.children[7].position.y = 0.2 - explodeFactor.current * 0.4;
      // Bottom Bun
      group.current.children[8].position.y = -0.3 - explodeFactor.current * 0.8;
    }
  });

  return (
    <group 
      ref={group} 
      dispose={null} 
      scale={1.6} 
      position={[0, -0.8, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 0. Pão Superior (Brioche com brilho) */}
      <mesh position={[0, 1.9, 0]}>
        <sphereGeometry args={[1.5, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2.1]} />
        <meshPhysicalMaterial color="#E6A15C" roughness={0.4} clearcoat={0.6} clearcoatRoughness={0.2} />
      </mesh>

      {/* 1. Tomates */}
      <group position={[0, 1.6, 0]}>
        <mesh position={[-0.5, 0, 0.5]} rotation={[0.1, 0, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.1, 32]} />
          <meshPhysicalMaterial color="#dc2626" roughness={0.2} transmission={0.1} thickness={0.5} />
        </mesh>
        <mesh position={[0.5, 0, -0.3]} rotation={[-0.1, 0, 0.1]}>
          <cylinderGeometry args={[0.7, 0.7, 0.1, 32]} />
          <meshPhysicalMaterial color="#dc2626" roughness={0.2} transmission={0.1} thickness={0.5} />
        </mesh>
      </group>

      {/* 2. Cebola Roxa */}
      <group position={[0, 1.45, 0]}>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.2, 0.08, 16, 64]} />
          <meshStandardMaterial color="#c026d3" roughness={0.5} />
        </mesh>
        <mesh position={[0.2, 0.05, 0.2]} rotation={[Math.PI / 2.1, 0, 0]}>
          <torusGeometry args={[0.9, 0.08, 16, 64]} />
          <meshStandardMaterial color="#c026d3" roughness={0.5} />
        </mesh>
      </group>

      {/* 3. Alface (Mais orgânico) */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[1.6, 1.6, 0.05, 64]} />
        <meshStandardMaterial color="#22c55e" roughness={0.9} />
        {Array.from({ length: 16 }).map((_, i) => (
          <mesh key={i} position={[Math.cos((i / 16) * Math.PI * 2) * 1.5, Math.sin(i * 123) * 0.1, Math.sin((i / 16) * Math.PI * 2) * 1.5]} rotation={[Math.random(), Math.random(), Math.random()]}>
            <boxGeometry args={[0.6, 0.1, 0.6]} />
            <meshStandardMaterial color="#22c55e" roughness={0.9} />
          </mesh>
        ))}
      </mesh>

      {/* 4. Queijo Cheddar 1 (Brilhante e "derretido") */}
      <mesh position={[0, 1.1, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[2.4, 0.06, 2.4]} />
        <meshPhysicalMaterial color="#f59e0b" roughness={0.2} clearcoat={0.3} />
        {/* Cantos caídos */}
        <mesh position={[1.2, -0.2, 1.2]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.5, 0.06, 0.5]} />
          <meshPhysicalMaterial color="#f59e0b" roughness={0.2} clearcoat={0.3} />
        </mesh>
        <mesh position={[-1.2, -0.2, -1.2]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.5, 0.06, 0.5]} />
          <meshPhysicalMaterial color="#f59e0b" roughness={0.2} clearcoat={0.3} />
        </mesh>
      </mesh>

      {/* 5. Carne 1 (Texturizada e escura) */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.45, 64]} />
        <meshStandardMaterial color="#381302" roughness={1} metalness={0.1} />
        {/* Adicionar textura rústica à borda */}
        {Array.from({ length: 30 }).map((_, i) => (
          <mesh key={i} position={[Math.cos((i / 30) * Math.PI * 2) * 1.48, (Math.random() - 0.5) * 0.3, Math.sin((i / 30) * Math.PI * 2) * 1.48]} rotation={[Math.random(), Math.random(), Math.random()]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial color="#290e01" roughness={1} />
          </mesh>
        ))}
      </mesh>

      {/* 6. Queijo Cheddar 2 */}
      <mesh position={[0, 0.5, 0]} rotation={[0, Math.PI / 3, 0]}>
        <boxGeometry args={[2.4, 0.06, 2.4]} />
        <meshPhysicalMaterial color="#f59e0b" roughness={0.2} clearcoat={0.3} />
      </mesh>

      {/* 7. Carne 2 */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.45, 64]} />
        <meshStandardMaterial color="#381302" roughness={1} metalness={0.1} />
        {/* Textura rústica à borda */}
        {Array.from({ length: 30 }).map((_, i) => (
          <mesh key={i} position={[Math.cos((i / 30) * Math.PI * 2) * 1.48, (Math.random() - 0.5) * 0.3, Math.sin((i / 30) * Math.PI * 2) * 1.48]} rotation={[Math.random(), Math.random(), Math.random()]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial color="#290e01" roughness={1} />
          </mesh>
        ))}
      </mesh>

      {/* 8. Pão Inferior */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[1.5, 1.4, 0.4, 64]} />
        <meshPhysicalMaterial color="#E6A15C" roughness={0.5} />
      </mesh>
    </group>
  );
}

export function Burger3D() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 2, 9], fov: 45 }}>
        <color attach="background" args={['transparent']} />
        
        {/* Iluminação Premium Estilo Estúdio */}
        <ambientLight intensity={0.4} />
        <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={2} castShadow color="#fff3e0" />
        <spotLight position={[-10, 5, -10]} angle={0.3} penumbra={1} intensity={1} color="#ffedd5" />
        <pointLight position={[0, -2, 0]} intensity={0.5} color="#ea580c" />
        
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <BurgerModel />
        </Float>
        
        <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={12} blur={2.5} far={4} color="#000000" />
        <Environment preset="studio" />
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          minDistance={5}
          maxDistance={12}
        />
      </Canvas>
    </div>
  );
}
