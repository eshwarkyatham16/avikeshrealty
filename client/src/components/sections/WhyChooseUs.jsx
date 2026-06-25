import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { Shield, TrendingUp, Award } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import SectionHeading from "../ui/SectionHeading";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { fadeUp, staggerContainer, scaleIn, slideInLeft, slideInRight } from "../../utils/animations";

const stats = [
  { value: 15, suffix: "+", label: "Years Experience" },
  { value: 500, suffix: "+", label: "Properties Sold" },
  { value: 1000, suffix: "+", label: "Happy Clients" },
  { prefix: "₹", value: 2000, suffix: " Cr+", label: "Investment Portfolio" },
];

const features = [
  {
    icon: Shield,
    title: "Trusted Expertise",
    description:
      "With over a decade of experience in Hyderabad's premium real estate, we bring unmatched market knowledge and unwavering commitment to every transaction. Your trust is our foundation.",
  },
  {
    icon: TrendingUp,
    title: "Premium Portfolio",
    description:
      "Access an exclusive collection of hand-picked luxury villas, penthouses, commercial spaces, and investment plots in Hyderabad's most coveted neighborhoods.",
  },
  {
    icon: Award,
    title: "Investment Excellence",
    description:
      "Our data-driven investment advisory ensures maximum returns. From property selection to portfolio management, we guide you through every step of your wealth-building journey.",
  },
];

function StatCounter({ stat, index }) {
  const { isDark } = useTheme();
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={index}
      className="text-center px-4"
    >
      <div className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient mb-2">
        {stat.prefix && <span>{stat.prefix}</span>}
        {inView ? (
          <CountUp
            start={0}
            end={stat.value}
            duration={2.5}
            separator=","
            useEasing={true}
          />
        ) : (
          <span>0</span>
        )}
        <span>{stat.suffix}</span>
      </div>
      <p
        className={`font-body text-sm sm:text-base tracking-wide ${
          isDark ? "text-luxury-400" : "text-luxury-600"
        }`}
      >
        {stat.label}
      </p>
    </motion.div>
  );
}

function FeatureCard({ feature, index }) {
  const { isDark } = useTheme();
  const Icon = feature.icon;

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`group relative p-8 sm:p-10 rounded-2xl transition-all duration-500 ${
        isDark ? "glass hover:luxury-glow" : "glass-light hover:luxury-shadow"
      }`}
    >
      {/* Accent line */}
      <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Icon */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-gold-500" strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3
        className={`font-heading text-xl sm:text-2xl font-bold mb-4 transition-colors duration-300 ${
          isDark
            ? "text-luxury-100 group-hover:text-gold-400"
            : "text-luxury-900 group-hover:text-gold-600"
        }`}
      >
        {feature.title}
      </h3>

      {/* Description */}
      <p
        className={`font-body text-sm sm:text-base leading-relaxed ${
          isDark ? "text-luxury-400" : "text-luxury-600"
        }`}
      >
        {feature.description}
      </p>

      {/* Corner accent */}
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gold-500/20 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}

export default function WhyChooseUs() {
  const { isDark } = useTheme();
  const { ref: statsRef, controls: statsControls } = useScrollAnimation();
  const { ref: featuresRef, controls: featuresControls } = useScrollAnimation();

  return (
    <section
      className={`py-20 md:py-28 relative overflow-hidden ${
        isDark ? "bg-luxury-950" : "bg-luxury-50"
      }`}
    >
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl ${
            isDark
              ? "bg-gold-500/5"
              : "bg-gold-300/10"
          }`}
          style={{ transform: "translate(30%, -30%)" }}
        />
        <div
          className={`absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl ${
            isDark
              ? "bg-gold-600/5"
              : "bg-gold-200/15"
          }`}
          style={{ transform: "translate(-30%, 30%)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          title="Why Choose Avikesh Realty"
          subtitle="Our Promise"
        />

        {/* Stats Grid */}
        <motion.div
          ref={statsRef}
          variants={staggerContainer}
          initial="hidden"
          animate={statsControls}
          className={`grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-20 py-12 px-6 sm:px-10 rounded-3xl ${
            isDark ? "glass" : "glass-light"
          }`}
        >
          {stats.map((stat, index) => (
            <StatCounter key={stat.label} stat={stat} index={index} />
          ))}
        </motion.div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <div
            className={`h-px flex-1 max-w-[100px] ${
              isDark ? "bg-white/10" : "bg-luxury-200"
            }`}
          />
          <div className="w-2 h-2 rounded-full bg-gold-500" />
          <div
            className={`h-px flex-1 max-w-[100px] ${
              isDark ? "bg-white/10" : "bg-luxury-200"
            }`}
          />
        </div>

        {/* Features Grid */}
        <motion.div
          ref={featuresRef}
          variants={staggerContainer}
          initial="hidden"
          animate={featuresControls}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        >
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
