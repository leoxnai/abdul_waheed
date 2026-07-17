import { useEffect, useRef } from 'react'
import { useMousePosition } from '../../hooks/useMousePosition'

export default function CursorEffect() {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)
  const { position } = useMousePosition()

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current
    if (!cursor || !follower) return

    let mouseX = 0
    let mouseY = 0
    let followerX = 0
    let followerY = 0

    const handleMouse = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`
    }

    const animate = () => {
      followerX += (mouseX - followerX) * 0.1
      followerY += (mouseY - followerY) * 0.1
      follower.style.transform = `translate(${followerX - 15}px, ${followerY - 15}px)`
      requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouse)
    animate()

    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-4 h-4 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 border border-primary rounded-full pointer-events-none z-[9999] hidden md:block transition-all duration-300"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  )
}
