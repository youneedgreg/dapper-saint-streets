import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CollectionBanner = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Left banner */}
          <motion.div
            className="relative aspect-[4/5] overflow-hidden group cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
              <Link to="/shop?category=Hoodies">
              <img
                src="https://images.unsplash.com/photo-1548712464-dca92c91de31?w=800&auto=format&fit=crop"
                alt="Premium collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-xs tracking-[0.3em] uppercase text-white/80 mb-2">
                  Collection
                </p>
                <h3 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-white mb-4">
                  Premium Essentials
                </h3>
                <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-white group-hover:gap-3 transition-all">
                  Shop Now
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Right banners - stacked */}
          <div className="grid grid-rows-2 gap-4 md:gap-6">
            <motion.div
              className="relative aspect-[16/9] overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
                <Link to="/shop?category=Jackets">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop"
                  alt="Street style"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xs tracking-[0.3em] uppercase text-white/80 mb-1">
                    Trending
                  </p>
                  <h3 className="font-display text-xl font-medium tracking-tight text-white">
                    Street Luxe
                  </h3>
                </div>
              </Link>
            </motion.div>

            <motion.div
              className="relative aspect-[16/9] overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link to="/shop?category=Accessories">
                <img
                  src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&auto=format&fit=crop"
                  alt="Accessories"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xs tracking-[0.3em] uppercase text-white/80 mb-1">
                    New In
                  </p>
                  <h3 className="font-display text-xl font-medium tracking-tight text-white">
                    Accessories
                  </h3>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionBanner;
