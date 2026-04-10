import { Link } from 'react-router-dom'
import PageFrame from '../components/layout/PageFrame'
import ecommerceServiceImage from '../assets/ecommerce-service.svg'

function Services() {
  const serviceCategories = [
    {
      number: '01',
      name: 'Web Services',
    },
  ]

  const deliveryPromises = [
    'On-time product delivery with clear milestones',
    'Secure development for websites and software products',
    'Performance-focused builds with SEO-ready architecture',
  ]

  const webServices = [
    {
      number: '01',
      title: 'E-Commerce Website',
      tone: 'commerce',
      image: ecommerceServiceImage,
      alt: 'E-commerce website interface with secure checkout and shopping cart',
      summary:
        'Launch a conversion-focused online store with fast product pages, secure checkout, and smooth order management. We build modern e-commerce websites with mobile-first UX, payment gateway integration, and strong security layers so your business can scale confidently.',
      points: ['Secure checkout flow', 'Payment gateway integration', 'Catalog and order management'],
    },
    {
      number: '02',
      title: 'Business Website',
      tone: 'business',
      image: ecommerceServiceImage,
      alt: 'Business website pages with services and contact sections',
      summary:
        'Build a professional business website that clearly presents your company profile, services, and trust signals. We focus on clean design, fast loading speed, and SEO-ready structure to help you generate qualified leads.',
      points: ['Lead-focused page structure', 'SEO and speed optimization', 'Strong brand presentation'],
    },
    {
      number: '03',
      title: 'Portfolio Website',
      tone: 'portfolio',
      image: ecommerceServiceImage,
      alt: 'Portfolio website showcasing projects and achievements',
      summary:
        'Showcase your work with a modern portfolio website designed to highlight projects, testimonials, and outcomes. Perfect for freelancers, agencies, and creators who want stronger personal branding and more client inquiries.',
      points: ['Project showcase layouts', 'Case study storytelling', 'Personal brand positioning'],
    },
    {
      number: '04',
      title: 'Blog Website',
      tone: 'blog',
      image: ecommerceServiceImage,
      alt: 'Blog website layout with featured articles and categories',
      summary:
        'Launch a high-performance blog platform with category management, clean reading experience, and search-friendly architecture. We set up scalable blog structures that help you publish consistently and grow organic traffic.',
      points: ['Clean reading experience', 'Category and content management', 'Search-friendly structure'],
    },
    {
      number: '05',
      title: 'Landing Pages',
      tone: 'landing',
      image: ecommerceServiceImage,
      alt: 'High-converting landing page with clear call-to-action sections',
      summary:
        'Get campaign-focused landing pages built for conversions. From ad traffic to form submission, we design each section with sharp messaging, fast performance, and action-oriented CTAs to increase enquiries and sales.',
      points: ['Ad-to-page message match', 'Conversion-first section design', 'A/B testing ready structure'],
    },
    {
      number: '06',
      title: 'Custom Web Portal',
      tone: 'portal',
      image: ecommerceServiceImage,
      alt: 'Secure custom web portal with dashboard and user roles',
      summary:
        'Develop secure, role-based web portals for internal teams, vendors, or customers. We create dashboard-driven portals with authentication, permission control, and streamlined workflows for reliable daily operations.',
      points: ['Role-based access control', 'Dashboard and workflow modules', 'Long-term scalable architecture'],
    },
  ]

  return (
    <PageFrame id="services-page">
      <section className="panel services-hero-panel">
        <div className="services-hero-copy">
          <h1>Our Services</h1>
          <p className="lede">
            We provide reliable digital solutions that help businesses launch faster, operate better, and grow with
            confidence. We ensure on-time product delivery and secure services, and every website or software product
            we build is developed with strong security standards.
          </p>
          <ul className="services-numbering" aria-label="Service categories">
            {serviceCategories.map((category) => (
              <li key={category.number}>
                <span className="service-number">{category.number}</span>
                <span className="service-number-label">{category.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="services-trust-card" aria-label="Delivery and security promise">
          <h2>Delivery & Security Promise</h2>
          <ul className="services-trust-list">
            {deliveryPromises.map((promise) => (
              <li key={promise}>{promise}</li>
            ))}
          </ul>
          <Link className="cta primary" to="/enquiry">
            Get Free Consultation
          </Link>
        </aside>
      </section>

      <section className="panel web-services-panel">
        <div className="web-services-head">
          <h2>Web Services</h2>
          <p className="muted">
            Strategic website solutions designed for trust, conversion, and long-term growth.
          </p>
        </div>

        <div className="web-service-grid">
          {webServices.map((service) => (
            <article className={`web-service-card tone-${service.tone}`} key={service.title}>
              <span className="web-service-index">{service.number}</span>
              <div className="web-service-media">
                <img src={service.image} alt={service.alt} loading="lazy" />
              </div>
              <div className="web-service-content">
                <span className="pill small">Service {service.number}</span>
                <h3>{service.title}</h3>
                <p className="muted">{service.summary}</p>
                <ul className="web-service-points">
                  {service.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <Link className="cta primary" to="/enquiry">
                  Get Free Consultation
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageFrame>
  )
}

export default Services
