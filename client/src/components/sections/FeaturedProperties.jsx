import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { MapPin, Maximize2, BedDouble, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import SectionHeading from "../ui/SectionHeading";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { fadeUp, staggerContainer } from "../../utils/animations";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const TABS = ["All", "Villas", "Apartments", "Commercial", "Plots"];

const TAB_MAP = {
  All: null,
  Villas: "Villa",
  Apartments: "Apartment",
  Commercial: "Commercial",
  Plots: "Plot",
};

function getPropertyImage(property) {
  if (property.image) return property.image;
  if (property.images && property.images.length > 0) return property.images[0];
  return "";
}

function getPropertyType(property) {
  return property.propertyType || property.type || "";
}

function getPropertyArea(property) {
  if (typeof property.area === "number") return `${property.area.toLocaleString()} sq.ft`;
  return property.area || "";
}

function PropertyCard({ property, index }) {
  const { isDark } = useTheme();

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className={`group rounded-2xl overflow-hidden h-full ${
        isDark ? "glass" : "glass-light"
      } hover:luxury-shadow transition-all duration-500`}
    >
      <Link to={`/properties/${property.slug}`} className="block h-full">
        {/* Image */}
        <div className="relative h-56 sm:h-64 overflow-hidden">
          <img
            src={getPropertyImage(property)}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {/* Price badge */}
          <div className="absolute top-4 left-4 px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-body font-bold text-sm rounded-full shadow-lg">
            {property.price}
          </div>
          {/* Type badge */}
          <div
            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-body font-semibold tracking-wide ${
              isDark
                ? "bg-luxury-950/70 text-luxury-100 backdrop-blur-md"
                : "bg-white/80 text-luxury-900 backdrop-blur-md"
            }`}
          >
            {getPropertyType(property)}
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <h3
            className={`font-heading text-xl sm:text-2xl font-bold mb-2 transition-colors duration-300 ${
              isDark
                ? "text-luxury-100 group-hover:text-gold-400"
                : "text-luxury-900 group-hover:text-gold-600"
            }`}
          >
            {property.title}
          </h3>

          <div className="flex items-center gap-1.5 mb-4">
            <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0" />
            <span
              className={`text-sm font-body ${
                isDark ? "text-luxury-300" : "text-luxury-600"
              }`}
            >
              {property.location}
            </span>
          </div>

          {/* Stats */}
          <div
            className={`flex items-center gap-4 pt-4 border-t ${
              isDark ? "border-white/10" : "border-luxury-200"
            }`}
          >
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1.5">
                <BedDouble
                  className={`w-4 h-4 ${
                    isDark ? "text-luxury-400" : "text-luxury-500"
                  }`}
                />
                <span
                  className={`text-sm font-body ${
                    isDark ? "text-luxury-300" : "text-luxury-600"
                  }`}
                >
                  {property.bedrooms} Beds
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Maximize2
                className={`w-4 h-4 ${
                  isDark ? "text-luxury-400" : "text-luxury-500"
                }`}
              />
              <span
                className={`text-sm font-body ${
                  isDark ? "text-luxury-300" : "text-luxury-600"
                }`}
              >
                {getPropertyArea(property)}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 mt-4 text-gold-500 font-body font-semibold text-sm group-hover:gap-3 transition-all duration-300">
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function SkeletonCard() {
  const { isDark } = useTheme();
  return (
    <div
      className={`rounded-2xl overflow-hidden h-full animate-pulse ${
        isDark ? "bg-luxury-800/50" : "bg-luxury-100"
      }`}
    >
      <div className={`h-56 sm:h-64 ${isDark ? "bg-luxury-800" : "bg-luxury-200"}`} />
      <div className="p-5 sm:p-6 space-y-3">
        <div className={`h-6 rounded ${isDark ? "bg-luxury-800" : "bg-luxury-200"} w-3/4`} />
        <div className={`h-4 rounded ${isDark ? "bg-luxury-800" : "bg-luxury-200"} w-1/2`} />
        <div className={`h-4 rounded ${isDark ? "bg-luxury-800" : "bg-luxury-200"} w-2/3 mt-4`} />
      </div>
    </div>
  );
}

export default function FeaturedProperties() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState("All");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { ref: sectionRef, controls } = useScrollAnimation();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    fetch("/api/properties/featured")
      .then((r) => r.json())
      .then((data) => setProperties(Array.isArray(data) ? data : []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    TAB_MAP[activeTab] === null
      ? properties
      : properties.filter((p) => getPropertyType(p) === TAB_MAP[activeTab]);

  return (
    <section id="properties" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Featured Properties"
          subtitle="Curated Collection"
        />

        {/* Filter Tabs */}
        <motion.div
          ref={sectionRef}
          variants={staggerContainer}
          initial="hidden"
          animate={controls}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12"
        >
          {TABS.map((tab) => (
            <motion.button
              key={tab}
              variants={fadeUp}
              onClick={() => setActiveTab(tab)}
              className={`relative px-5 py-2.5 rounded-full font-body text-sm sm:text-base font-medium transition-all duration-300 cursor-pointer ${
                activeTab === tab
                  ? "text-white"
                  : isDark
                    ? "text-luxury-300 hover:text-luxury-100"
                    : "text-luxury-600 hover:text-luxury-900"
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-gold-500 to-gold-600 rounded-full"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Swiper */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }, (_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p
              className={`text-lg font-body ${
                isDark ? "text-luxury-400" : "text-luxury-500"
              }`}
            >
              No featured properties available right now.
            </p>
          </div>
        ) : (
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={24}
                  slidesPerView={1}
                  navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                  }}
                  onBeforeInit={(swiper) => {
                    if (typeof swiper.params.navigation === "object") {
                      swiper.params.navigation.prevEl = prevRef.current;
                      swiper.params.navigation.nextEl = nextRef.current;
                    }
                  }}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                  }}
                  className="!pb-14"
                >
                  {filtered.map((property, index) => (
                    <SwiperSlide key={property._id} className="!h-auto">
                      <PropertyCard property={property} index={index} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </motion.div>
            </AnimatePresence>

            {/* Custom navigation arrows */}
            <button
              ref={prevRef}
              className={`absolute top-1/2 -translate-y-1/2 -left-2 sm:-left-5 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                isDark
                  ? "glass text-white hover:bg-white/10"
                  : "glass-light text-luxury-900 hover:bg-white"
              } luxury-shadow`}
              aria-label="Previous property"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              ref={nextRef}
              className={`absolute top-1/2 -translate-y-1/2 -right-2 sm:-right-5 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                isDark
                  ? "glass text-white hover:bg-white/10"
                  : "glass-light text-luxury-900 hover:bg-white"
              } luxury-shadow`}
              aria-label="Next property"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Swiper pagination color override */}
      <style>{`
        .swiper-pagination-bullet {
          background: var(--color-gold-500) !important;
          opacity: 0.4;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.3);
        }
      `}</style>
    </section>
  );
}
