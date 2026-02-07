import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Stars, Trail } from '@react-three/drei'
import * as THREE from 'three'

// Rotating Earth Globe
function Earth() {
  const meshRef = useRef()
  const cloudsRef = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    meshRef.current.rotation.y = time * 0.05
    cloudsRef.current.rotation.y = time * 0.07
    meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.05
  })

  return (
    <group>
      {/* Main Earth */}
      <Sphere ref={meshRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          color="#1a472a"
          roughness={0.7}
          metalness={0.2}
          emissive="#0a3d1f"
          emissiveIntensity={0.3}
        />
      </Sphere>

      {/* Cloud layer */}
      <Sphere ref={cloudsRef} args={[2.05, 64, 64]}>
        <MeshDistortMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
          distort={0.1}
          speed={2}
          roughness={1}
        />
      </Sphere>

      {/* Atmosphere glow */}
      <Sphere args={[2.3, 32, 32]}>
        <meshBasicMaterial
          color="#4a9eff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  )
}

// Orbiting Solar Panels with trails
function OrbitingSolarPanel({ radius, angle, speed, color }) {
  const groupRef = useRef()
  const panelRef = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const currentAngle = angle + time * speed
    groupRef.current.position.x = Math.cos(currentAngle) * radius
    groupRef.current.position.z = Math.sin(currentAngle) * radius
    groupRef.current.position.y = Math.sin(currentAngle * 2) * 0.5

    // Panel faces toward center
    groupRef.current.lookAt(0, 0, 0)
    panelRef.current.rotation.y = time * 0.5
  })

  return (
    <group ref={groupRef}>
      <Trail
        width={0.5}
        length={8}
        color={color}
        attenuation={(t) => t * t}
      >
        <group ref={panelRef}>
          {/* Solar Panel */}
          <mesh>
            <boxGeometry args={[1.2, 0.05, 0.8]} />
            <meshStandardMaterial
              color={color}
              metalness={0.9}
              roughness={0.1}
              emissive={color}
              emissiveIntensity={0.5}
            />
          </mesh>

          {/* Panel frame */}
          <mesh>
            <boxGeometry args={[1.3, 0.08, 0.9]} />
            <meshStandardMaterial
              color="#1a1a1a"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Glowing core */}
          <pointLight intensity={2} distance={5} color={color} />
        </group>
      </Trail>
    </group>
  )
}

// Energy particles flowing from Earth
function EnergyParticles() {
  const particlesRef = useRef()

  const particles = useMemo(() => {
    const temp = []
    const count = 200

    for (let i = 0; i < count; i++) {
      const radius = 2.5 + Math.random() * 8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      const size = Math.random() * 0.08 + 0.02
      const color = Math.random() > 0.5 ? '#ff9500' : '#00d4ff'

      temp.push({ position: [x, y, z], size, color })
    }
    return temp
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    particlesRef.current.rotation.y = time * 0.1
    particlesRef.current.rotation.x = Math.sin(time * 0.05) * 0.2
  })

  return (
    <group ref={particlesRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshBasicMaterial
            color={particle.color}
            transparent
            opacity={0.8}
          />
          <pointLight
            intensity={0.5}
            distance={2}
            color={particle.color}
          />
        </mesh>
      ))}
    </group>
  )
}

// Glowing Sun in the background
function Sun() {
  const meshRef = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    meshRef.current.rotation.y = time * 0.1

    // Pulsing effect
    const scale = 1 + Math.sin(time * 2) * 0.05
    glowRef.current.scale.set(scale, scale, scale)
  })

  return (
    <group position={[15, 8, -20]}>
      {/* Sun core */}
      <Sphere ref={meshRef} args={[3, 32, 32]}>
        <MeshDistortMaterial
          color="#ff6b00"
          emissive="#ff6b00"
          emissiveIntensity={2}
          distort={0.4}
          speed={2}
        />
      </Sphere>

      {/* Sun glow */}
      <Sphere ref={glowRef} args={[4, 32, 32]}>
        <meshBasicMaterial
          color="#ffaa00"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Sun light */}
      <pointLight intensity={3} distance={50} color="#ffaa00" />
    </group>
  )
}

// Orbital rings
function OrbitalRings() {
  const rings = useMemo(() => {
    return [
      { radius: 4, color: '#ff9500', opacity: 0.15 },
      { radius: 5.5, color: '#00d4ff', opacity: 0.12 },
      { radius: 7, color: '#9500ff', opacity: 0.1 },
    ]
  }, [])

  return (
    <group>
      {rings.map((ring, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[ring.radius, 0.02, 16, 100]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={ring.opacity}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function SolarScene3D() {
  return (
    <div className="fixed inset-0 w-full h-full -z-10">
      <Canvas
        camera={{ position: [0, 3, 12], fov: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        {/* Background - Deep space */}
        <color attach="background" args={['#0a0a1a']} />
        <fog attach="fog" args={['#0a0a1a', 10, 50]} />

        {/* Stars */}
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0.5}
          fade
          speed={0.5}
        />

        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4a9eff" />

        {/* Main Scene Objects */}
        <Earth />
        <Sun />
        <OrbitalRings />
        <EnergyParticles />

        {/* Multiple Orbiting Solar Panels */}
        <OrbitingSolarPanel radius={4} angle={0} speed={0.3} color="#ff9500" />
        <OrbitingSolarPanel radius={4} angle={Math.PI} speed={0.3} color="#ff9500" />
        <OrbitingSolarPanel radius={5.5} angle={Math.PI / 2} speed={0.25} color="#00d4ff" />
        <OrbitingSolarPanel radius={5.5} angle={Math.PI * 1.5} speed={0.25} color="#00d4ff" />
        <OrbitingSolarPanel radius={7} angle={Math.PI / 4} speed={0.2} color="#9500ff" />
        <OrbitingSolarPanel radius={7} angle={Math.PI * 1.25} speed={0.2} color="#9500ff" />

        {/* Camera auto-rotation */}
        <CameraController />
      </Canvas>
    </div>
  )
}

// Camera controller for smooth movement
function CameraController() {
  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // Gentle camera movement
    state.camera.position.x = Math.sin(time * 0.05) * 2
    state.camera.position.y = 3 + Math.sin(time * 0.07) * 1
    state.camera.lookAt(0, 0, 0)
  })

  return null
}
