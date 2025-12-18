import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1920&auto=format&fit=crop"
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="absolute inset-0 bg-grain pointer-events-none" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-xs font-body tracking-wider uppercase text-primary">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              New Collection Available
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="block">Elevate</span>
            <span className="block mt-2">
              Your <span className="text-gradient-gold">Edge</span>
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Where luxury craftsmanship meets street culture. 
            Premium streetwear for those who refuse to blend in.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              asChild
              size="lg"
              className="h-14 px-10 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold group"
            >
              <Link to="/shop">
                Shop Collection
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 px-10 border-foreground/20 hover:bg-foreground/5 text-base"
            >
              <Link to="/about" className="flex items-center">
                <Play className="w-4 h-4 mr-2" />
                Our Story
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <motion.div
              className="w-1.5 h-3 bg-primary rounded-full mt-2"
              animate={{ opacity: [1, 0.5, 1], y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Side text */}
      <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2">
        <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground -rotate-90 inline-block origin-center whitespace-nowrap">
          Est. 2024 — Luxury Streetwear
        </span>
      </div>

      <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2">
        <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground rotate-90 inline-block origin-center whitespace-nowrap">
          Scroll to Explore
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
