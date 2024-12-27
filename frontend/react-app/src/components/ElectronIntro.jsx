import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import icon from '../data/assets/icon.png';
import { cn } from "../lib/utils";

const ElectronIntro = ({ onComplete }) => {
  const [showText, setShowText] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const textTimer = setTimeout(() => setShowText(true), 800);
    const exitTimer = setTimeout(() => setIsExiting(true), 2800);
    const completeTimer = setTimeout(() => onComplete(), 3200);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={cn(
            "fixed inset-0 flex items-center justify-center",
            "bg-white dark:bg-gray-900",
            "z-50"
          )}
        >
          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1,
                opacity: 1,
                y: showText ? -20 : 0
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                opacity: { duration: 0.5 },
                y: { duration: 0.5 }
              }}
              className="relative mb-8"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 -10px rgba(59, 130, 246, 0)",
                    "0 0 40px -10px rgba(59, 130, 246, 0.3)",
                    "0 0 0 -10px rgba(59, 130, 246, 0)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="rounded-2xl"
              >
                <img 
                  src={icon} 
                  alt="Icon"
                  className="w-24 h-24 object-contain"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: showText ? 1 : 0,
                y: showText ? 0 : 20
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut"
              }}
              className="text-center space-y-2"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: showText ? 1 : 0,
                  scale: showText ? 1 : 0.9
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.2
                }}
              >
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-500 tracking-tight">
                  Be intelligently lazy
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                  Work smarter, not harder
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ElectronIntro;