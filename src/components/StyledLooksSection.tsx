import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { getProductById } from '@/data/products';

interface StyledLook {
  id: string;
  image: string;
  title: string;
  description: string;
  productIds?: string[];
}

interface StyledLooksSectionProps {
  productId?: string;
  productCategory: string;
  styledLooks?: StyledLook[];
}

// Lookbook items data - will be replaced with admin-uploaded content
const lookbookItems: StyledLook[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop",
    title: "Urban Edge",
    description: "Street style essentials",
    productIds: ['1', '4']
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=800&auto=format&fit=crop",
    title: "Street Royalty",
    description: "Premium street wear",
    productIds: ['2', '5']
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=800&auto=format&fit=crop",
    title: "Dark Dynasty",
    description: "Signature dark collection",
    productIds: ['3', '6']
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=1200&auto=format&fit=crop",
    title: "Golden Hour",
    description: "Luxe collection",
    productIds: ['7', '8']
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&auto=format&fit=crop",
    title: "Night Reign",
    description: "After dark vibes",
    productIds: ['9', '10']
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop",
    title: "Crown Collection",
    description: "Royal aesthetics",
    productIds: ['1', '3']
  }
];

const StyledLooksSection = ({ productId, productCategory, styledLooks }: StyledLooksSectionProps) => {
  const [selectedLook, setSelectedLook] = useState<StyledLook | null>(null);
  
  // If productId is provided, filter lookbook items that contain this product
  let looks: StyledLook[];
  if (productId) {
    looks = lookbookItems.filter(item => item.productIds?.includes(productId));
  } else {
    looks = styledLooks && styledLooks.length > 0 ? styledLooks : lookbookItems;
  }

  // If no looks match, show all lookbook items
  if (looks.length === 0) {
    looks = lookbookItems;
  }

  return (
    <section className="mt-16 border-t border-border pt-12">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold">See It Styled</h2>
        <p className="text-muted-foreground mt-1">Get inspired by our curated looks</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {looks.map((look, index) => (
          <motion.div
            key={look.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => setSelectedLook(look)}
          >
            <div className="aspect-[3/4] bg-card rounded-lg overflow-hidden mb-3 relative">
              <img 
                src={look.image} 
                alt={look.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-sm font-medium text-foreground">View Look</span>
              </div>
            </div>
            <h3 className="font-medium text-sm">{look.title}</h3>
            <p className="text-xs text-muted-foreground">{look.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedLook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedLook(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh] bg-card rounded-xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedLook(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid md:grid-cols-2 h-full">
                <div className="aspect-[3/4] md:aspect-auto">
                  <img 
                    src={selectedLook.image} 
                    alt={selectedLook.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="font-display text-2xl font-bold mb-2">{selectedLook.title}</h3>
                  <p className="text-muted-foreground mb-6">{selectedLook.description}</p>
                  
                  <div className="space-y-4">
                    <p className="text-sm font-semibold">Shop This Look</p>
                    {selectedLook.productIds && selectedLook.productIds.length > 0 ? (
                      <div className="space-y-2">
                        {selectedLook.productIds.map(pId => {
                          const linkedProduct = getProductById(pId);
                          return linkedProduct ? (
                            <Link 
                              key={pId}
                              to={`/product/${pId}`}
                              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                              onClick={() => setSelectedLook(null)}
                            >
                              <ShoppingBag className="w-4 h-4 text-primary flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{linkedProduct.name}</p>
                                <p className="text-xs text-muted-foreground">{linkedProduct.category}</p>
                              </div>
                            </Link>
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No products linked to this look yet.</p>
                    )}
                  </div>

                  <Button 
                    className="mt-6" 
                    onClick={() => setSelectedLook(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default StyledLooksSection;
