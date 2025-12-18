import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 100);

    return () => clearInterval(interval);
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
        
        {/* Logo */}
        <motion.div
          className="relative mb-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-wider">
            <motion.span
              className="inline-block"
              animate={{
                textShadow: [
                  "0 0 0 transparent",
                  "-2px 0 hsl(0 84% 50%), 2px 0 hsl(210 100% 56%)",
                  "0 0 0 transparent",
                ],
              }}
              transition={{
                duration: 0.15,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              DAPPER
            </motion.span>
            <span className="text-gradient-gold ml-3">SAINT</span>
          </h1>
          
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
          
          <div className="flex justify-between mt-4">
            <motion.span
              className="text-xs font-body tracking-widest text-muted-foreground uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Elevating Style
            </motion.span>
            <span className="text-xs font-body text-muted-foreground tabular-nums">
              {Math.round(Math.min(progress, 100))}%
            </span>
          </div>
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground tracking-widest uppercase">
            <div className="w-8 h-[1px] bg-muted-foreground" />
            <span>EST. 2024</span>
            <div className="w-8 h-[1px] bg-muted-foreground" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;
