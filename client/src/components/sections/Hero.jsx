import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import MagneticButton from "../ui/MagneticButton";

const HERO_BG =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80";

const PARTICLE_COUNT = 35;

function generateParticles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.4 + 0.1,
  }));
}

const wordRevealVariant = {
  hidden: {
    opacity: 0,
    y: 60,
    rotateX: -50,
    filter: "blur(8px)",
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      delay: i * 0.12,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

const subtitleVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 1.0, ease: [0.25, 0.4, 0.25, 1] },
  },
};

const ctaVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 1.3 + i * 0.15,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

const scrollIndicatorVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, delay: 2.0 },
  },
};

function Particle({ particle }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: particle.size,
        height: particle.size,
        background: `radial-gradient(circle, rgba(212, 136, 42, ${particle.opacity}), transparent)`,
        boxShadow: `0 0 ${particle.size * 2}px rgba(212, 136, 42, ${particle.opacity * 0.5})`,
      }}
      animate={{
        y: [0, -80, -160],
        x: [0, Math.random() * 40 - 20, Math.random() * 60 - 30],
        opacity: [particle.opacity, particle.opacity * 1.5, 0],
        scale: [1, 1.3, 0.5],
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

function ParticleField({ particles }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {particles.map((p) => (
        <Particle key={p.id} particle={p} />
      ))}
    </div>
  );
}

export default function Hero() {
  const { isDark } = useTheme();
  const containerRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const particles = useMemo(() => generateParticles(PARTICLE_COUNT), []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 50, damping: 30, mass: 1 };
  const bgX = useSpring(mouseX, springConfig);
  const bgY = useSpring(mouseY, springConfig);

  const handleMouseMove = useCallback(
    (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = ((e.clientX - rect.left - centerX) / centerX) * -15;
      const deltaY = ((e.clientY - rect.top - centerY) / centerY) * -10;
      mouseX.set(deltaX);
      mouseY.set(deltaY);
    },
    [mouseX, mouseY]
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.25]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.55, 0.85]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  useEffect(() => {
    const img = new Image();
    img.src = HERO_BG;
    img.onload = () => setImageLoaded(true);
  }, []);

  const line1Words = ["Where", "Luxury", "Meets"];
  const line2Words = ["Opportunity"];

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Background image with parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ x: bgX, y: bgY, scale: bgScale }}
      >
        <motion.img
          src={HERO_BG}
          alt="Luxury property exterior"
          className="w-full h-full object-cover"
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: imageLoaded ? 1 : 0,
          }}
          transition={{ duration: 1.8, ease: [0.25, 0.4, 0.25, 1] }}
        />
      </motion.div>

      {/* Dark gradient overlay */}
      <motion.div
        className="absolute inset-0 z-[1]"
        style={{ opacity: overlayOpacity }}
      >
        <div
          className={`w-full h-full ${
            isDark
              ? "bg-gradient-to-b from-luxury-950/70 via-luxury-950/50 to-luxury-950"
              : "bg-gradient-to-b from-black/60 via-black/40 to-luxury-950/90"
          }`}
        />
      </motion.div>

      {/* Vignette */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Particles */}
      <ParticleField particles={particles} />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Main heading line 1 */}
        <h1
          className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-tight mb-2"
          style={{ perspective: "1000px" }}
        >
          <span className="block">
            {line1Words.map((word, i) => (
              <motion.span
                key={word}
                className="inline-block mr-[0.25em] text-white"
                variants={wordRevealVariant}
                initial="hidden"
                animate="visible"
                custom={i}
                style={{ willChange: "transform, opacity, filter" }}
              >
                {word}
              </motion.span>
            ))}
          </span>

          {/* Line 2 with gold gradient */}
          <span className="block mt-2" style={{ perspective: "1000px" }}>
            {line2Words.map((word, i) => (
              <motion.span
                key={word}
                className="inline-block text-gradient"
                variants={wordRevealVariant}
                initial="hidden"
                animate="visible"
                custom={i + line1Words.length}
                style={{ willChange: "transform, opacity, filter" }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          variants={subtitleVariant}
          initial="hidden"
          animate="visible"
          className="font-body text-lg sm:text-xl md:text-2xl text-luxury-200/90 max-w-2xl mx-auto mt-6 mb-10 leading-relaxed"
        >
          Discover premium villas, apartments and investment properties across
          Hyderabad.
        </motion.p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
          <motion.div
            variants={ctaVariant}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <MagneticButton
              href="#properties"
              className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-body font-semibold text-base sm:text-lg rounded-full hover:from-gold-600 hover:to-gold-700 transition-all duration-300 luxury-shadow tracking-wide"
            >
              Explore Properties
            </MagneticButton>
          </motion.div>

          <motion.div
            variants={ctaVariant}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <MagneticButton
              href="#contact"
              className="px-8 py-4 glass border border-white/20 text-white font-body font-semibold text-base sm:text-lg rounded-full hover:bg-white/10 transition-all duration-300 tracking-wide"
            >
              Contact Advisor
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        variants={scrollIndicatorVariant}
        initial="hidden"
        animate="visible"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() =>
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
        }
      >
        <span className="text-xs font-body tracking-[0.3em] uppercase text-luxury-300/70">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-6 h-6 text-gold-400/80" />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-32 z-[3] pointer-events-none ${
          isDark
            ? "bg-gradient-to-t from-luxury-950 to-transparent"
            : "bg-gradient-to-t from-white to-transparent"
        }`}
      />
    </section>
  );
}
