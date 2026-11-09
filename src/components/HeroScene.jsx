import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { heroContent, personalInfo } from '../data/portfolioData'

/**
 * Large Portal 3D Signal Sphere with Integrated Portrait & Orbiting Skills.
 * Features:
 * - Portrait photo fills the entire circle out to the edges (face centered with shoulders visible)
 * - Rotating orange 3D wireframe sphere rendered directly over the portrait as an overlay
 * - Radial transparency mask softens wireframe over the face so features remain crystal clear
 * - Thin glowing orange ring around the circular perimeter
 * - Large, high-contrast, sharp skill labels orbiting outside the sphere
 * - Kinetic drag-to-rotate with smooth inertia physics
 * - ⚡ BOOST and ↺ RESET action controls
 * - Proportional scaling and lightweight animation mode on mobile devices
 */
export default function HeroScene() {
  const sphereContainerRef = useRef(null)
  const canvasRef = useRef(null)
  const pitchRef = useRef(null)
  const yawRef = useRef(null)
  const stateRef = useRef(null)
  const boostActionRef = useRef(null)
  const resetActionRef = useRef(null)
  const skillRefs = useRef([])

  const skills = heroContent.orbitSkills || [
    'Python',
    'SQL',
    'JavaScript',
    'HTML/CSS',
    'MySQL',
    'Git',
  ]

  useEffect(() => {
    const canvasWrap = canvasRef.current
    if (!canvasWrap) return

    // 1. Detect reduced motion preference & mobile screen width
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768

    // 2. Three.js Scene Setup
    const scene = new THREE.Scene()
    const width = canvasWrap.clientWidth || 300
    const height = canvasWrap.clientHeight || 300

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
    camera.position.z = 5.3

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true })
    renderer.setSize(width, height, false)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
    canvasWrap.appendChild(renderer.domElement)

    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'

    // 3. 3D Wireframe Sphere Group
    const group = new THREE.Group()
    scene.add(group)

    // (1) Primary Orange Wireframe Sphere (Icosahedron calibrated to touch sphere boundary)
    const sphereRadius = 1.9
    const icosaGeom = new THREE.IcosahedronGeometry(sphereRadius, 1)
    const edgesGeom = new THREE.EdgesGeometry(icosaGeom)
    const outerMaterial = new THREE.LineBasicMaterial({
      color: 0xff5b1f,
      transparent: true,
      opacity: prefersReducedMotion ? 0.7 : 0.6,
      linewidth: 1.5,
    })
    const outerWireframe = new THREE.LineSegments(edgesGeom, outerMaterial)
    group.add(outerWireframe)

    // (2) Glowing Orange Node Beads at the 12 icosahedron vertices
    const pointsGeom = new THREE.IcosahedronGeometry(sphereRadius, 1)
    const pointsMat = new THREE.PointsMaterial({
      color: 0xff5b1f,
      size: isMobile ? 0.08 : 0.1,
      transparent: true,
      opacity: 0.95,
    })
    const vertexPoints = new THREE.Points(pointsGeom, pointsMat)
    group.add(vertexPoints)

    // (3) Subtle Gyroscopic Ring Tilted in Orange
    const curve = new THREE.EllipseCurve(0, 0, sphereRadius * 1.05, sphereRadius * 1.05, 0, 2 * Math.PI, false, 0)
    const ringGeom = new THREE.BufferGeometry().setFromPoints(curve.getPoints(96))
    const ringMaterial = new THREE.LineBasicMaterial({
      color: 0xff5b1f,
      transparent: true,
      opacity: 0.35,
    })
    const gyroRing = new THREE.LineLoop(ringGeom, ringMaterial)
    gyroRing.rotation.x = Math.PI / 2.35
    group.add(gyroRing)

    // (4) Ambient Micro-Particles
    const particleCount = isMobile ? 50 : 90
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const r = sphereRadius * (0.85 + Math.random() * 0.35)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }
    const swarmGeom = new THREE.BufferGeometry()
    swarmGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const swarmMaterial = new THREE.PointsMaterial({
      color: 0xe8e6df,
      size: 0.025,
      transparent: true,
      opacity: 0.45,
    })
    const swarm = new THREE.Points(swarmGeom, swarmMaterial)
    group.add(swarm)

    // 4. Kinetic Drag & Momentum Physics
    let targetTiltX = 0
    let targetTiltY = 0
    let currentRotX = 0
    let currentRotY = 0
    let autoSpinY = 0
    let dragRotX = 0
    let dragRotY = 0

    let velX = 0
    let velY = 0
    let isDragging = false
    let prevPointerX = 0
    let prevPointerY = 0

    const sphereWrap = sphereContainerRef.current

    const handlePointerMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1
      const normY = (e.clientY / window.innerHeight) * 2 - 1
      targetTiltY = normX * 0.25
      targetTiltX = normY * 0.18

      if (isDragging) {
        const deltaX = e.clientX - prevPointerX
        const deltaY = e.clientY - prevPointerY
        prevPointerX = e.clientX
        prevPointerY = e.clientY

        velY = deltaX * 0.009
        velX = deltaY * 0.009

        dragRotY += velY
        dragRotX += velX
      }
    }

    const handlePointerDown = (e) => {
      isDragging = true
      prevPointerX = e.clientX
      prevPointerY = e.clientY
      velX = 0
      velY = 0
      if (stateRef.current) {
        stateRef.current.textContent = 'CORE.STATUS // DRAGGING'
        stateRef.current.classList.add('text-signal')
      }
    }

    const handlePointerUp = () => {
      if (isDragging) {
        isDragging = false
        if (stateRef.current) {
          stateRef.current.textContent = 'CORE.STATUS // ORBITING'
          stateRef.current.classList.remove('text-signal')
        }
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    if (sphereWrap) {
      sphereWrap.addEventListener('pointerdown', handlePointerDown)
    }
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)

    // Controls: Boost & Recenter
    boostActionRef.current = () => {
      velY += 0.15
      if (stateRef.current) {
        stateRef.current.textContent = 'BURST // ACCELERATED'
        setTimeout(() => {
          if (stateRef.current) stateRef.current.textContent = 'CORE.STATUS // ORBITING'
        }, 1200)
      }
    }

    resetActionRef.current = () => {
      dragRotX = 0
      dragRotY = 0
      velX = 0
      velY = 0
      if (stateRef.current) {
        stateRef.current.textContent = 'CORE // RECENTERED'
        setTimeout(() => {
          if (stateRef.current) stateRef.current.textContent = 'CORE.STATUS // ORBITING'
        }, 1000)
      }
    }

    // 5. Observer for visibility pause
    let isVisible = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? false
      },
      { threshold: 0.05 }
    )
    if (sphereWrap) observer.observe(sphereWrap)

    // 6. Resize handler
    const handleResize = () => {
      if (!canvasWrap) return
      const size = canvasWrap.clientWidth || 300
      camera.aspect = 1
      camera.updateProjectionMatrix()
      renderer.setSize(size, size, false)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
    }
    window.addEventListener('resize', handleResize)

    // 7. Animation Loop
    const clock = new THREE.Clock()
    let animationFrameId = null
    let lastTelemetryUpdate = 0

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      if (!isVisible) return

      const elapsedTime = clock.getElapsedTime()
      const now = performance.now()

      // Auto spin
      if (!prefersReducedMotion) {
        autoSpinY += isMobile ? 0.002 : 0.0035
      }

      // Kinetic Inertia
      if (!isDragging) {
        dragRotX += velX
        dragRotY += velY
        velX *= 0.94
        velY *= 0.94
      }

      // Gyro ring spin
      gyroRing.rotation.z = elapsedTime * 0.22

      // Ease rotation toward target
      const targetX = targetTiltX + dragRotX
      const targetY = targetTiltY + dragRotY + autoSpinY

      currentRotX += (targetX - currentRotX) * 0.08
      currentRotY += (targetY - currentRotY) * 0.08

      group.rotation.x = currentRotX
      group.rotation.y = currentRotY

      // Orbit Skill Labels around outside the sphere
      const sphereDiameter = sphereWrap ? sphereWrap.clientWidth : 300
      const radiusX = sphereDiameter * 0.5 + (isMobile ? 32 : 55)
      const radiusY = radiusX * 0.46
      const orbitSpeed = isMobile ? 0.2 : 0.35
      const orbitBaseAngle = (prefersReducedMotion ? 0 : elapsedTime * orbitSpeed) + currentRotY

      skillRefs.current.forEach((el, idx) => {
        if (!el) return
        const angle = orbitBaseAngle + (idx / skills.length) * (2 * Math.PI)
        const x = Math.cos(angle) * radiusX
        const y = Math.sin(angle) * radiusY
        const z = Math.sin(angle)

        // Front vs back depth
        const scale = z > 0 ? 0.96 + z * 0.12 : 0.82 + (z + 1) * 0.08
        const opacity = z > 0 ? 1 : 0.4
        const zIndex = z > 0 ? 30 : 5

        el.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) scale(${scale})`
        el.style.opacity = `${opacity}`
        el.style.zIndex = `${zIndex}`
      })

      // Telemetry update at ~15fps
      if (now - lastTelemetryUpdate > 65) {
        lastTelemetryUpdate = now
        const degX = Math.round(((currentRotX * 180) / Math.PI) % 360)
        const degY = Math.round(((currentRotY * 180) / Math.PI) % 360)
        if (pitchRef.current) pitchRef.current.textContent = `PITCH: ${degX >= 0 ? '+' : ''}${degX}°`
        if (yawRef.current) yawRef.current.textContent = `YAW: ${degY >= 0 ? '+' : ''}${degY}°`
      }

      renderer.render(scene, camera)
    }

    animate()

    // 8. Cleanup
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }

      observer.disconnect()
      window.removeEventListener('pointermove', handlePointerMove)
      if (sphereWrap) {
        sphereWrap.removeEventListener('pointerdown', handlePointerDown)
      }
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
      window.removeEventListener('resize', handleResize)

      icosaGeom.dispose()
      edgesGeom.dispose()
      pointsGeom.dispose()
      ringGeom.dispose()
      swarmGeom.dispose()

      outerMaterial.dispose()
      pointsMat.dispose()
      ringMaterial.dispose()
      swarmMaterial.dispose()

      renderer.dispose()
      renderer.forceContextLoss()
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [skills])

  return (
    <div className="relative h-full w-full select-none overflow-hidden flex items-center justify-center group/core p-4 sm:p-6">
      
      {/* 1. Large Portal Sphere & Portrait Unit */}
      <div
        ref={sphereContainerRef}
        className="relative w-[270px] h-[270px] sm:w-[350px] sm:h-[350px] lg:w-[440px] lg:h-[440px] rounded-full flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing select-none"
      >
        {/* Layer 1: Real Portrait Photo filling the entire circular area */}
        <div className="absolute inset-0 rounded-full overflow-hidden bg-ink shadow-2xl">
          <img
            src={personalInfo.portrait || '/portrait.jpg'}
            alt="Gangadhara K V"
            className="w-full h-full object-cover object-[center_16%] select-none scale-[1.03]"
          />
        </div>

        {/* Layer 2: 3D Rotating Orange Wireframe Sphere (Overlay with soft radial mask over face) */}
        <div
          ref={canvasRef}
          role="img"
          aria-label="Rotating 3D wireframe sphere overlaying portrait — drag to rotate"
          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-10"
          style={{
            maskImage:
              'radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.38) 45%, rgba(0,0,0,0.85) 75%, black 100%)',
            WebkitMaskImage:
              'radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.38) 45%, rgba(0,0,0,0.85) 75%, black 100%)',
          }}
        />

        {/* Layer 3: Thin Glowing Orange Ring around circular edge */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full border-2 border-signal shadow-[0_0_30px_rgba(255,91,31,0.55),inset_0_0_15px_rgba(255,91,31,0.25)] ring-1 ring-signal/30 z-20"
          aria-hidden="true"
        />
      </div>

      {/* 2. Large, Sharp Orbiting Skill Badges (Revolving Outside the Sphere) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {skills.map((skill, idx) => (
          <div
            key={skill}
            ref={(el) => (skillRefs.current[idx] = el)}
            className="absolute top-1/2 left-1/2 pointer-events-none font-mono text-xs sm:text-sm uppercase font-bold tracking-wider px-3.5 py-1.5 rounded-full bg-[#08090c]/95 text-bone border-2 border-signal shadow-[0_0_16px_rgba(255,91,31,0.45)] backdrop-blur whitespace-nowrap will-change-transform"
          >
            <span className="text-signal mr-1.5 font-bold">›</span>
            {skill}
          </div>
        ))}
      </div>

      {/* 3. Top HUD Telemetry Strip */}
      <div className="pointer-events-none absolute top-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-dim z-30">
        <div className="flex items-center gap-2 bg-ink/80 backdrop-blur px-2.5 py-1 border border-bone/10">
          <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
          <span ref={stateRef}>CORE.STATUS // ORBITING</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 bg-ink/80 backdrop-blur px-2.5 py-1 border border-bone/10">
          <span ref={pitchRef}>PITCH: +0°</span>
          <span className="text-bone/20">|</span>
          <span ref={yawRef}>YAW: +0°</span>
        </div>
      </div>

      {/* 4. Bottom Interactive Controls: Boost & Reset */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] z-30">
        <span className="pointer-events-none hidden sm:inline-block text-dim bg-ink/80 backdrop-blur px-2.5 py-1 border border-bone/10">
          DRAG SPHERE TO ROTATE
        </span>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={() => boostActionRef.current?.()}
            className="cursor-pointer bg-ink/90 hover:bg-signal hover:text-ink text-bone px-3 py-1 border border-bone/20 hover:border-signal transition-all duration-200 active:scale-95 text-[10px] font-mono tracking-wider font-semibold"
            title="Accelerate rotation"
          >
            ⚡ BOOST
          </button>
          <button
            type="button"
            onClick={() => resetActionRef.current?.()}
            className="cursor-pointer bg-ink/90 hover:bg-bone hover:text-ink text-bone px-3 py-1 border border-bone/20 transition-all duration-200 active:scale-95 text-[10px] font-mono tracking-wider"
            title="Reset orientation"
          >
            ↺ RESET
          </button>
        </div>
      </div>
    </div>
  )
}