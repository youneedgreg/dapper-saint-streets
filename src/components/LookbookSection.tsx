import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowRight, ShoppingBag, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProductById } from '@/data/products';
import { AnimatePresence } from 'framer-motion';

const lookbookImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop",
    alt: "Editorial look 1",
    title: "Urban Edge",
    collection: "Essentials",
    product_ids: ['1', '4']
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=800&auto=format&fit=crop",
    alt: "Editorial look 2",
    title: "Street Royalty",
    collection: "Premium",
    product_ids: ['2', '5']
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=800&auto=format&fit=crop",
    alt: "Editorial look 3",
    title: "Dark Dynasty",
    collection: "Signature",
    product_ids: ['3', '6']
  }
];

const LookbookSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<typeof lookbookImages[0] | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <section ref={containerRef} className="py-20 md:py-32 bg-secondary overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Editorial
          </motion.p>
          <motion.h2
            className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            The Lookbook
          </motion.h2>
        </div>

        {/* Images grid */}
        <div className="grid grid-cols-12 gap-4 md:gap-8">
          {/* Left image */}
          <motion.div
            className="col-span-6 md:col-span-4 cursor-pointer group"
            style={{ y: y1 }}
            onClick={() => setSelectedImage(lookbookImages[0])}
          >
            <div className="aspect-[3/4] overflow-hidden rounded-lg">
              <motion.img
                src={lookbookImages[0].src}
                alt={lookbookImages[0].alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                whileHover={{ scale: 1.05 }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-lg" />
          </motion.div>

          {/* Center image - larger */}
          <motion.div
            className="col-span-6 md:col-span-4 cursor-pointer group"
            style={{ y: y2 }}
            onClick={() => setSelectedImage(lookbookImages[1])}
          >
            <div className="aspect-[3/4] overflow-hidden rounded-lg">
              <motion.img
                src={lookbookImages[1].src}
                alt={lookbookImages[1].alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                whileHover={{ scale: 1.05 }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-lg" />
          </motion.div>

          {/* Right image */}
          <motion.div
            className="col-span-12 md:col-span-4 cursor-pointer group"
            style={{ y: y1 }}
            onClick={() => setSelectedImage(lookbookImages[2])}
          >
            <div className="aspect-[3/4] overflow-hidden rounded-lg">
              <motion.img
                src={lookbookImages[2].src}
                alt={lookbookImages[2].alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                whileHover={{ scale: 1.05 }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-lg" />
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link 
            to="/lookbook" 
            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors group"
          >
            View Full Lookbook
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
          </Link>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh] bg-card rounded-xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid md:grid-cols-2 h-full">
                <div className="aspect-[3/4] md:aspect-auto">
                  <img 
                    src={selectedImage.src} 
                    alt={selectedImage.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <span className="text-xs tracking-widest uppercase text-primary block mb-2">
                    {selectedImage.collection}
                  </span>
                  <h3 className="font-display text-2xl font-bold mb-6">{selectedImage.title}</h3>
                  
                  <div className="space-y-4">
                    <p className="text-sm font-semibold">Shop This Look</p>
                    {selectedImage.product_ids && selectedImage.product_ids.length > 0 ? (
                      <div className="space-y-2">
                        {selectedImage.product_ids.map(productId => {
                          const product = getProductById(productId);
                          return product ? (
                            <Link 
                              key={productId}
                              to={`/product/${productId}`}
                              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                              onClick={() => setSelectedImage(null)}
                            >
                              <ShoppingBag className="w-4 h-4 text-primary flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{product.name}</p>
                                <p className="text-xs text-muted-foreground">{product.category}</p>
                              </div>
                            </Link>
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No products linked to this look yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default LookbookSection;
