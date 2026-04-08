import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Hero from '../components/Hero'
import PageFrame from '../components/layout/PageFrame'
import PartnerMarquee from '../components/partners/PartnerMarquee'
import { selectPartners, selectPartnersError, selectPartnersStatus } from '../Redux/slices/partnerSlice'
import { fetchPartners } from '../Redux/thunks/partnerThunks'

function Home() {
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
    <PageFrame id="home">
      <Hero />
      <PartnerMarquee partners={partners} status={status} error={error} />
    </PageFrame>
  )
}

export default Home
