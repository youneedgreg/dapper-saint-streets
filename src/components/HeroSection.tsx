import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const HeroSection = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set target date to January 25, 2026
  const [targetDate] = useState(() => {
    return new Date('2026-01-25T00:00:00').getTime();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Subscribed!",
        description: "You've been added to the early access list.",
      });
      setEmail('');
    }, 500);
  };

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <img
          src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1920&auto=format&fit=crop"
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </motion.div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Collection tag */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4 text-white/80"
          >
            Coming Soon
          </motion.p>

          {/* Main heading */}
          <motion.h1
            className="font-cinzel text-4xl md:text-6xl lg:text-7xl font-medium uppercase tracking-tight mb-4 text-white"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Dapper Saint
          </motion.h1>

          <motion.p
            className="text-sm md:text-base tracking-[0.2em] uppercase text-gray-300 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            Subscribe for Early Access
          </motion.p>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="flex justify-center gap-4 md:gap-12 mb-8 font-mono text-3xl md:text-5xl font-bold tracking-tighter text-white"
          >
            <div className="flex flex-col items-center">
              <span>{formatTime(timeLeft.days)}</span>
              <span className="text-[10px] md:text-xs font-sans font-normal tracking-widest text-gray-400 mt-2">DAYS</span>
            </div>
            <span>:</span>
            <div className="flex flex-col items-center">
              <span>{formatTime(timeLeft.hours)}</span>
              <span className="text-[10px] md:text-xs font-sans font-normal tracking-widest text-gray-400 mt-2">HOURS</span>
            </div>
            <span>:</span>
            <div className="flex flex-col items-center">
              <span>{formatTime(timeLeft.minutes)}</span>
              <span className="text-[10px] md:text-xs font-sans font-normal tracking-widest text-gray-400 mt-2">MINS</span>
            </div>
            <span>:</span>
            <div className="flex flex-col items-center">
              <span>{formatTime(timeLeft.seconds)}</span>
              <span className="text-[10px] md:text-xs font-sans font-normal tracking-widest text-gray-400 mt-2">SECS</span>
            </div>
          </motion.div>

          {/* Email Subscription Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-lg mx-auto mb-20 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            <input
              type="email"
              placeholder="ENTER YOUR EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-6 bg-transparent border border-white/30 text-white placeholder:text-gray-500 text-xs tracking-widest uppercase focus:outline-none focus:border-white transition-colors backdrop-blur-sm"
              required
            />
            <button
              type="submit"
              className="w-full md:w-auto h-12 px-8 bg-white text-black text-xs font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </motion.form>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom left-1/2 -translate-x-1/2 cursor-pointer z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-3"
          >
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/60">
              Scroll
            </span>
            <ArrowDown className="w-4 h-4 text-white/60" strokeWidth={1} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

