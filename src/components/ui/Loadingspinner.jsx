import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Loadingspinner = () => {
  return (
    <AnimatePresence>
      <motion.div
        className="relative flex items-center justify-center min-h-screen overflow-hidden"
        initial={{ opacity: 1 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Spinning Circle + Logo */}
        <motion.div
          className="relative w-40 h-40 rounded-3xl bg-[#8c72d9] flex items-center justify-center shadow-lg"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <img
            src="./logo-nobg.png"
            alt="KapdaSwag Logo"
            className="w-20 h-20"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Loadingspinner;
