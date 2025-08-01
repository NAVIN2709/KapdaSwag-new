import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Loadingspinner = () => {
  return (
    <AnimatePresence>
      <motion.div
        className="relative flex items-center justify-center min-h-screen overflow-hidden"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }} // quick fade-out
      >
        {/* Logo circle */}
        <motion.div
          className="relative w-40 h-40 rounded-3xl bg-[#8c72d9] flex items-center justify-center shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1, 0] }} // expand then shrink
          transition={{
            duration: 1.5, // each cycle is 1.5s
            times: [0, 0.5, 1],
            ease: "easeInOut",
            repeat: 2, // repeat twice
            repeatType: "loop",
          }}
        >
          {/* Logo text */}
          <motion.img
            src="./logo-nobg.png"
            alt="KapdaSwag Logo"
            className="w-20 h-20"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }} // pop in then out
            transition={{
              duration: 1.5,
              times: [0, 0.5, 1],
              ease: "easeInOut",
              repeat: 2,
              repeatType: "loop",
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Loadingspinner;
