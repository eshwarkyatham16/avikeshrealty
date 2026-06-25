import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import { Star, Quote } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import SectionHeading from "../ui/SectionHeading";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { fadeUp, staggerContainer } from "../../utils/animations";
import testimonials from "../../data/testimonials";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? "text-gold-400 fill-gold-400"
              : "text-luxury-600"
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }) {
  const { isDark } = useTheme();

  return (
    <div
      className={`relative p-8 sm:p-10 rounded-3xl h-full flex flex-col ${
        isDark
          ? "glass hover:luxury-glow"
          : "glass-light hover:luxury-shadow"
      } transition-all duration-500`}
    >
      {/* Quote icon */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8">
        <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-gold-500/20" />
      </div>

      {/* Stars */}
      <div className="mb-6">
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Quote text */}
      <blockquote
        className={`font-body text-base sm:text-lg leading-relaxed mb-8 flex-1 ${
          isDark ? "text-luxury-200" : "text-luxury-700"
        }`}
      >
        &ldquo;{testimonial.content || testimonial.quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={testimonial.image || testimonial.photo}
            alt={testimonial.name}
            className="w-14 h-14 rounded-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 rounded-full border-2 border-gold-500/30" />
        </div>
        <div>
          <h4
            className={`font-heading text-base sm:text-lg font-bold ${
              isDark ? "text-luxury-100" : "text-luxury-900"
            }`}
          >
            {testimonial.name}
          </h4>
          <p className="font-body text-sm text-gold-500">
            {testimonial.role}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const { isDark } = useTheme();
  const { ref, controls } = useScrollAnimation();

  return (
    <section
      className={`py-20 md:py-28 relative overflow-hidden ${
        isDark ? "bg-luxury-900/30" : "bg-luxury-50"
      }`}
    >
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl ${
            isDark ? "bg-gold-500/3" : "bg-gold-200/15"
          }`}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          title="What Our Clients Say"
          subtitle="Testimonials"
        />

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={controls}
        >
          <motion.div variants={fadeUp}>
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
              spaceBetween={24}
              slidesPerView={1}
              effect="coverflow"
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 80,
                modifier: 1,
                slideShadows: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              autoplay={{
                delay: 6000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={true}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: {
                  slidesPerView: 2,
                  effect: "slide",
                },
                1024: {
                  slidesPerView: 3,
                  effect: "slide",
                },
              }}
              className="!pb-14"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id} className="!h-auto">
                  <TestimonialCard testimonial={testimonial} />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </motion.div>
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
