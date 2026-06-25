import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function MagneticButton({
  children,
  className = "",
  onClick,
  href,
}) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = (clientX - centerX) * 0.3;
    const deltaY = (clientY - centerY) * 0.3;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const motionProps = {
    ref,
    animate: { x: position.x, y: position.y },
    transition: { type: "spring", stiffness: 350, damping: 15, mass: 0.5 },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    className: `inline-block cursor-pointer ${className}`,
  };

  if (href) {
    return (
      <motion.a href={href} {...motionProps} onClick={onClick}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button {...motionProps} onClick={onClick}>
      {children}
    </motion.button>
  );
}
