import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CollectionBanner = () => {
  return (
    <section className="py-8 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Left banner - Outerwear */}
          <motion.div
            className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden group"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://images.unsplash.com/photo-1548712464-dca92c91de31?w=800&auto=format&fit=crop"
              alt="Outerwear collection"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="text-xs font-body tracking-[0.3em] uppercase text-primary">
                Collection
              </span>
              <h3 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">
                Winter Essentials
              </h3>
              <Button asChild variant="outline" className="border-foreground/20 hover:bg-foreground hover:text-background group">
                <Link to="/shop">
                  Explore
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right banners - stacked */}
          <div className="grid grid-rows-2 gap-4 md:gap-6">
            {/* Top right */}
            <motion.div
              className="relative h-[190px] md:h-[240px] rounded-lg overflow-hidden group"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop"
                alt="Street style"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-xs font-body tracking-[0.3em] uppercase text-primary">
                  Trending
                </span>
                <h3 className="font-display text-xl md:text-2xl font-bold mt-1">
                  Street Luxe
                </h3>
              </div>
            </motion.div>

            {/* Bottom right */}
            <motion.div
              className="relative h-[190px] md:h-[240px] rounded-lg overflow-hidden group"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&auto=format&fit=crop"
                alt="Accessories"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-xs font-body tracking-[0.3em] uppercase text-primary">
                  New In
                </span>
                <h3 className="font-display text-xl md:text-2xl font-bold mt-1">
                  Accessories
                </h3>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionBanner;
