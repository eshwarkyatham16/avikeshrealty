import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, BedDouble, Bath, Maximize, Download, Play, X, ChevronLeft,
  ChevronRight, Share2, Heart, Building, Trees, Car, Dumbbell, Shield,
  Waves, Wifi, Wind, ArrowLeft
} from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useSettings } from '../hooks/useSettings'
import { getWhatsAppLink } from '../utils/whatsapp'
import { formatArea } from '../data/properties'
import { fadeUp, fadeIn } from '../utils/animations'

const AMENITY_ICONS = {
  'Swimming Pool': Waves,
  'Gym': Dumbbell,
  'Parking': Car,
  'Garden': Trees,
  'Security': Shield,
  'Wi-Fi': Wifi,
  'Club House': Building,
  'AC': Wind,
}

export default function PropertyDetailPage() {
  const { slug } = useParams()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { settings } = useSettings()
  const [activeImage, setActiveImage] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [liked, setLiked] = useState(false)
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    setProperty(null)
    setActiveImage(0)

    fetch(`/api/properties/${slug}`)
      .then(res => {
        if (res.status === 404) {
          if (!cancelled) setNotFound(true)
          return null
        }
        if (!res.ok) throw new Error('Failed to fetch property')
        return res.json()
      })
      .then(data => {
        if (!cancelled && data) setProperty(data)
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="w-12 h-12 rounded-full border-2 border-gold-500/30 border-t-gold-500 animate-spin" />
      </div>
    )
  }

  if (notFound || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="text-4xl font-heading font-bold mb-4">Property Not Found</h1>
          <Link to="/properties" className="text-gold-500 hover:text-gold-400 transition-colors">
            Browse All Properties
          </Link>
        </div>
      </div>
    )
  }

  const nextImage = () => setActiveImage(i => (i + 1) % property.images.length)
  const prevImage = () => setActiveImage(i => (i - 1 + property.images.length) % property.images.length)

  return (
    <>
      <Helmet>
        <title>{property.title} | Avikesh Realty</title>
        <meta name="description" content={property.description} />
      </Helmet>

      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <button onClick={() => setShowGallery(false)} className="absolute top-6 right-6 text-white z-10 hover:text-gold-400 transition-colors">
              <X size={32} />
            </button>
            <button onClick={prevImage} className="absolute left-6 text-white hover:text-gold-400 transition-colors">
              <ChevronLeft size={40} />
            </button>
            <button onClick={nextImage} className="absolute right-6 text-white hover:text-gold-400 transition-colors">
              <ChevronRight size={40} />
            </button>
            <motion.img
              key={activeImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              src={property.images[activeImage]}
              alt={property.title}
              className="max-w-[90vw] max-h-[90vh] object-contain"
            />
            <div className="absolute bottom-6 text-white text-sm">
              {activeImage + 1} / {property.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeIn} className="mb-8">
            <Link to="/properties" className={`inline-flex items-center gap-2 text-sm transition-colors ${isDark ? 'text-luxury-400 hover:text-gold-400' : 'text-luxury-500 hover:text-gold-600'}`}>
              <ArrowLeft size={16} />
              Back to Properties
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-16 rounded-2xl overflow-hidden">
            <motion.div
              {...fadeIn}
              className="relative h-[500px] cursor-pointer group"
              onClick={() => { setActiveImage(0); setShowGallery(true) }}
            >
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-lg font-medium">View Gallery</span>
              </div>
            </motion.div>
            <div className="grid grid-cols-2 gap-2 h-[500px]">
              {property.images.slice(1, 5).map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * (i + 1) }}
                  className="relative cursor-pointer group overflow-hidden"
                  onClick={() => { setActiveImage(i + 1); setShowGallery(true) }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  {i === 3 && property.images.length > 5 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-lg font-medium">+{property.images.length - 5} more</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <motion.div {...fadeUp}>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gold-500 text-white mb-3">
                      {property.propertyType}
                    </span>
                    <h1 className={`text-3xl md:text-4xl font-heading font-bold mb-2 ${isDark ? 'text-luxury-50' : 'text-luxury-900'}`}>
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-1.5 text-gold-500">
                      <MapPin size={16} />
                      <span>{property.location}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setLiked(!liked)}
                      className={`p-3 rounded-full transition-all ${isDark ? 'bg-luxury-800 hover:bg-luxury-700' : 'bg-luxury-100 hover:bg-luxury-200'}`}
                    >
                      <Heart size={20} className={liked ? 'fill-red-500 text-red-500' : ''} />
                    </button>
                    <button className={`p-3 rounded-full transition-all ${isDark ? 'bg-luxury-800 hover:bg-luxury-700' : 'bg-luxury-100 hover:bg-luxury-200'}`}>
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>

                <div className={`flex flex-wrap gap-8 py-6 mb-8 border-y ${isDark ? 'border-luxury-800' : 'border-luxury-200'}`}>
                  {property.bedrooms && (
                    <div className="flex items-center gap-2">
                      <BedDouble size={20} className="text-gold-500" />
                      <div>
                        <p className={`text-sm ${isDark ? 'text-luxury-400' : 'text-luxury-500'}`}>Bedrooms</p>
                        <p className="font-semibold">{property.bedrooms}</p>
                      </div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-2">
                      <Bath size={20} className="text-gold-500" />
                      <div>
                        <p className={`text-sm ${isDark ? 'text-luxury-400' : 'text-luxury-500'}`}>Bathrooms</p>
                        <p className="font-semibold">{property.bathrooms}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Maximize size={20} className="text-gold-500" />
                    <div>
                      <p className={`text-sm ${isDark ? 'text-luxury-400' : 'text-luxury-500'}`}>Area</p>
                      <p className="font-semibold">{formatArea(property.area)}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-12">
                  <h2 className={`text-2xl font-heading font-semibold mb-4 ${isDark ? 'text-luxury-100' : 'text-luxury-900'}`}>
                    About This Property
                  </h2>
                  <p className={`leading-relaxed ${isDark ? 'text-luxury-300' : 'text-luxury-600'}`}>
                    {property.description}
                  </p>
                </div>

                <div className="mb-12">
                  <h2 className={`text-2xl font-heading font-semibold mb-6 ${isDark ? 'text-luxury-100' : 'text-luxury-900'}`}>
                    Amenities
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity, i) => {
                      const Icon = AMENITY_ICONS[amenity] || Building
                      return (
                        <motion.div
                          key={amenity}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          viewport={{ once: true }}
                          className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-luxury-900/50' : 'bg-luxury-50'}`}
                        >
                          <Icon size={20} className="text-gold-500" />
                          <span className="text-sm font-medium">{amenity}</span>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {property.videos && property.videos.length > 0 && (
                  <div className="mb-12">
                    <h2 className={`text-2xl font-heading font-semibold mb-6 ${isDark ? 'text-luxury-100' : 'text-luxury-900'}`}>
                      Video Walkthrough
                    </h2>
                    <div className={`relative rounded-2xl overflow-hidden aspect-video ${isDark ? 'bg-luxury-900' : 'bg-luxury-100'} flex items-center justify-center`}>
                      <Play size={64} className="text-gold-500" />
                      <p className={`absolute bottom-4 text-sm ${isDark ? 'text-luxury-400' : 'text-luxury-500'}`}>Video walkthrough coming soon</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className={`sticky top-28 rounded-2xl p-8 ${isDark ? 'bg-luxury-900/80 glass' : 'bg-white glass-light luxury-shadow'}`}
              >
                <div className="mb-6">
                  <p className={`text-sm ${isDark ? 'text-luxury-400' : 'text-luxury-500'}`}>Price</p>
                  <p className="text-3xl font-heading font-bold text-gradient">{property.price}</p>
                </div>

                <div className={`space-y-4 pb-6 mb-6 border-b ${isDark ? 'border-luxury-800' : 'border-luxury-200'}`}>
                  <h3 className="font-semibold text-lg">Investment Highlights</h3>
                  <ul className={`space-y-3 text-sm ${isDark ? 'text-luxury-300' : 'text-luxury-600'}`}>
                    <li className="flex items-start gap-2">
                      <span className="text-gold-500 mt-0.5">&#10003;</span>
                      Premium location with high appreciation potential
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold-500 mt-0.5">&#10003;</span>
                      World-class amenities and infrastructure
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold-500 mt-0.5">&#10003;</span>
                      RERA approved and legally verified
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold-500 mt-0.5">&#10003;</span>
                      Flexible payment plans available
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <a
                    href={getWhatsAppLink(
                      settings.whatsappNumber,
                      `Hi, I'm interested in ${property.title} (${property.location}). Could you share more details?`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3.5 px-6 rounded-xl bg-gold-500 text-white text-center font-semibold hover:bg-gold-600 transition-colors"
                  >
                    Schedule a Visit
                  </a>
                  <a
                    href={getWhatsAppLink(
                      settings.whatsappNumber,
                      `Hi, I'm interested in ${property.title} (${property.location}). Could you share more details?`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full py-3.5 px-6 rounded-xl text-center font-semibold border transition-colors ${
                      isDark
                        ? 'border-luxury-700 text-luxury-200 hover:bg-luxury-800'
                        : 'border-luxury-200 text-luxury-700 hover:bg-luxury-50'
                    }`}
                  >
                    Contact Advisor
                  </a>
                  {property.brochureUrl && (
                    <button className={`flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl text-sm transition-colors ${isDark ? 'text-luxury-400 hover:text-gold-400' : 'text-luxury-500 hover:text-gold-600'}`}>
                      <Download size={16} />
                      Download Brochure
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
