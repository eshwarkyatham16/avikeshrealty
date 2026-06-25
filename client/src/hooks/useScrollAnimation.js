import { useRef } from "react";
import { useInView, useAnimation } from "framer-motion";
import { useEffect } from "react";

export function useScrollAnimation({ threshold = 0.2, once = true } = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: threshold, once });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else if (!once) {
      controls.start("hidden");
    }
  }, [isInView, controls, once]);

  return { ref, controls, isInView };
}

export default useScrollAnimation;
