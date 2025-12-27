import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import logoLight from '@/assets/logo.png';
import logoDark from '@/assets/logo-dark.png';

interface LoadingScreenProps {
  onComplete?: () => void;
}

const LoadingScreen = ({ onComplete = () => {} }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const { theme } = useTheme();
  
  const logo = theme === 'dark' ? logoLight : logoDark;

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + 2;
      });
    }, 25);

    // Force complete after 12 seconds to prevent infinite loading
    const forceCompleteTimer = setTimeout(() => {
      setProgress(100);
      clearInterval(timer);
      setTimeout(onComplete, 400);
    }, 12000);

    return () => {
      clearInterval(timer);
      clearTimeout(forceCompleteTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <img
            src={logo}
            alt="Dapper Sainte"
            className="w-24 h-auto md:w-32"
          />
        </motion.div>

        {/* Progress bar */}
        <div className="w-48">
          <div className="h-[1px] bg-border overflow-hidden">
            <motion.div
              className="h-full bg-foreground"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
          
          <motion.p 
            className="text-center mt-6 text-[10px] tracking-[0.3em] uppercase text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Loading
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;
