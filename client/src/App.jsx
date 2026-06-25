import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import LoadingScreen from './components/ui/LoadingScreen'

const HomePage = lazy(() => import('./pages/HomePage'))
const PropertiesPage = lazy(() => import('./pages/PropertiesPage'))
const PropertyDetailPage = lazy(() => import('./pages/PropertyDetailPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminProperties = lazy(() => import('./pages/admin/Properties'))
const AdminLeads = lazy(() => import('./pages/admin/Leads'))
const AdminTestimonials = lazy(() => import('./pages/admin/Testimonials'))
const AdminTeamMembers = lazy(() => import('./pages/admin/TeamMembers'))

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="properties/:slug" element={<PropertyDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="team" element={<AdminTeamMembers />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
