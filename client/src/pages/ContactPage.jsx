import { Helmet } from 'react-helmet-async'
import Contact from '../components/sections/Contact'
import AnimatedText from '../components/ui/AnimatedText'
import { useTheme } from '../hooks/useTheme'

export default function ContactPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <>
      <Helmet>
        <title>Contact Us | Avikesh Realty</title>
        <meta name="description" content="Get in touch with Avikesh Realty. Book a consultation or schedule a site visit for premium properties in Hyderabad." />
      </Helmet>
      <section className="pt-32 pb-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedText
            text="Let's Connect"
            tag="h1"
            className={`text-5xl md:text-7xl font-heading font-bold mb-6 ${isDark ? 'text-luxury-50' : 'text-luxury-900'}`}
          />
          <p className={`text-lg ${isDark ? 'text-luxury-300' : 'text-luxury-600'}`}>
            Ready to find your dream property? Our team of experts is here to guide you every step of the way.
          </p>
        </div>
      </section>
      <Contact />
    </>
  )
}
