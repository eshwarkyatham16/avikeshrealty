import { Helmet } from 'react-helmet-async'
import Hero from '../components/sections/Hero'
import FeaturedProperties from '../components/sections/FeaturedProperties'
import WhyChooseUs from '../components/sections/WhyChooseUs'
import LuxuryExperience from '../components/sections/LuxuryExperience'
import Testimonials from '../components/sections/Testimonials'
import Team from '../components/sections/Team'
import Contact from '../components/sections/Contact'

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Avikesh Realty | Where Luxury Meets Opportunity</title>
        <meta name="description" content="Discover premium villas, apartments and investment properties across Hyderabad. Avikesh Realty - Where Luxury Meets Opportunity." />
      </Helmet>
      <Hero />
      <FeaturedProperties />
      <WhyChooseUs />
      <LuxuryExperience />
      <Testimonials />
      <Team />
      <Contact />
    </>
  )
}
