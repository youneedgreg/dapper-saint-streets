import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const lookbookImages = [
  {
    src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop",
    alt: "Editorial look 1"
  },
  {
    src: "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=800&auto=format&fit=crop",
    alt: "Editorial look 2"
  },
  {
    src: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=800&auto=format&fit=crop",
    alt: "Editorial look 3"
  }
];

const LookbookSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
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
            className="col-span-6 md:col-span-4"
            style={{ y: y1 }}
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={lookbookImages[0].src}
                alt={lookbookImages[0].alt}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Center image - larger */}
          <motion.div
            className="col-span-6 md:col-span-4"
            style={{ y: y2 }}
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={lookbookImages[1].src}
                alt={lookbookImages[1].alt}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Right image */}
          <motion.div
            className="col-span-12 md:col-span-4"
            style={{ y: y1 }}
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={lookbookImages[2].src}
                alt={lookbookImages[2].alt}
                className="w-full h-full object-cover"
              />
            </div>
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
    </section>
  );
};

export default LookbookSection;
