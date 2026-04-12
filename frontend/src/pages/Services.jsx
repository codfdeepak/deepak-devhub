import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ConsultationModal from '../components/ConsultationModal'
import PageFrame from '../components/PageFrame'
import ecommerceServiceImage from '../assets/ecommerce-service.svg'
import { selectServices, selectServicesError, selectServicesStatus } from '../Redux/slices/serviceSlice'
import { fetchPublicServices } from '../Redux/thunks/serviceThunks'

function Services({ embedded = false }) {
  const dispatch = useDispatch()
  const services = useSelector(selectServices)
  const status = useSelector(selectServicesStatus)
  const error = useSelector(selectServicesError)
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)
  const [selectedServiceName, setSelectedServiceName] = useState('')

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPublicServices())
    }
  }, [dispatch, status])

  const deliveryPromises = [
    'On-time product delivery with clear milestones',
    'Secure development for websites and software products',
    'Performance-focused builds with SEO-ready architecture',
  ]

  const webServices = useMemo(
    () =>
      (services || []).map((service, index) => ({
        id: service?._id || '',
        number: String(index + 1).padStart(2, '0'),
        title: service?.name || `Service ${index + 1}`,
        image: service?.image || service?.snapshots?.[0] || ecommerceServiceImage,
        alt: service?.name
          ? `${service.name} service preview image`
          : 'Service preview image with website and software interface',
        summary: service?.description || 'Customized implementation based on your business goals.',
        points:
          Array.isArray(service?.bulletPoints) && service.bulletPoints.length
            ? service.bulletPoints.slice(0, 3)
            : ['Custom strategy', 'Secure implementation', 'Business-ready delivery'],
      })),
    [services],
  )

  const openConsultationForm = (serviceName = '') => {
    setSelectedServiceName(serviceName)
    setIsConsultationOpen(true)
  }

  const servicesContent = (
    <>
      {!embedded && (
        <section className="panel service-details-top">
          <div className="service-details-nav">
            <Link className="pill small profile-back-link" to="/">
              ← Back to Home
            </Link>
            <span className="pill small">Services</span>
          </div>
        </section>
      )}

      <section className="panel services-hero-panel">
        <div className="services-hero-copy">
          <h1>Our Services</h1>
          <p className="lede">
            We provide reliable digital solutions that help businesses launch faster, operate better, and grow with
            confidence. We ensure on-time product delivery and secure services, and every website or software product
            we build is developed with strong security standards.
          </p>
        </div>

        <aside className="services-trust-card" aria-label="Delivery and security promise">
          <h2>Delivery & Security Promise</h2>
          <ul className="services-trust-list">
            {deliveryPromises.map((promise) => (
              <li key={promise}>{promise}</li>
            ))}
          </ul>
          <button
            className="cta primary cta-btn"
            type="button"
            onClick={() => openConsultationForm('')}
          >
            Get Free Consultation
          </button>
        </aside>
      </section>

      <section className="web-services-panel">
        {status === 'loading' && <p className="muted">Loading latest services...</p>}
        {status === 'error' && <p className="muted">Unable to load services right now. {error}</p>}

        {status === 'loaded' && webServices.length === 0 && (
          <article className="web-service-empty">
            <p className="muted">No services published yet. Please check back soon.</p>
            <button className="cta primary cta-btn" type="button" onClick={() => openConsultationForm('')}>
              Get Free Consultation
            </button>
          </article>
        )}

        {webServices.length > 0 && (
          <div className="web-service-grid">
            {webServices.map((service) => (
              <article
                className="web-service-card"
                key={service.id || `${service.title}-${service.number}`}
              >
                <div className="web-service-media">
                  <img
                    src={service.image}
                    alt={service.alt}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null
                      event.currentTarget.src = ecommerceServiceImage
                    }}
                  />
                </div>
                <div className="web-service-content">
                  <span className="pill small">Service {service.number}</span>
                  <h3>{service.title}</h3>
                  <p className="muted web-service-summary">{service.summary}</p>
                  <ul className="web-service-points">
                    {service.points.map((point, pointIndex) => (
                      <li key={`${service.number}-point-${pointIndex}`}>{point}</li>
                    ))}
                  </ul>

                  <div className="service-card-actions">
                    <button
                      className="cta primary cta-btn"
                      type="button"
                      onClick={() => openConsultationForm(service.title)}
                    >
                      Get Free Consultation
                    </button>
                    {service.id ? (
                      <Link className="cta outline" to={`/services/${service.id}`}>
                        Learn More
                      </Link>
                    ) : (
                      <span className="cta outline disabled">Learn More</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {isConsultationOpen && (
        <ConsultationModal
          onClose={() => setIsConsultationOpen(false)}
          defaultServiceName={selectedServiceName}
        />
      )}
    </>
  )

  if (embedded) {
    return <div id="services-page">{servicesContent}</div>
  }

  return <PageFrame id="services-page">{servicesContent}</PageFrame>
}

export default Services
