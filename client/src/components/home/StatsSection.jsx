import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useApp } from '../../context/AppContext'
import SectionReveal from '../ui/SectionReveal'

function AnimatedCounter({ value, suffix }) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView({ triggerOnce: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 2000
    const step = Math.ceil(value / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, value])

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-heading font-bold text-gradient">
      {count}{suffix}
    </span>
  )
}

const fallbackStats = [
  { label: 'Years Experience', value: 8, suffix: '+' },
  { label: 'Projects Completed', value: 500, suffix: '+' },
  { label: 'Happy Clients', value: 200, suffix: '+' },
  { label: 'Design Awards', value: 15, suffix: '' },
]

export default function StatsSection() {
  const { stats } = useApp()
  const displayStats = (stats && stats.length > 0) ? stats : fallbackStats

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {displayStats.map((stat, i) => (
            <SectionReveal key={stat.id || stat.label} delay={i * 0.1}>
              <div className="text-center p-8 rounded-2xl bg-card border border-white/5 hover:border-primary/20 transition-all duration-500">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                <p className="text-gray text-sm mt-2">{stat.label}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
