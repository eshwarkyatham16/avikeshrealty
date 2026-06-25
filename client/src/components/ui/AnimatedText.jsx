import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const wordVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    rotateX: -40,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
};

export default function AnimatedText({
  text,
  className = "",
  delay = 0,
  tag = "p",
  once = true,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.3 });

  const Tag = motion[tag] || motion.p;

  const words = text.split(" ");

  return (
    <Tag
      ref={ref}
      className={`${className}`}
      style={{ perspective: "800px" }}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ delayChildren: delay }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordVariants}
          style={{
            display: "inline-block",
            marginRight: "0.3em",
            willChange: "transform, opacity, filter",
          }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
