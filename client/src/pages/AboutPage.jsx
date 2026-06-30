import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import { useSettings } from '../hooks/useSettings'
import WhyChooseUs from '../components/sections/WhyChooseUs'
import LuxuryExperience from '../components/sections/LuxuryExperience'
import Team from '../components/sections/Team'
import AnimatedText from '../components/ui/AnimatedText'
import { fadeUp } from '../utils/animations'

export default function AboutPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { settings } = useSettings()

  return (
    <>
      <Helmet>
        <title>About Us | Avikesh Realty</title>
        <meta name="description" content="Learn about Avikesh Realty's journey of 15+ years in luxury real estate across Hyderabad." />
      </Helmet>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedText
            text={settings.about.storyHeading}
            tag="h1"
            className={`text-5xl md:text-7xl font-heading font-bold mb-8 ${isDark ? 'text-luxury-50' : 'text-luxury-900'}`}
          />
          <motion.p
            {...fadeUp}
            transition={{ delay: 0.3 }}
            className={`text-lg md:text-xl leading-relaxed ${isDark ? 'text-luxury-300' : 'text-luxury-600'}`}
          >
            {settings.about.storyParagraph}
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
                alt="Luxury property"
                className="rounded-2xl luxury-shadow"
                loading="lazy"
              />
              <div className="absolute -bottom-8 -right-8 bg-gold-500 text-white rounded-2xl p-8 hidden md:block">
                <p className="text-4xl font-heading font-bold">15+</p>
                <p className="text-sm">Years of Excellence</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-3xl md:text-4xl font-heading font-bold mb-6 ${isDark ? 'text-luxury-50' : 'text-luxury-900'}`}>
                {settings.about.legacyHeading}
              </h2>
              <div className={`space-y-4 text-lg leading-relaxed ${isDark ? 'text-luxury-300' : 'text-luxury-600'}`}>
                {settings.about.legacyParagraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <LuxuryExperience />
      <Team />
    </>
  )
}
