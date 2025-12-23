import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface StyledLooksSectionProps {
  productCategory: string;
}

const styledLooks = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop",
    title: "Street Ready",
    description: "Casual downtown vibes"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&auto=format&fit=crop",
    title: "Urban Edge",
    description: "Bold city aesthetic"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop",
    title: "Night Out",
    description: "Evening sophistication"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop",
    title: "Weekend Casual",
    description: "Effortless style"
  }
];

const StyledLooksSection = ({ productCategory }: StyledLooksSectionProps) => {
  return (
    <section className="mt-16 border-t border-border pt-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl font-bold">See It Styled</h2>
          <p className="text-muted-foreground mt-1">Get inspired by our curated looks</p>
        </div>
        <button className="flex items-center gap-1 text-sm text-primary hover:underline">
          View all looks <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {styledLooks.map((look, index) => (
          <motion.div
            key={look.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="aspect-[3/4] bg-card rounded-lg overflow-hidden mb-3">
              <img 
                src={look.image} 
                alt={look.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="font-medium text-sm">{look.title}</h3>
            <p className="text-xs text-muted-foreground">{look.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StyledLooksSection;
