import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getProductById } from '@/data/products';

const lookbookImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop",
    title: "Urban Edge",
    collection: "Essentials",
    product_ids: ['1', '4']
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop",
    title: "Street Royalty",
    collection: "Premium",
    product_ids: ['2', '5']
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1200&auto=format&fit=crop",
    title: "Dark Dynasty",
    collection: "Signature",
    product_ids: ['3', '6']
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=1200&auto=format&fit=crop",
    title: "Golden Hour",
    collection: "Luxe",
    product_ids: ['7', '8']
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&auto=format&fit=crop",
    title: "Night Reign",
    collection: "After Dark",
    product_ids: ['9', '10']
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1544441893-675973e31985?w=1200&auto=format&fit=crop",
    title: "Crown Collection",
    collection: "Royal",
    product_ids: ['1', '3']
  },
];

const Lookbook = () => {
  const [selectedImage, setSelectedImage] = useState<typeof lookbookImages[0] | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 md:pt-24">
        {/* Hero */}
        <motion.section 
          className="container mx-auto px-4 py-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-body tracking-[0.3em] uppercase text-primary mb-4 block">
            Latest Collection
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
            LOOK<span className="text-gradient-gold">BOOK</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our latest collection through the lens of urban luxury. 
            Don't blend in, Rule the Scene.
          </p>
        </motion.section>

        {/* Gallery Grid */}
        <section className="container mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lookbookImages.map((image, index) => (
              <motion.div
                key={image.id}
                className="group relative cursor-pointer overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onClick={() => setSelectedImage(image)}
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <motion.img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-xs font-body tracking-widest uppercase text-primary block mb-2">
                      {image.collection}
                    </span>
                    <h3 className="font-display text-2xl font-bold">{image.title}</h3>
                  </div>
                </div>
                
                {/* Gold border on hover */}
                <div className="absolute inset-0 border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-card py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
                Own the <span className="text-gradient-gold">Look</span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Each piece from the lookbook is available for purchase. 
                Elevate your wardrobe with Dapper Sainte.
              </p>
              <a 
                href="/shop" 
                className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                Shop the Collection
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-5xl max-h-[90vh] mx-4 bg-card rounded-lg overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="grid md:grid-cols-2 h-full">
                {/* Image */}
                <div className="aspect-[3/4] md:aspect-auto">
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <span className="text-xs font-body tracking-widest uppercase text-primary block mb-2">
                    {selectedImage.collection}
                  </span>
                  <h3 className="font-display text-3xl font-bold mb-6">{selectedImage.title}</h3>
                  
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
    </div>
  );
};

export default Lookbook;
