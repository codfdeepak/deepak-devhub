import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import ConsultationModal from '../components/consultation/ConsultationModal'
import PageFrame from '../components/layout/PageFrame'
import ecommerceServiceImage from '../assets/ecommerce-service.svg'
import {
  selectActiveService,
  selectServiceDetailError,
  selectServiceDetailStatus,
} from '../Redux/slices/serviceSlice'
import { fetchPublicServiceById } from '../Redux/thunks/serviceThunks'

function ServiceDetails() {
  const { serviceId } = useParams()
  const dispatch = useDispatch()
  const service = useSelector(selectActiveService)
  const status = useSelector(selectServiceDetailStatus)
  const error = useSelector(selectServiceDetailError)
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)

  useEffect(() => {
    if (serviceId) {
      dispatch(fetchPublicServiceById(serviceId))
    }
  }, [dispatch, serviceId])

  const snapshots = Array.isArray(service?.snapshots) ? service.snapshots : []
  const bulletPoints = Array.isArray(service?.bulletPoints) ? service.bulletPoints : []
  const heroImage = service?.image || snapshots[0] || ecommerceServiceImage

  return (
    <PageFrame id="service-details-page">
      <section className="panel service-details-top">
        <div className="service-details-nav">
          <Link className="pill small profile-back-link" to="/services">
            ← Back to Services
          </Link>
          <span className="pill small">Service Details</span>
        </div>
      </section>

      {status === 'loading' && (
        <section className="panel">
          <p className="muted">Loading service details...</p>
        </section>
      )}

      {status === 'error' && (
        <section className="panel">
          <p className="muted">Unable to load service details. {error}</p>
        </section>
      )}

      {status === 'loaded' && !service && (
        <section className="panel">
          <p className="muted">Service not found.</p>
        </section>
      )}

      {service && (
        <>
          <section className="panel service-details-hero">
            <div className="service-details-image-wrap">
              <img
                src={heroImage}
                alt={service?.name ? `${service.name} primary image` : 'Service primary image'}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = ecommerceServiceImage
                }}
              />
            </div>

            <div className="service-details-copy">
              <span className="pill small">Detailed View</span>
              <h1>{service.name || 'Service'}</h1>
              <p className="muted">{service.description}</p>

              {bulletPoints.length > 0 && (
                <ul className="service-details-bullets">
                  {bulletPoints.map((point, index) => (
                    <li key={`detail-point-${index}`}>{point}</li>
                  ))}
                </ul>
              )}

              <div className="service-details-actions">
                <button
                  className="cta primary cta-btn"
                  type="button"
                  onClick={() => setIsConsultationOpen(true)}
                >
                  Get Free Consultation
                </button>
              </div>
            </div>
          </section>

          <section className="panel service-details-gallery-panel">
            <div className="panel-head">
              <h2>Service Snapshots</h2>
              <span className="pill small">{snapshots.length} Images</span>
            </div>

            {snapshots.length === 0 && <p className="muted">No snapshots uploaded for this service yet.</p>}

            {snapshots.length > 0 && (
              <div className="service-details-gallery">
                {snapshots.map((snapshot, index) => (
                  <div className="service-details-shot" key={`snapshot-${index}`}>
                    <img
                      src={snapshot}
                      alt={`${service.name || 'Service'} snapshot ${index + 1}`}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror = null
                        event.currentTarget.src = ecommerceServiceImage
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {isConsultationOpen && (
        <ConsultationModal
          onClose={() => setIsConsultationOpen(false)}
          defaultServiceName={service?.name || ''}
        />
      )}
    </PageFrame>
  )
}

export default ServiceDetails
