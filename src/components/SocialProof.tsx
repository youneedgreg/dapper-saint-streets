import { motion } from 'framer-motion';

const pressLogos = [
  { name: "ABANTU", text: "ABANTU" },
  { name: "XFEST", text: "XFEST" },
  { name: "ELITE", text: "ELITE" },
  { name: "Complex", text: "COMPLEX" },
];

const SocialProof = () => {
  return (
    <section className="py-16 md:py-20 bg-background border-y border-border">
      <div className="container mx-auto px-6">
        <motion.div
          className="flex flex-wrap justify-center items-center gap-8 md:gap-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="text-xs text-muted-foreground tracking-[0.2em] uppercase w-full text-center mb-4">
            Official Patners With
          </span>
          {pressLogos.map((logo, index) => (
            <motion.span
              key={logo.name}
              className="text-xl md:text-2xl font-display font-medium text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors cursor-default"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {logo.text}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;
