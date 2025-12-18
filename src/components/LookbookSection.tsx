import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y3 = useTransform(scrollYProgress, [0, 1], [50, -150]);

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-card overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            className="inline-block text-xs font-body tracking-[0.3em] uppercase text-primary mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Editorial
          </motion.span>
          <motion.h2
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            The Lookbook
          </motion.h2>
        </div>

        {/* Parallax images grid */}
        <div className="grid grid-cols-12 gap-4 md:gap-6 min-h-[600px] md:min-h-[700px]">
          {/* Left large image */}
          <motion.div
            className="col-span-12 md:col-span-5 relative"
            style={{ y: y1 }}
          >
            <div className="relative h-[400px] md:h-[600px] rounded-lg overflow-hidden">
              <img
                src={lookbookImages[0].src}
                alt={lookbookImages[0].alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
            </div>
          </motion.div>

          {/* Center column */}
          <div className="col-span-12 md:col-span-4 flex flex-col justify-center items-center text-center py-8 md:py-0">
            <motion.p
              className="text-lg text-muted-foreground mb-8 max-w-xs"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Discover the art of street luxury through our latest editorial campaign.
            </motion.p>
            <motion.div style={{ y: y2 }}>
              <div className="relative h-[250px] md:h-[300px] w-full rounded-lg overflow-hidden mb-8">
                <img
                  src={lookbookImages[1].src}
                  alt={lookbookImages[1].alt}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground group">
              <Link to="/collections">
                View Lookbook
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Right large image */}
          <motion.div
            className="col-span-12 md:col-span-3 relative hidden md:block"
            style={{ y: y3 }}
          >
            <div className="relative h-[500px] rounded-lg overflow-hidden mt-20">
              <img
                src={lookbookImages[2].src}
                alt={lookbookImages[2].alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LookbookSection;
