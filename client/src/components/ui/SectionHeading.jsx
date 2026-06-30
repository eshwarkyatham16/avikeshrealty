import { motion } from "framer-motion";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { fadeUp, staggerContainer } from "../../utils/animations";
import { useTheme } from "../../hooks/useTheme";

export default function SectionHeading({
  title,
  subtitle,
  centered = true,
  light = false,
}) {
  const { ref, controls } = useScrollAnimation();
  const { isDark } = useTheme();

  const effectiveLight = light || !isDark;

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={controls}
      className={`mb-12 md:mb-16 ${centered ? "text-center" : ""}`}
    >
      {subtitle && (
        <motion.p
          variants={fadeUp}
          className="text-sm md:text-base font-body tracking-[0.2em] uppercase mb-4 text-gold-500"
        >
          {subtitle}
        </motion.p>
      )}

      <motion.h2
        variants={fadeUp}
        className={`font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6 ${
          effectiveLight ? "text-luxury-900" : "text-luxury-100"
        }`}
      >
        {title}
      </motion.h2>

      <motion.div
        variants={fadeUp}
        className={`${centered ? "mx-auto" : ""}`}
      >
        <motion.div
          className="h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent"
          initial={{ width: 0 }}
          animate={controls}
          variants={{
            hidden: { width: 0, opacity: 0 },
            visible: {
              width: centered ? 120 : 80,
              opacity: 1,
              transition: {
                duration: 1,
                ease: [0.25, 0.4, 0.25, 1],
                delay: 0.3,
              },
            },
          }}
          style={{ margin: centered ? "0 auto" : "0" }}
        />
      </motion.div>
    </motion.div>
  );
}
