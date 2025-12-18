import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Marcus J.",
    location: "Los Angeles, CA",
    text: "The quality is unmatched. Every piece feels like a statement. This is what luxury streetwear should be.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop"
  },
  {
    name: "Sophia R.",
    location: "New York, NY",
    text: "Finally found a brand that gets it. Premium materials, perfect fit, and designs that turn heads.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop"
  },
  {
    name: "Jayden K.",
    location: "Miami, FL",
    text: "The Dynasty Bomber is now my go-to jacket. Compliments everywhere I go. Worth every penny.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop"
  }
];

const pressLogos = [
  { name: "Vogue", text: "VOGUE" },
  { name: "GQ", text: "GQ" },
  { name: "Hypebeast", text: "HYPEBEAST" },
  { name: "Complex", text: "COMPLEX" },
  { name: "Highsnobiety", text: "HIGHSNOBIETY" }
];

const SocialProof = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Press logos */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-8 md:gap-16 mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs text-muted-foreground tracking-wider uppercase w-full text-center mb-4">
            As Featured In
          </span>
          {pressLogos.map((logo) => (
            <span
              key={logo.name}
              className="text-2xl md:text-3xl font-display font-bold text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors"
            >
              {logo.text}
            </span>
          ))}
        </motion.div>

        {/* Section header */}
        <div className="text-center mb-16">
          <motion.span
            className="inline-block text-xs font-body tracking-[0.3em] uppercase text-primary mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Testimonials
          </motion.span>
          <motion.h2
            className="font-display text-4xl md:text-5xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            What They Say
          </motion.h2>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="bg-card border border-border rounded-lg p-8 relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Quote className="w-8 h-8 text-primary/20 absolute top-6 right-6" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
