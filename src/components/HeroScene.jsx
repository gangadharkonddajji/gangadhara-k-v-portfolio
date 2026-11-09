import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Enhanced 3D Signal Core centerpiece rendered with Three.js.
 * Features:
 * - Multi-layer kinetic icosahedron & inner dodecahedron with glowing vertex nodes
 * - Triple gyroscopic orbital rings with counter-rotation
 * - Ambient floating data particle swarm
 * - Kinetic drag physics with momentum & inertia
 * - Live HUD telemetry readouts (Pitch, Yaw, Velocity)
 * - Interactive Boost Spin & Recenter controls
 */
export default function HeroScene() {
  const containerRef = useRef(null)
  const pitchRef = useRef(null)
  const yawRef = useRef(null)
  const stateRef = useRef(null)
  const boostActionRef = useRef(null)
  const resetActionRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 1. Detect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // 2. Scene setup
    const scene = new THREE.Scene()
    const width = container.clientWidth || 300
    const height = container.clientHeight || 300

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    camera.position.z = 7

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height, false)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'

    // 3. Signal Core Master Group
    const group = new THREE.Group()
    scene.add(group)

    // (1) Outer Shell: Edges of Icosahedron in signal orange (0xff5b1f)
    const outerIcosaGeom = new THREE.IcosahedronGeometry(1.9, 1)
    const edgesGeom = new THREE.EdgesGeometry(outerIcosaGeom)
    const outerMaterial = new THREE.LineBasicMaterial({
      color: 0xff5b1f,
      transparent: true,
      opacity: prefersReducedMotion ? 0.9 : 0.85,
    })
    const outerShell = new THREE.LineSegments(edgesGeom, outerMaterial)
    group.add(outerShell)

    // (2) Outer Shell Vertices: Glowing orange node beads
    const vertexPointsGeom = new THREE.IcosahedronGeometry(1.9, 1)
    const vertexPointsMat = new THREE.PointsMaterial({
      color: 0xff5b1f,
      size: 0.08,
      transparent: true,
      opacity: 0.9,
    })
    const vertexPoints = new THREE.Points(vertexPointsGeom, vertexPointsMat)
    group.add(vertexPoints)

    // (3) Mid Cage: Inner Dodecahedron wireframe in bone (0xe8e6df)
    const midDodecaGeom = new THREE.DodecahedronGeometry(1.4, 0)
    const midEdgesGeom = new THREE.EdgesGeometry(midDodecaGeom)
    const midMaterial = new THREE.LineBasicMaterial({
      color: 0xe8e6df,
      transparent: true,
      opacity: 0.35,
    })
    const midCage = new THREE.LineSegments(midEdgesGeom, midMaterial)
    group.add(midCage)

    // (4) Inner Quantum Core: Dense particle point cloud in bone
    const innerGeom = new THREE.IcosahedronGeometry(1.1, 3)
    const innerMaterial = new THREE.PointsMaterial({
      color: 0xe8e6df,
      size: 0.03,
      transparent: true,
      opacity: 0.8,
    })
    const innerCore = new THREE.Points(innerGeom, innerMaterial)
    group.add(innerCore)

    // (5) Gyroscopic Orbit Ring 1: Signal Orange, tilted at PI / 2.4
    const curve1 = new THREE.EllipseCurve(0, 0, 2.6, 2.6, 0, 2 * Math.PI, false, 0)
    const ring1Geom = new THREE.BufferGeometry().setFromPoints(curve1.getPoints(96))
    const ring1Material = new THREE.LineBasicMaterial({
      color: 0xff5b1f,
      transparent: true,
      opacity: 0.35,
    })
    const orbitRing1 = new THREE.LineLoop(ring1Geom, ring1Material)
    orbitRing1.rotation.x = Math.PI / 2.4
    group.add(orbitRing1)

    // (6) Gyroscopic Orbit Ring 2: Bone / Cyan tint, tilted at -PI / 3.2
    const curve2 = new THREE.EllipseCurve(0, 0, 2.85, 2.85, 0, 2 * Math.PI, false, 0)
    const ring2Geom = new THREE.BufferGeometry().setFromPoints(curve2.getPoints(96))
    const ring2Material = new THREE.LineBasicMaterial({
      color: 0xe8e6df,
      transparent: true,
      opacity: 0.22,
    })
    const orbitRing2 = new THREE.LineLoop(ring2Geom, ring2Material)
    orbitRing2.rotation.y = -Math.PI / 3.2
    orbitRing2.rotation.z = Math.PI / 6
    group.add(orbitRing2)

    // (7) Ambient Data Swarm (160 floating orbital particles)
    const swarmCount = 160
    const swarmPositions = new Float32Array(swarmCount * 3)
    for (let i = 0; i < swarmCount; i++) {
      const radius = 2.2 + Math.random() * 1.6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      swarmPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      swarmPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      swarmPositions[i * 3 + 2] = radius * Math.cos(phi)
    }
    const swarmGeom = new THREE.BufferGeometry()
    swarmGeom.setAttribute('position', new THREE.BufferAttribute(swarmPositions, 3))
    const swarmMaterial = new THREE.PointsMaterial({
      color: 0xe8e6df,
      size: 0.022,
      transparent: true,
      opacity: 0.45,
    })
    const swarm = new THREE.Points(swarmGeom, swarmMaterial)
    scene.add(swarm)

    // Initial scale for intro materialisation
    if (prefersReducedMotion) {
      group.scale.set(1, 1, 1)
    } else {
      group.scale.set(0.6, 0.6, 0.6)
    }

    // 4. Kinetic Drag & Interaction State
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

    const handleWindowPointerMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1
      const normY = (e.clientY / window.innerHeight) * 2 - 1
      targetTiltY = normX * 0.35
      targetTiltX = normY * 0.22

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

    const handleCanvasPointerDown = (e) => {
      isDragging = true
      prevPointerX = e.clientX
      prevPointerY = e.clientY
      velX = 0
      velY = 0
      if (stateRef.current) {
        stateRef.current.textContent = 'INTERACTION // DRAGGING'
        stateRef.current.classList.add('text-signal')
      }
    }

    const handlePointerUp = () => {
      if (isDragging) {
        isDragging = false
        if (stateRef.current) {
          stateRef.current.textContent = 'CORE.STATUS // ACTIVE'
          stateRef.current.classList.remove('text-signal')
        }
      }
    }

    window.addEventListener('pointermove', handleWindowPointerMove, { passive: true })
    container.addEventListener('pointerdown', handleCanvasPointerDown)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)

    // Action handlers for Boost and Recenter buttons
    boostActionRef.current = () => {
      velY += 0.12
      if (stateRef.current) {
        stateRef.current.textContent = 'BOOST // KINETIC BURST'
        setTimeout(() => {
          if (stateRef.current) stateRef.current.textContent = 'CORE.STATUS // ACTIVE'
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
          if (stateRef.current) stateRef.current.textContent = 'CORE.STATUS // ACTIVE'
        }, 1000)
      }
    }

    // 5. Visibility observer to pause rendering when off-screen
    let isVisible = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? false
      },
      { threshold: 0.05 }
    )
    observer.observe(container)

    // 6. Window resize handler
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    window.addEventListener('resize', handleResize)

    // 7. Animation loop with Kinetic Momentum
    const clock = new THREE.Clock()
    const startTime = performance.now()
    let animationFrameId = null
    let lastTelemetryUpdate = 0

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      if (!isVisible) return

      const elapsedTime = clock.getElapsedTime()
      const now = performance.now()

      // Materialisation intro
      if (!prefersReducedMotion) {
        const progress = Math.min((now - startTime) / 1000, 1)
        const easeOut = 1 - Math.pow(1 - progress, 3)

        const currentScale = 0.6 + 0.4 * easeOut
        group.scale.set(currentScale, currentScale, currentScale)
        outerMaterial.opacity = 0.85 * easeOut

        // Gentle auto spin
        autoSpinY += 0.003
      }

      // Kinetic Inertia when released
      if (!isDragging) {
        dragRotX += velX
        dragRotY += velY
        velX *= 0.94
        velY *= 0.94
      }

      // Inner elements counter-rotation & breathing pulse
      innerCore.rotation.y = -elapsedTime * 0.22
      midCage.rotation.x = elapsedTime * 0.12
      midCage.rotation.z = -elapsedTime * 0.08
      orbitRing1.rotation.z = elapsedTime * 0.25
      orbitRing2.rotation.z = -elapsedTime * 0.18
      swarm.rotation.y = elapsedTime * 0.04

      // Gentle quantum breathing pulse
      const pulse = 1 + Math.sin(elapsedTime * 2.4) * 0.05
      innerCore.scale.set(pulse, pulse, pulse)

      // Group eases toward target rotation
      const targetX = targetTiltX + dragRotX
      const targetY = targetTiltY + dragRotY + autoSpinY

      currentRotX += (targetX - currentRotX) * 0.08
      currentRotY += (targetY - currentRotY) * 0.08

      group.rotation.x = currentRotX
      group.rotation.y = currentRotY

      // Update HUD telemetry DOM readouts (throttled to ~15fps for performance)
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

    // 8. Cleanup on unmount
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }

      observer.disconnect()
      window.removeEventListener('pointermove', handleWindowPointerMove)
      container.removeEventListener('pointerdown', handleCanvasPointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
      window.removeEventListener('resize', handleResize)

      // Dispose all geometries
      edgesGeom.dispose()
      outerIcosaGeom.dispose()
      vertexPointsGeom.dispose()
      midDodecaGeom.dispose()
      midEdgesGeom.dispose()
      innerGeom.dispose()
      ring1Geom.dispose()
      ring2Geom.dispose()
      swarmGeom.dispose()

      // Dispose materials
      outerMaterial.dispose()
      vertexPointsMat.dispose()
      midMaterial.dispose()
      innerMaterial.dispose()
      ring1Material.dispose()
      ring2Material.dispose()
      swarmMaterial.dispose()

      // Dispose renderer
      renderer.dispose()
      renderer.forceContextLoss()
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="relative h-full w-full select-none overflow-hidden group/core">
      {/* Three.js Canvas Container */}
      <div
        ref={containerRef}
        role="img"
        aria-label="Interactive 3D Core — Drag and turn to inspect"
        data-cursor="hot"
        className="relative h-full w-full cursor-grab active:cursor-grabbing"
      />

      {/* Holographic Tactical Crosshairs Overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {/* Subtle circular reticle */}
        <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-full border border-bone/[0.07] border-dashed animate-[spin_60s_linear_infinite]" />
        <div className="absolute w-36 h-36 rounded-full border border-bone/[0.04]" />
        {/* Center Target Mark */}
        <div className="absolute text-bone/20 font-mono text-xs pointer-events-none">
          +
        </div>
      </div>

      {/* Top HUD Telemetry Strip */}
      <div className="pointer-events-none absolute top-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-dim z-10">
        <div className="flex items-center gap-2 bg-ink/75 backdrop-blur px-2.5 py-1 border border-bone/10">
          <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
          <span ref={stateRef}>CORE.STATUS // ACTIVE</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 bg-ink/75 backdrop-blur px-2.5 py-1 border border-bone/10">
          <span ref={pitchRef}>PITCH: +0°</span>
          <span className="text-bone/20">|</span>
          <span ref={yawRef}>YAW: +0°</span>
        </div>
      </div>

      {/* Bottom Interactive HUD Action Toolbar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] z-10">
        <span className="pointer-events-none hidden sm:inline-block text-dim bg-ink/75 backdrop-blur px-2.5 py-1 border border-bone/10">
          DRAG TO ROTATE // INERTIA ON
        </span>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={() => boostActionRef.current?.()}
            className="cursor-pointer bg-ink/80 hover:bg-signal hover:text-ink text-bone/80 px-2.5 py-1 border border-bone/15 hover:border-signal transition-all duration-200 active:scale-95"
            title="Accelerate core rotation"
          >
            ⚡ BOOST
          </button>
          <button
            type="button"
            onClick={() => resetActionRef.current?.()}
            className="cursor-pointer bg-ink/80 hover:bg-bone hover:text-ink text-bone/80 px-2.5 py-1 border border-bone/15 transition-all duration-200 active:scale-95"
            title="Reset core orientation"
          >
            ↺ RESET
          </button>
        </div>
      </div>
    </div>
  )
}