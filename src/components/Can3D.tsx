import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, RenderTexture, Text, OrthographicCamera, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

interface Can3DProps {
  drink: {
    name: string;
    color: string;
    logoText: string;
    subTitle: string;
    description: string;
    icon: string;
  }
  isCenter?: boolean;
  index?: number;
}

// Custom Mango Icon using basic 3D shapes drawn into the 2D texture
function MangoIconGraphic() {
  return (
    <group position={[-0.15, 1.1, 0]} rotation={[0, 0, 0.3]} scale={[1.2, 1.2, 1]}>
      {/* Mango Body Oval (Background) */}
      <mesh scale={[1, 1.4, 1]}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color="#FFCA28" />
      </mesh>
      {/* Mango Outline */}
      <mesh scale={[1, 1.4, 1]}>
        <ringGeometry args={[0.42, 0.5, 32]} />
        <meshBasicMaterial color="#E65100" />
      </mesh>
      {/* Slices (horizontal lines) */}
      {[-0.35, -0.1, 0.15, 0.4].map((y, i) => (
         <mesh key={i} position={[0, y, 0]} rotation={[0, 0, -0.1]}>
           <planeGeometry args={[0.7 - Math.abs(y)*0.6, 0.05]} />
           <meshBasicMaterial color="#E65100" />
         </mesh>
      ))}
      {/* Leaf */}
      <mesh position={[-0.15, 0.75, 0]} rotation={[0, 0, -0.6]}>
        <circleGeometry args={[0.2, 3]} />
        <meshBasicMaterial color="#4ADE80" />
      </mesh>
    </group>
  )
}

function LemonIconGraphic() {
  return (
    <group position={[-0.15, 1.1, 0]} rotation={[0, 0, -0.2]} scale={[1.2, 1.2, 1]}>
      <mesh scale={[1, 1, 1]}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color="#FFEB3B" />
      </mesh>
      <mesh scale={[1, 1, 1]}>
        <ringGeometry args={[0.42, 0.5, 32]} />
        <meshBasicMaterial color="#FBC02D" />
      </mesh>
      {[-0.35, -0.1, 0.15, 0.4].map((y, i) => (
         <mesh key={i} position={[0, y, 0]} rotation={[0, 0, 0.2]}>
           <planeGeometry args={[0.7 - Math.abs(y)*0.6, 0.05]} />
           <meshBasicMaterial color="#FBC02D" />
         </mesh>
      ))}
      <mesh position={[0.2, 0.5, 0]} rotation={[0, 0, -0.4]}>
        <circleGeometry args={[0.15, 3]} />
        <meshBasicMaterial color="#4ADE80" />
      </mesh>
    </group>
  )
}

function OrangeIconGraphic() {
  return (
    <group position={[-0.15, 1.1, 0]} rotation={[0, 0, 0.1]} scale={[1.2, 1.2, 1]}>
      <mesh scale={[1, 1, 1]}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color="#FF9800" />
      </mesh>
      <mesh scale={[1, 1, 1]}>
        <ringGeometry args={[0.42, 0.5, 32]} />
        <meshBasicMaterial color="#E65100" />
      </mesh>
      {[-0.35, -0.1, 0.15, 0.4].map((y, i) => (
         <mesh key={i} position={[0, y, 0]} rotation={[0, 0, -0.2]}>
           <planeGeometry args={[0.7 - Math.abs(y)*0.6, 0.05]} />
           <meshBasicMaterial color="#E65100" />
         </mesh>
      ))}
      <mesh position={[-0.1, 0.6, 0]} rotation={[0, 0, 0.4]}>
        <circleGeometry args={[0.15, 3]} />
        <meshBasicMaterial color="#4ADE80" />
      </mesh>
    </group>
  )
}

function StrawberryIconGraphic() {
  return (
    <group position={[-0.15, 0.95, 0]} rotation={[0, 0, 0.3]} scale={[1.3, 1.3, 1]}>
      <mesh scale={[1, 1.2, 1]}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
      <mesh scale={[1, 1.2, 1]}>
        <ringGeometry args={[0.42, 0.5, 32]} />
        <meshBasicMaterial color="#B91C1C" />
      </mesh>
      {[-0.35, -0.1, 0.15, 0.4].map((y, i) => (
         <mesh key={i} position={[0, y, 0]} rotation={[0, 0, -0.1]}>
           <planeGeometry args={[0.7 - Math.abs(y)*0.6, 0.05]} />
           <meshBasicMaterial color="#B91C1C" />
         </mesh>
      ))}
      <mesh position={[-0.15, 0.7, 0]} rotation={[0, 0, -0.6]}>
        <circleGeometry args={[0.2, 3]} />
        <meshBasicMaterial color="#4ADE80" />
      </mesh>
    </group>
  )
}

function GrapeIconGraphic() {
  return (
    <group position={[-0.15, 0.95, 0]} rotation={[0, 0, 0.3]} scale={[1.2, 1.2, 1]}>
      <mesh scale={[1, 1.1, 1]}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color="#A855F7" />
      </mesh>
      <mesh scale={[1, 1.1, 1]}>
        <ringGeometry args={[0.42, 0.5, 32]} />
        <meshBasicMaterial color="#7E22CE" />
      </mesh>
      {[-0.35, -0.1, 0.15, 0.4].map((y, i) => (
         <mesh key={i} position={[0, y, 0]} rotation={[0, 0, -0.1]}>
           <planeGeometry args={[0.7 - Math.abs(y)*0.6, 0.05]} />
           <meshBasicMaterial color="#7E22CE" />
         </mesh>
      ))}
      <mesh position={[-0.15, 0.65, 0]} rotation={[0, 0, -0.6]}>
        <circleGeometry args={[0.2, 3]} />
        <meshBasicMaterial color="#4ADE80" />
      </mesh>
    </group>
  )
}

function CanMesh({ drink, vIndex, viewMode }: { drink: any, vIndex: number, viewMode?: 'carousel' | 'detail' }) {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
     if (!meshRef.current) return;
     
     // Center can is vIndex === 2
     const diff = vIndex - 2; 

     const isDetail = viewMode === 'detail';

     // Calculate target position based on distance from center
     let targetX = diff * 4.0; 
     if (diff !== 0) {
       // Add an extra horizontal gap specifically between the center and its direct neighbors
       targetX += diff > 0 ? 0.8 : -0.8;
       // Scroll effect: Cans on the side fly massively outward in detail view
       if (isDetail) {
         targetX += (diff > 0 ? 15 : -15);
       }
     } else {
       // Center can: Shift left slightly to make room for the fruit image on the right
       if (isDetail) {
         targetX = -1.2;
       }
     }

     const targetY = -0.2 + Math.abs(diff) * 0.4; 
     
     // Center can at 0, others pushed back
     const targetZ = vIndex === 2 ? 0.0 : -Math.abs(diff) * 4.2; 
     
     // Tilted outward
     const targetRotZ = -diff * 0.18; 
     // Face slightly towards center
     const targetRotY = Math.PI + 0.15 + diff * 0.4; 

     // Shrink slightly in detail mode to match reference
     const targetScale = vIndex === 2 ? (isDetail ? 0.9 : 1.0) : 0.85 - Math.abs(diff) * 0.1;

     meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, targetX, 5, delta);
     meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetY, 5, delta);
     meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, targetZ, 5, delta);
     
     meshRef.current.rotation.z = THREE.MathUtils.damp(meshRef.current.rotation.z, targetRotZ, 5, delta);
     meshRef.current.rotation.y = THREE.MathUtils.damp(meshRef.current.rotation.y, targetRotY, 5, delta);
     
     meshRef.current.scale.setScalar(THREE.MathUtils.damp(meshRef.current.scale.x, targetScale, 5, delta));
  });

  // Calculate dynamic font size to prevent long words from wrapping
  const calculatedFontSize = Math.min(2.0, 7.0 / drink.logoText.length);

  return (
    <group ref={meshRef} position={[0, -0.2, 0]}>
      {/* --- MAIN CYLINDER BODY (LABEL) --- */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 4.0, 64]} />
        <meshPhysicalMaterial 
          metalness={0.35} 
          roughness={0.15} 
          clearcoat={1.0} 
          clearcoatRoughness={0.15} 
          envMapIntensity={1.5} 
        >
          <RenderTexture attach="map" anisotropy={16} frames={2}>
            <OrthographicCamera makeDefault left={-3.14} right={3.14} top={2.0} bottom={-2.0} position={[0, 0, 5]} />
            <color attach="background" args={[drink.color]} />
            
            <ambientLight intensity={2.0} />
            
            <mesh position={[0, 1.98, 0]}>
              <planeGeometry args={[10, 0.04]} />
              <meshBasicMaterial color="#000000" opacity={0.15} transparent />
            </mesh>

            <mesh position={[1.2, 1.2, 0]}>
              <circleGeometry args={[0.06, 32]} />
              <meshBasicMaterial color="#FDF5E6" opacity={0.8} transparent />
            </mesh>
            <mesh position={[1.4, 0.8, 0]}>
              <circleGeometry args={[0.04, 32]} />
              <meshBasicMaterial color="#FDF5E6" opacity={0.6} transparent />
            </mesh>
            <mesh position={[1.0, 0.4, 0]}>
              <circleGeometry args={[0.03, 32]} />
              <meshBasicMaterial color="#FDF5E6" opacity={0.5} transparent />
            </mesh>

            {drink.icon === '🥭' && <MangoIconGraphic />}
            {drink.icon === '🍋' && <LemonIconGraphic />}
            {drink.icon === '🍊' && <OrangeIconGraphic />}
            {drink.icon === '🍓' && <StrawberryIconGraphic />}
            {drink.icon === '🍇' && <GrapeIconGraphic />}

            {/* Logo Text - Shiny Reflection/Emboss Effect */}
            <Text 
              position={[-0.17, 0.17, 0]} 
              fontSize={calculatedFontSize * 0.65} 
              color="#ffffff" 
              letterSpacing={-0.02}
              outlineWidth={0.035} 
              outlineColor="#ffffff"
              anchorX="center"
              anchorY="middle"
              fillOpacity={0.6}
            >
              {drink.logoText}
            </Text>

            {/* Logo Text - Main */}
            <Text 
              position={[-0.15, 0.15, 0.01]} 
              fontSize={calculatedFontSize * 0.65} 
              color="#4A3219" 
              letterSpacing={-0.02}
              outlineWidth={0.03} 
              outlineColor="#4A3219"
              anchorX="center"
              anchorY="middle"
            >
              {drink.logoText}
            </Text>

            {/* Bottom Cream Band */}
            <mesh position={[0, -1.4, 0]}>
              <planeGeometry args={[10, 1.2]} />
              <meshBasicMaterial color="#FDF5E6" />
            </mesh>

            {/* Bottom dark line seam */}
            <mesh position={[0, -1.98, 0]}>
              <planeGeometry args={[10, 0.04]} />
              <meshBasicMaterial color="#000000" opacity={0.1} transparent />
            </mesh>

            {/* SubTitle Text - Highlight/Reflection */}
            <Text 
              position={[-0.17, -1.03, 0.09]} 
              fontSize={0.35} 
              color="#ffffff" 
              letterSpacing={-0.02}
              outlineWidth={0.025}
              outlineColor="#ffffff"
              anchorX="center"
              anchorY="middle"
              fillOpacity={0.9}
            >
              {drink.subTitle}
            </Text>
            {/* SubTitle Text - Main */}
            <Text 
              position={[-0.15, -1.05, 0.1]} 
              fontSize={0.35} 
              color="#1A1A1A" 
              letterSpacing={-0.02}
              outlineWidth={0.02}
              outlineColor="#1A1A1A"
              anchorX="center"
              anchorY="middle"
            >
              {drink.subTitle}
            </Text>

            {/* Description Text - Highlight/Reflection */}
            <Text 
              position={[-0.16, -1.48, 0.09]} 
              fontSize={0.18} 
              color="#ffffff" 
              fontWeight="bold"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.01}
              outlineColor="#ffffff"
              fillOpacity={0.9}
            >
              {drink.description}
            </Text>
            {/* Description Text - Main */}
            <Text 
              position={[-0.15, -1.5, 0.1]} 
              fontSize={0.18} 
              color="#1A1A1A" 
              fontWeight="bold"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.005}
              outlineColor="#1A1A1A"
            >
              {drink.description}
            </Text>
          </RenderTexture>
        </meshPhysicalMaterial>
      </mesh>

      {/* --- TOP METAL SECTION (Brushed Aluminum) --- */}
      <group>
        <mesh position={[0, 2.15, 0]}>
          <cylinderGeometry args={[0.88, 1.0, 0.3, 64]} />
          <meshStandardMaterial metalness={0.6} roughness={0.25} color="#e6e6e6" envMapIntensity={1.5} />
        </mesh>
        <mesh position={[0, 2.31, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.87, 0.04, 32, 64]} />
          <meshStandardMaterial metalness={0.6} roughness={0.25} color="#e6e6e6" envMapIntensity={1.5} />
        </mesh>
        <mesh position={[0, 2.29, 0]}>
          <cylinderGeometry args={[0.86, 0.86, 0.05, 64]} />
          <meshStandardMaterial metalness={0.6} roughness={0.3} color="#cccccc" envMapIntensity={1.5} />
        </mesh>
        
        <mesh position={[0, 2.32, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
           <torusGeometry args={[0.12, 0.02, 16, 32]} />
           <meshStandardMaterial metalness={0.7} roughness={0.2} color="#ffffff" envMapIntensity={1.5} />
        </mesh>
        <mesh position={[0, 2.32, 0.05]}>
           <boxGeometry args={[0.12, 0.015, 0.3]} />
           <meshStandardMaterial metalness={0.7} roughness={0.2} color="#ffffff" envMapIntensity={1.5} />
        </mesh>
        <mesh position={[0, 2.32, -0.1]}>
           <circleGeometry args={[0.08, 16]} rotation={[-Math.PI/2, 0, 0]} />
           <meshStandardMaterial metalness={0.7} roughness={0.2} color="#ffffff" envMapIntensity={1.5} />
        </mesh>
      </group>

      {/* --- BOTTOM METAL SECTION --- */}
      <group>
        <mesh position={[0, -2.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.95, 0.05, 32, 64]} />
          <meshStandardMaterial metalness={0.6} roughness={0.25} color="#e6e6e6" envMapIntensity={1.5} />
        </mesh>
        <mesh position={[0, -2.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.9, 0.03, 16, 64]} />
          <meshStandardMaterial metalness={0.6} roughness={0.25} color="#e6e6e6" envMapIntensity={1.5} />
        </mesh>
        <mesh position={[0, -2.05, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 0.05, 64]} />
          <meshStandardMaterial metalness={0.6} roughness={0.3} color="#cccccc" envMapIntensity={1.5} />
        </mesh>
      </group>
    </group>
  )
}

export function Can3DScene({ drinks, activeIndex, singleMode = false, viewMode = 'carousel' }: { drinks: any[], activeIndex: number, singleMode?: boolean, viewMode?: 'carousel' | 'detail' }) {
  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [0, 0, 10.0], fov: 35 }}>
        
        <ambientLight intensity={0.9} />
        
        <spotLight 
          position={[4, 2, 8]} 
          intensity={4.0} 
          angle={0.3} 
          penumbra={0.5} 
          castShadow 
        />
        
        <spotLight 
          position={[-8, 2, 5]} 
          intensity={1.8} 
          penumbra={1} 
          color="#fff5e6" 
        />
        
        <spotLight 
          position={[8, 0, -5]} 
          intensity={2.5} 
          angle={0.5} 
          penumbra={1} 
          color="#ffffff" 
        />
        
        <Environment preset="city" blur={0.15} />
        
        <spotLight 
          position={[0, 5, 5]} 
          intensity={3.0} 
          angle={0.8} 
          penumbra={0.2} 
          color="#ffffff" 
        />
        
        {drinks.map((drink, index) => {
          let vIndex = (index - activeIndex + 2 + drinks.length) % drinks.length;
          
          // In single mode, only render the center can (vIndex === 2)
          if (singleMode && vIndex !== 2) return null;

          return (
            <CanMesh key={drink.id + '-' + index} drink={drink} vIndex={vIndex} viewMode={viewMode} />
          );
        })}
        
        {/* Ground shadow for ultra-realism */}
        <ContactShadows 
          position={[0, -2.3, 0]} 
          opacity={0.5} 
          scale={15} 
          blur={2} 
          far={4} 
          resolution={256}
        />
      </Canvas>
    </div>
  )
}
