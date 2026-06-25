import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-luxury-950"
        >
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mb-8"
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{
                duration: 1.2,
                ease: [0.25, 0.4, 0.25, 1],
                delay: 0.2,
              }}
            />

            <div className="overflow-hidden">
              <motion.h1
                className="font-heading text-3xl md:text-5xl tracking-[0.15em] text-luxury-100"
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.4, 0.25, 1],
                  delay: 0.3,
                }}
              >
                AVIKESH
              </motion.h1>
            </div>

            <div className="overflow-hidden">
              <motion.p
                className="text-sm md:text-base tracking-[0.4em] uppercase text-gold-500 mt-2"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.4, 0.25, 1],
                  delay: 0.6,
                }}
              >
                Realty
              </motion.p>
            </div>

            <motion.div
              className="mt-10 w-48 h-[1px] bg-luxury-800 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-gold-400 to-gold-600 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 1.4,
                  ease: [0.25, 0.4, 0.25, 1],
                  delay: 0.9,
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
