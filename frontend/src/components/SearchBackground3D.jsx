import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Sphere } from '@react-three/drei'
import * as THREE from 'three'

// Animated Sun
function Sun() {
  const sunRef = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (sunRef.current) {
      sunRef.current.scale.setScalar(1 + Math.sin(time * 0.5) * 0.1)
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.2 + Math.sin(time * 0.3) * 0.15)
    }
  })

  return (
    <group position={[8, 6, -5]}>
      {/* Sun core - MUCH BRIGHTER */}
      <Sphere ref={sunRef} args={[2.5, 32, 32]}>
        <meshBasicMaterial color="#FFD700" toneMapped={false} />
      </Sphere>

      {/* Sun glow - MORE VISIBLE */}
      <Sphere ref={glowRef} args={[3.5, 32, 32]}>
        <meshBasicMaterial color="#FFA500" transparent opacity={0.6} toneMapped={false} />
      </Sphere>

      {/* Outer glow - MORE VISIBLE */}
      <Sphere args={[4.5, 32, 32]}>
        <meshBasicMaterial color="#FF8C00" transparent opacity={0.4} toneMapped={false} />
      </Sphere>

      {/* Point light from sun - BRIGHTER */}
      <pointLight color="#FFA500" intensity={5} distance={50} />
      <pointLight color="#FFD700" intensity={3} distance={30} />
    </group>
  )
}

// Solar Panel Grid
function SolarPanelGrid() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = -Math.PI / 3
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1
    }
  })

  const panels = useMemo(() => {
    const temp = []
    for (let x = -6; x < 6; x++) {
      for (let z = -3; z < 3; z++) {
        temp.push({ x: x * 1.2, z: z * 1.2 })
      }
    }
    return temp
  }, [])

  return (
    <group ref={groupRef} position={[0, -5, -8]}>
      {panels.map((pos, i) => (
        <SolarPanel key={i} position={[pos.x, 0, pos.z]} index={i} />
      ))}
    </group>
  )
}

function SolarPanel({ position, index }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime()
      meshRef.current.material.emissiveIntensity = 0.3 + Math.sin(time * 2 + index * 0.3) * 0.2
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 0.05, 1]} />
      <meshStandardMaterial
        color="#3b82f6"
        emissive="#06b6d4"
        emissiveIntensity={0.8}
        metalness={0.9}
        roughness={0.1}
        toneMapped={false}
      />
    </mesh>
  )
}

// Energy Particles
function EnergyParticles() {
  const particlesRef = useRef()

  const particleCount = 200
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = Math.random() * 20 - 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    return pos
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += 0.02
        if (positions[i * 3 + 1] > 10) {
          positions[i * 3 + 1] = -10
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#FFD700"
        transparent
        opacity={1}
        sizeAttenuation={true}
        toneMapped={false}
      />
    </points>
  )
}

// Floating Solar Panel Icons
function FloatingPanels() {
  const panels = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 20 - 5
      ],
      speed: 0.2 + Math.random() * 0.3,
      offset: Math.random() * Math.PI * 2
    }))
  }, [])

  return (
    <>
      {panels.map((panel, i) => (
        <FloatingPanel key={i} {...panel} />
      ))}
    </>
  )
}

function FloatingPanel({ position, speed, offset }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime()
      meshRef.current.position.y = position[1] + Math.sin(time * speed + offset) * 2
      meshRef.current.rotation.y = time * 0.5
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.8, 0.05, 0.8]} />
      <meshStandardMaterial
        color="#f97316"
        emissive="#fb923c"
        emissiveIntensity={1.2}
        transparent
        opacity={0.6}
        metalness={0.8}
        roughness={0.2}
        toneMapped={false}
      />
    </mesh>
  )
}

// Main Scene Component
export default function SearchBackground3D() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 2, 10], fov: 75 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        {/* Background color - MUCH BRIGHTER */}
        <color attach="background" args={['#1a1a3e']} />
        <fog attach="fog" args={['#1a1a3e', 15, 50]} />

        {/* Stars */}
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={6}
          saturation={0.8}
          fade
          speed={1}
        />

        {/* Lighting - MUCH BRIGHTER */}
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#FFA500" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#06b6d4" />
        <pointLight position={[0, 0, 5]} intensity={0.5} color="#FFD700" />

        {/* 3D Elements */}
        <Sun />
        <SolarPanelGrid />
        <EnergyParticles />
        <FloatingPanels />
      </Canvas>
    </div>
  )
}
