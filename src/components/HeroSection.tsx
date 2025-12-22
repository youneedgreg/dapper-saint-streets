import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
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
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 pt-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Collection tag */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xs tracking-[0.4em] uppercase text-white/80 mb-8"
          >
            New Collection
          </motion.p>

          {/* Main heading */}
          <motion.h1
            className="font-display text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] mb-8 tracking-tight text-white"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Dapper Saint
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-base md:text-lg text-white/70 max-w-md mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            Where luxury craftsmanship meets street culture
          </motion.p>

          {/* CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <Link 
              to="/shop"
              className="inline-block h-12 px-12 bg-white text-black hover:bg-white/90 text-xs tracking-[0.2em] uppercase font-medium leading-[48px] transition-colors"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
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
