import { useEffect, useState } from 'react'

const HERO_SLIDES = [
  {
    image:
      'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1800&q=80',
    title: 'Premium Product Engineering',
    text: 'High-impact web experiences crafted for performance and business growth.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1800&q=80',
    title: 'Clean Frontend Architecture',
    text: 'Scalable components with modern UI patterns and reliable maintainability.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1800&q=80',
    title: 'Fast Delivery with Quality',
    text: 'From idea to launch with robust code quality and polished interfaces.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1800&q=80',
    title: 'Reliable Full-Stack Solutions',
    text: 'API, frontend, and deployment aligned for stable end-to-end execution.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1800&q=80',
    title: 'Built to Convert and Scale',
    text: 'Premium design direction paired with production-ready implementation.',
  },
]

function Hero() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % HERO_SLIDES.length)
    }, 3500)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="hero-slider" aria-label="Hero slider">
      {HERO_SLIDES.map((slide, index) => (
        <article
          key={slide.title}
          className={`hero-slide ${index === activeIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
          aria-hidden={index !== activeIndex}
        >
          <div className="hero-overlay">
            <p className="hero-kicker">Featured</p>
            <h2>{slide.title}</h2>
            <p>{slide.text}</p>
          </div>
        </article>
      ))}

      <div className="hero-dots" aria-hidden="true">
        {HERO_SLIDES.map((slide, index) => (
          <span key={slide.title} className={`hero-dot ${index === activeIndex ? 'active' : ''}`} />
        ))}
      </div>
    </section>
  )
}

export default Hero
