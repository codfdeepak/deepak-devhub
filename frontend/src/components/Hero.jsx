import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectHeroSlides, selectHeroStatus } from "../Redux/slices/heroSlice";
import { fetchPublicHeroSlides } from "../Redux/thunks/heroThunks";

const FALLBACK_HERO_SLIDES = [
  // {
  //   image:
  //     'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1800&q=80',
  //   title: 'Premium Product Engineering',
  //   text: 'High-impact web experiences crafted for performance and business growth.',
  // },
  // {
  //   image:
  //     'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1800&q=80',
  //   title: 'Clean Frontend Architecture',
  //   text: 'Scalable components with modern UI patterns and reliable maintainability.',
  // },
  // {
  //   image:
  //     'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1800&q=80',
  //   title: 'Fast Delivery with Quality',
  //   text: 'From idea to launch with robust code quality and polished interfaces.',
  // },
  // {
  //   image:
  //     'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1800&q=80',
  //   title: 'Reliable Full-Stack Solutions',
  //   text: 'API, frontend, and deployment aligned for stable end-to-end execution.',
  // },
  // {
  //   image:
  //     'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1800&q=80',
  //   title: 'Built to Convert and Scale',
  //   text: 'Premium design direction paired with production-ready implementation.',
  // },
];

const STATIC_BRAND_SLIDE = {
  _id: "static-brand-slide",
  isBrandSlide: true,
  title: "Start Your Project Conversation on WhatsApp",
  text: "Share your requirements, timeline, and goals in one message. We review quickly and reply with a professional action plan.",
};

const WHATSAPP_LINK = `https://wa.me/919501924299?text=${encodeURIComponent(
  "Hi Deepak team, I want to discuss a project.",
)}`;

const normalizeSlide = (slide = {}, index = 0) => ({
  _id: slide?._id || "",
  image: String(slide?.image || "").trim(),
  title: String(slide?.title || "").trim() || `Featured Slide ${index + 1}`,
  text: String(slide?.description || slide?.text || "").trim(),
});

function Hero({ onDiscuss }) {
  const dispatch = useDispatch();
  const storedSlides = useSelector(selectHeroSlides);
  const heroStatus = useSelector(selectHeroStatus);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (heroStatus === "idle") {
      dispatch(fetchPublicHeroSlides());
    }
  }, [dispatch, heroStatus]);

  const slides = useMemo(() => {
    const normalized = (storedSlides || [])
      .map((slide, index) => normalizeSlide(slide, index))
      .filter((slide) => slide.image && slide.title && slide.text);

    const baseSlides = normalized.length ? normalized : FALLBACK_HERO_SLIDES;
    return [...baseSlides, STATIC_BRAND_SLIDE];
  }, [storedSlides]);

  useEffect(() => {
    setActiveIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="hero-slider" aria-label="Hero slider">
      {slides.map((slide, index) => (
        <article
          key={slide._id || `${slide.title}-${index}`}
          className={`hero-slide ${index === activeIndex ? "active" : ""} ${slide.isBrandSlide ? "brand-slide" : ""}`}
          style={
            slide.isBrandSlide
              ? undefined
              : { backgroundImage: `url(${slide.image})` }
          }
          aria-hidden={index !== activeIndex}
        >
          {slide.isBrandSlide ? (
            <div className="hero-overlay brand-hero-overlay">
              <p className="hero-kicker">Quick Connect</p>
              <h2>{slide.title}</h2>
              <p>{slide.text}</p>
              <div className="hero-brand-actions">
                <a
                  className="cta cta-btn hero-whatsapp-cta"
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="hero-whatsapp-icon"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.55 0 .24 5.31.24 11.84c0 2.08.54 4.12 1.56 5.92L0 24l6.42-1.68a11.8 11.8 0 0 0 5.66 1.44h.01c6.53 0 11.84-5.31 11.84-11.84 0-3.16-1.23-6.13-3.41-8.44Zm-8.44 18.3h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.81 1 1.02-3.72-.24-.38a9.9 9.9 0 0 1-1.52-5.24c0-5.45 4.44-9.89 9.9-9.89 2.65 0 5.14 1.03 7.01 2.9a9.84 9.84 0 0 1 2.89 7c0 5.46-4.44 9.9-9.89 9.9Zm5.43-7.43c-.3-.15-1.8-.89-2.08-.99-.28-.1-.48-.15-.68.15-.2.3-.78.99-.95 1.2-.18.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.46-.89-.79-1.49-1.77-1.67-2.07-.18-.3-.02-.47.13-.62.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.64-.93-2.25-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.06 1.04-1.06 2.53 0 1.5 1.08 2.94 1.23 3.14.15.2 2.1 3.2 5.09 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.88.12.57-.08 1.8-.73 2.05-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z"
                    />
                  </svg>
                  WhatsApp Us
                </a>
              </div>
            </div>
          ) : (
            <div className="hero-overlay">
              <p className="hero-kicker">Featured</p>
              <h2>{slide.title}</h2>
              <p>{slide.text}</p>
              <button
                className="cta primary cta-btn hero-discuss-btn"
                type="button"
                onClick={() => onDiscuss?.(slide.title)}
              >
                Discuss with us
              </button>
            </div>
          )}
        </article>
      ))}

      <div className="hero-dots" aria-hidden="true">
        {slides.map((slide, index) => (
          <span
            key={`${slide._id || slide.title}-dot-${index}`}
            className={`hero-dot ${index === activeIndex ? "active" : ""}`}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;
