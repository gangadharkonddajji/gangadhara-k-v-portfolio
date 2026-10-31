import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * 3D Signal Core centerpiece rendered with Three.js.
 * Features an outer icosahedron shell, inner point cloud, and tilted orbit ring.
 */
export default function HeroScene() {
  const containerRef = useRef(null)

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

    // Make canvas fill the parent
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'

    // 3. Signal Core Group
    const group = new THREE.Group()
    scene.add(group)

    // (1) Outer Shell: Edges of Icosahedron in signal orange (0xff5b1f)
    const outerIcosaGeom = new THREE.IcosahedronGeometry(1.9, 1)
    const edgesGeom = new THREE.EdgesGeometry(outerIcosaGeom)
    const outerMaterial = new THREE.LineBasicMaterial({
      color: 0xff5b1f,
      transparent: true,
      opacity: prefersReducedMotion ? 0.9 : 0,
    })
    const outerShell = new THREE.LineSegments(edgesGeom, outerMaterial)
    group.add(outerShell)

    // (2) Inner Core: Points of Icosahedron in bone color (0xe8e6df)
    const innerGeom = new THREE.IcosahedronGeometry(1.15, 4)
    const innerMaterial = new THREE.PointsMaterial({
      color: 0xe8e6df,
      size: 0.025,
      transparent: true,
      opacity: 0.8,
    })
    const innerCore = new THREE.Points(innerGeom, innerMaterial)
    group.add(innerCore)

    // (3) Orbit Ring: 128 points of EllipseCurve tilted at PI / 2.4
    const curve = new THREE.EllipseCurve(0, 0, 2.7, 2.7, 0, 2 * Math.PI, false, 0)
    const curvePoints = curve.getPoints(128)
    const ringGeom = new THREE.BufferGeometry().setFromPoints(curvePoints)
    const ringMaterial = new THREE.LineBasicMaterial({
      color: 0xe8e6df,
      transparent: true,
      opacity: 0.18,
    })
    const orbitRing = new THREE.LineLoop(ringGeom, ringMaterial)
    orbitRing.rotation.x = Math.PI / 2.4
    group.add(orbitRing)

    // Initial scale for intro materialisation
    if (prefersReducedMotion) {
      group.scale.set(1, 1, 1)
    } else {
      group.scale.set(0.6, 0.6, 0.6)
    }

    // 4. Interaction variables
    let targetTiltX = 0
    let targetTiltY = 0
    let currentRotX = 0
    let currentRotY = 0
    let autoSpinY = 0
    let dragRotX = 0
    let dragRotY = 0

    let isDragging = false
    let prevPointerX = 0
    let prevPointerY = 0

    // Tilt toward mouse across the window
    const handleWindowPointerMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1
      const normY = (e.clientY / window.innerHeight) * 2 - 1
      targetTiltY = normX * 0.4
      targetTiltX = normY * 0.25

      if (isDragging) {
        const deltaX = e.clientX - prevPointerX
        const deltaY = e.clientY - prevPointerY
        prevPointerX = e.clientX
        prevPointerY = e.clientY

        dragRotY += deltaX * 0.01
        dragRotX += deltaY * 0.01
      }
    }

    const handleCanvasPointerDown = (e) => {
      isDragging = true
      prevPointerX = e.clientX
      prevPointerY = e.clientY
    }

    const handlePointerUp = () => {
      isDragging = false
    }

    window.addEventListener('pointermove', handleWindowPointerMove, { passive: true })
    container.addEventListener('pointerdown', handleCanvasPointerDown)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)

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
      if (w === 0 || h === 0) return

      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    window.addEventListener('resize', handleResize)

    // 7. Animation loop
    const clock = new THREE.Clock()
    const startTime = performance.now()
    let animationFrameId = null

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      if (!isVisible) return

      const elapsedTime = clock.getElapsedTime()
      const now = performance.now()

      // Materialisation intro (0.6 -> 1.0 scale and fade-in over ~1s)
      if (!prefersReducedMotion) {
        const progress = Math.min((now - startTime) / 1000, 1)
        // Ease-out cubic curve
        const easeOut = 1 - Math.pow(1 - progress, 3)

        const currentScale = 0.6 + 0.4 * easeOut
        group.scale.set(currentScale, currentScale, currentScale)
        outerMaterial.opacity = 0.9 * easeOut

        // Auto spin on Y
        autoSpinY += 0.0025
      }

      // Inner points rotate in reverse direction
      innerCore.rotation.y = -elapsedTime * 0.15

      // Group eases toward target rotation with factor 0.06
      const targetX = targetTiltX + dragRotX
      const targetY = targetTiltY + dragRotY + autoSpinY

      currentRotX += (targetX - currentRotX) * 0.06
      currentRotY += (targetY - currentRotY) * 0.06

      group.rotation.x = currentRotX
      group.rotation.y = currentRotY

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

      // Dispose geometries
      edgesGeom.dispose()
      outerIcosaGeom.dispose()
      innerGeom.dispose()
      ringGeom.dispose()

      // Dispose materials
      outerMaterial.dispose()
      innerMaterial.dispose()
      ringMaterial.dispose()

      // Dispose renderer and detach canvas
      renderer.dispose()
      renderer.forceContextLoss()
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Interactive 3D shape — drag to rotate"
      data-cursor="hot"
      className="relative h-full w-full cursor-grab active:cursor-grabbing select-none"
    />
  )
}
