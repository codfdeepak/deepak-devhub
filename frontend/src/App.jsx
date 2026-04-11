import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import AppLayout from './components/layout/AppLayout'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import Enquiry from './pages/Enquiry'
import Home from './pages/Home'
import Partners from './pages/Partners'
import ProfileDetails from './pages/ProfileDetails'
import ServiceDetails from './pages/ServiceDetails'
import Services from './pages/Services'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:serviceId" element={<ServiceDetails />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/profile/:userId" element={<ProfileDetails />} />
        <Route path="/enquiry" element={<Enquiry />} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
