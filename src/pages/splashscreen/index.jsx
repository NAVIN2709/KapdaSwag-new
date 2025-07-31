import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ onFinish }) {
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
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Logo text */}
          <motion.h1
            className="text-3xl font-extrabold text-black"
            initial={{ opacity: 0, y: 20, scale: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <img src="./logo-nobg.png" alt="" />
          </motion.h1>
        </motion.div>

        {/* App name */}
        <motion.h2
          className="absolute bottom-[30%] text-white text-3xl font-bold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          KapdaSwag
        </motion.h2>
      </motion.div>
    </AnimatePresence>
  );
}
