import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Loadingspinner=()=> {
  return (
    <AnimatePresence>
          <motion.div
            className="relative flex items-center justify-center min-h-screen overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo circle */}
            <motion.div
              className="relative w-40 h-40 rounded-3xl bg-[#8c72d9] flex items-center justify-center shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1, 1, 0] }}
              transition={{
                delay: 0.2,
                duration: 1.6,
                times: [0, 0.4, 0.6, 1], // pause between 0.4s and 0.6s mark
                ease: "easeInOut",
              }}
            >
              {/* Logo text */}
              <motion.h1
                className="text-3xl font-extrabold text-black"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: [0, 1, 0] }}
                transition={{
                  delay: 0.7, // Start after 0.2s
                  duration: 1.2, // Total time for the animation
                  times: [0, 0.4, 1], // Timing points for keyframes
                  ease: "easeInOut",
                }}
              >
                <img src="./logo-nobg.png" alt="KapdaSwag Logo" />
              </motion.h1>
            </motion.div>
          </motion.div>
        </AnimatePresence>
  );
}

export default Loadingspinner
