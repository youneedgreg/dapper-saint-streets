import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Grain overlay */}
        <div className="absolute inset-0 bg-grain pointer-events-none" />
        
        {/* Logo with glitch effect */}
        <motion.div
          className="relative mb-12"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Main logo */}
          <motion.img
            src={logo}
            alt="Dapper Saint"
            className="w-32 h-auto md:w-48 relative z-10"
          />
          
          {/* Glitch overlay - left shift (crimson) */}
          <motion.img
            src={logo}
            alt=""
            className="absolute inset-0 w-32 h-auto md:w-48 opacity-0"
            style={{ filter: 'hue-rotate(-30deg) saturate(2)' }}
            animate={{
              opacity: [0, 0.7, 0],
              x: [-3, 3, -3],
            }}
            transition={{
              duration: 0.15,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
          
          {/* Glitch overlay - right shift (electric blue) */}
          <motion.img
            src={logo}
            alt=""
            className="absolute inset-0 w-32 h-auto md:w-48 opacity-0"
            style={{ filter: 'hue-rotate(180deg) saturate(2)' }}
            animate={{
              opacity: [0, 0.7, 0],
              x: [3, -3, 3],
            }}
            transition={{
              duration: 0.15,
              repeat: Infinity,
              repeatDelay: 3,
              delay: 0.05,
            }}
          />
          
          {/* Glitch lines */}
          <motion.div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.1,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            <div className="absolute top-1/3 left-0 w-full h-[2px] bg-crimson" />
            <div className="absolute top-2/3 left-0 w-full h-[1px] bg-electric" />
          </motion.div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-sm md:text-base font-body tracking-[0.3em] uppercase text-muted-foreground mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Luxury Streetwear
        </motion.p>

        {/* Progress bar */}
        <div className="w-64 md:w-80">
          <div className="h-[1px] bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-gold-light to-primary"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
          
          <motion.div 
            className="flex justify-between mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <span className="text-xs font-body tracking-widest text-muted-foreground uppercase">
              Loading
            </span>
            <span className="text-xs font-body text-muted-foreground tabular-nums">
              {Math.round(Math.min(progress, 100))}%
            </span>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground tracking-[0.2em] uppercase">
            <div className="w-8 h-[1px] bg-muted-foreground" />
            <span>Est. 2024</span>
            <div className="w-8 h-[1px] bg-muted-foreground" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;
