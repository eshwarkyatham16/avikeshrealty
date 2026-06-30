import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import ParallaxImage from "../ui/ParallaxImage";
import { fadeUp, staggerContainer } from "../../utils/animations";

const LUXURY_IMAGE =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80";

const SECONDARY_IMAGE =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80";

const lifestyleFacts = [
  {
    number: "01",
    title: "Bespoke Interiors",
    description:
      "Every property features handcrafted finishes and designer interiors tailored to the most discerning tastes.",
  },
  {
    number: "02",
    title: "Prime Locations",
    description:
      "Nestled in Hyderabad's most exclusive neighborhoods, offering unparalleled connectivity and prestige.",
  },
  {
    number: "03",
    title: "Smart Living",
    description:
      "IoT-enabled smart homes with automated climate, lighting, and security systems for effortless luxury.",
  },
];

function FloatingCard({ fact, index }) {
  const { isDark } = useTheme();

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      className={`relative p-6 sm:p-8 rounded-2xl backdrop-blur-xl transition-all duration-500 ${
        isDark
          ? "bg-white/5 border border-white/10 hover:border-gold-500/30"
          : "bg-white/70 border border-luxury-200 hover:border-gold-400/50 shadow-lg"
      }`}
    >
      <span className="block font-heading text-4xl sm:text-5xl font-bold text-gold-500/20 mb-3">
        {fact.number}
      </span>
      <h4
        className={`font-heading text-lg sm:text-xl font-bold mb-2 ${
          isDark ? "text-luxury-100" : "text-luxury-900"
        }`}
      >
        {fact.title}
      </h4>
      <p
        className={`font-body text-sm leading-relaxed ${
          isDark ? "text-luxury-400" : "text-luxury-600"
        }`}
      >
        {fact.description}
      </p>
    </motion.div>
  );
}

export default function LuxuryExperience() {
  const { isDark } = useTheme();
  const sectionRef = useRef(null);
  const { ref: headingRef, controls: headingControls } = useScrollAnimation();
  const { ref: cardsRef, controls: cardsControls } = useScrollAnimation();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.1, 1]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);
  const floatY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const secondaryY = useTransform(scrollYProgress, [0, 1], [60, -20]);

  return (
    <section
      ref={sectionRef}
      className={`py-20 md:py-32 relative overflow-hidden ${
        isDark ? "bg-luxury-950" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <motion.div
          ref={headingRef}
          variants={staggerContainer}
          initial="hidden"
          animate={headingControls}
          className="text-center mb-16 md:mb-24"
        >
          <motion.p
            variants={fadeUp}
            className="text-sm md:text-base font-body tracking-[0.2em] uppercase mb-4 text-gold-500"
          >
            The Avikesh Lifestyle
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
          >
            <span className={isDark ? "text-luxury-100" : "text-luxury-900"}>
              Experience{" "}
            </span>
            <span className="text-gradient">Luxury</span>
            <br />
            <span className={isDark ? "text-luxury-100" : "text-luxury-900"}>
              Living
            </span>
          </motion.h2>
        </motion.div>

        {/* Layered image layout */}
        <div className="relative mb-16 md:mb-0">
          {/* Main parallax image */}
          <motion.div
            style={{ scale: imageScale, opacity: imageOpacity }}
            className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] rounded-3xl overflow-hidden luxury-shadow"
          >
            <ParallaxImage
              src={LUXURY_IMAGE}
              alt="Luxury living room interior"
              className="w-full h-full"
              speed={0.15}
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

            {/* Floating text on image */}
            <motion.div
              style={{ y: floatY }}
              className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12"
            >
              <p className="font-body text-xs sm:text-sm tracking-[0.25em] uppercase text-gold-300/80 mb-2">
                Crafted for Perfection
              </p>
              <p className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-white max-w-md leading-snug">
                Where every detail tells a story of elegance
              </p>
            </motion.div>
          </motion.div>

          {/* Secondary floating image */}
          <motion.div
            style={{ y: secondaryY }}
            className="hidden md:block absolute -bottom-16 -right-4 lg:right-8 w-64 lg:w-80 h-44 lg:h-56 rounded-2xl overflow-hidden luxury-shadow z-20"
          >
            <img
              src={SECONDARY_IMAGE}
              alt="Luxury property detail"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 border-2 border-gold-500/20 rounded-2xl pointer-events-none" />
          </motion.div>

          {/* Decorative frame */}
          <div className="hidden md:block absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-gold-500/30 rounded-tl-3xl pointer-events-none" />
          <div className="hidden md:block absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-gold-500/30 rounded-br-3xl pointer-events-none" />
        </div>

        {/* Floating glass cards */}
        <motion.div
          ref={cardsRef}
          variants={staggerContainer}
          initial="hidden"
          animate={cardsControls}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-16 md:mt-24"
        >
          {lifestyleFacts.map((fact, index) => (
            <FloatingCard key={fact.number} fact={fact} index={index} />
          ))}
        </motion.div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-1/4 -left-32 w-64 h-64 rounded-full blur-3xl ${
            isDark ? "bg-gold-500/5" : "bg-gold-200/20"
          }`}
        />
        <div
          className={`absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl ${
            isDark ? "bg-gold-600/5" : "bg-gold-300/15"
          }`}
        />
      </div>
    </section>
  );
}
