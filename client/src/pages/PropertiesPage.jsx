import { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, BedDouble, Bath, Maximize, Search, SlidersHorizontal } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { formatArea } from '../data/properties'
import SectionHeading from '../components/ui/SectionHeading'
import { fadeUp, staggerContainer } from '../utils/animations'

const TYPES = ['All', 'Villa', 'Apartment', 'Commercial', 'Plot']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'price-low', label: 'Price: Low to High' },
]
const BEDROOM_OPTIONS = [
  { value: '', label: 'Any Bedrooms' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
  { value: '5', label: '5+' },
]
const PRICE_OPTIONS = [
  { value: '', label: 'Any Price', minPrice: '', maxPrice: '' },
  { value: 'under-1cr', label: 'Under ₹1 Cr', minPrice: '', maxPrice: '10000000' },
  { value: '1-2cr', label: '₹1 - 2 Cr', minPrice: '10000000', maxPrice: '20000000' },
  { value: '2-5cr', label: '₹2 - 5 Cr', minPrice: '20000000', maxPrice: '50000000' },
  { value: '5cr-plus', label: '₹5 Cr+', minPrice: '50000000', maxPrice: '' },
]

function SkeletonCard() {
  const { isDark } = useTheme()
  return (
    <div className={`rounded-2xl overflow-hidden animate-pulse ${isDark ? 'bg-luxury-900/50' : 'bg-white'} luxury-shadow`}>
      <div className={`h-64 ${isDark ? 'bg-luxury-800' : 'bg-luxury-200'}`} />
      <div className="p-6 space-y-3">
        <div className={`h-5 rounded ${isDark ? 'bg-luxury-800' : 'bg-luxury-200'} w-3/4`} />
        <div className={`h-4 rounded ${isDark ? 'bg-luxury-800' : 'bg-luxury-200'} w-1/2`} />
        <div className={`h-4 rounded ${isDark ? 'bg-luxury-800' : 'bg-luxury-200'} w-2/3 mt-4`} />
      </div>
    </div>
  )
}

export default function PropertiesPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [activeType, setActiveType] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [bedrooms, setBedrooms] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const selectedPriceOption = useMemo(
    () => PRICE_OPTIONS.find(opt => opt.value === priceRange) || PRICE_OPTIONS[0],
    [priceRange]
  )

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (activeType !== 'All') params.set('propertyType', activeType)
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (sortBy) params.set('sort', sortBy)
    if (bedrooms) params.set('bedrooms', bedrooms)
    if (selectedPriceOption.minPrice) params.set('minPrice', selectedPriceOption.minPrice)
    if (selectedPriceOption.maxPrice) params.set('maxPrice', selectedPriceOption.maxPrice)

    let cancelled = false
    fetch(`/api/properties?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return
        setProperties(Array.isArray(data) ? data : data.properties || [])
      })
      .catch(() => {
        if (!cancelled) setProperties([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [activeType, debouncedSearch, sortBy, bedrooms, selectedPriceOption])

  return (
    <>
      <Helmet>
        <title>Properties | Avikesh Realty</title>
        <meta name="description" content="Browse our collection of premium villas, apartments, commercial spaces and plots across Hyderabad." />
      </Helmet>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Our Properties"
            subtitle="Explore our curated collection of premium real estate"
            centered
          />

          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap justify-center gap-3">
              {TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeType === type
                      ? 'bg-gold-500 text-white'
                      : isDark
                        ? 'bg-luxury-800 text-luxury-300 hover:bg-luxury-700'
                        : 'bg-luxury-100 text-luxury-600 hover:bg-luxury-200'
                  }`}
                >
                  {type === 'All' ? 'All Properties' : `${type}s`}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full ${isDark ? 'bg-luxury-800' : 'bg-luxury-100'}`}>
                <Search size={16} className="text-luxury-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className={`bg-transparent outline-none text-sm w-40 ${isDark ? 'text-luxury-100 placeholder:text-luxury-500' : 'text-luxury-900 placeholder:text-luxury-400'}`}
                />
              </div>

              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full ${isDark ? 'bg-luxury-800' : 'bg-luxury-100'}`}>
                <BedDouble size={16} className="text-luxury-400" />
                <select
                  value={bedrooms}
                  onChange={e => setBedrooms(e.target.value)}
                  className={`bg-transparent outline-none text-sm ${isDark ? 'text-luxury-100' : 'text-luxury-900'}`}
                >
                  {BEDROOM_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full ${isDark ? 'bg-luxury-800' : 'bg-luxury-100'}`}>
                <span className="text-luxury-400 text-sm font-semibold">₹</span>
                <select
                  value={priceRange}
                  onChange={e => setPriceRange(e.target.value)}
                  className={`bg-transparent outline-none text-sm ${isDark ? 'text-luxury-100' : 'text-luxury-900'}`}
                >
                  {PRICE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full ${isDark ? 'bg-luxury-800' : 'bg-luxury-100'}`}>
                <SlidersHorizontal size={16} className="text-luxury-400" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className={`bg-transparent outline-none text-sm ${isDark ? 'text-luxury-100' : 'text-luxury-900'}`}
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }, (_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {properties.map(property => (
                  <motion.div
                    key={property._id}
                    variants={fadeUp}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Link
                      to={`/properties/${property.slug}`}
                      className={`group block rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
                        isDark ? 'bg-luxury-900/50 hover:luxury-glow' : 'bg-white hover:shadow-2xl'
                      } luxury-shadow`}
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={property.images?.[0]}
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gold-500 text-white">
                            {property.propertyType}
                          </span>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <p className="text-2xl font-bold text-white font-heading">{property.price}</p>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className={`text-lg font-semibold font-heading mb-2 ${isDark ? 'text-luxury-100' : 'text-luxury-900'}`}>
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-gold-500 mb-4">
                          <MapPin size={14} />
                          <span className="text-sm">{property.location}</span>
                        </div>
                        <div className={`flex items-center gap-6 text-sm ${isDark ? 'text-luxury-400' : 'text-luxury-500'}`}>
                          {property.bedrooms && (
                            <div className="flex items-center gap-1.5">
                              <BedDouble size={14} />
                              <span>{property.bedrooms} Beds</span>
                            </div>
                          )}
                          {property.bathrooms && (
                            <div className="flex items-center gap-1.5">
                              <Bath size={14} />
                              <span>{property.bathrooms} Baths</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <Maximize size={14} />
                            <span>{formatArea(property.area)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && properties.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className={`text-lg ${isDark ? 'text-luxury-400' : 'text-luxury-500'}`}>
                No properties found matching your criteria.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}
