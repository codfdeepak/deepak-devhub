import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PartnerCardList from '../components/partners/PartnerCardList'
import PageFrame from '../components/layout/PageFrame'
import { selectPartners, selectPartnersError, selectPartnersStatus } from '../Redux/slices/partnerSlice'
import { fetchPartners } from '../Redux/thunks/partnerThunks'

function Partners() {
  const dispatch = useDispatch()
  const partners = useSelector(selectPartners)
  const status = useSelector(selectPartnersStatus)
  const error = useSelector(selectPartnersError)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPartners())
    }
  }, [dispatch, status])

  return (
    <PageFrame id="partners">
      <section className="panel partners-panel">
        <div className="panel-head">
          <h2>Our Partners</h2>
          <span className="pill small">{partners.length} Profiles</span>
        </div>
        <p className="muted">
          Professionals from development and design backgrounds. Ratings are standardized for visual consistency.
        </p>
        <PartnerCardList partners={partners} status={status} error={error} />
      </section>
    </PageFrame>
  )
}

export default Partners
