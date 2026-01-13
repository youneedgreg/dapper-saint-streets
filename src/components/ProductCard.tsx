import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Product } from '@/data/products';
import { useWishlist } from '@/hooks/useWishlist';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/currency';
import QuickViewModal from './QuickViewModal';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showQuickView, setShowQuickView] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="group"
        onMouseEnter={() => {
          setIsHovered(true);
          if (product.images.length > 1) setCurrentImageIndex(1);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImageIndex(0);
        }}
      >
        <Link to={`/product/${product.id}`}>
          <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-4">
            <motion.img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.03 : 1 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            />

            {/* Size Selector Pill - Nude Project Style */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-4 left-0 right-0 flex justify-center z-10"
                >
                  <div className="bg-white/95 backdrop-blur-md px-2 py-2 rounded-full shadow-lg flex items-center gap-1">
                    {['S', 'M', 'L', 'XL'].map((size) => (
                      <button
                        key={size}
                        onClick={(e) => {
                          e.preventDefault();
                          // Placeholder for add to cart
                          setShowQuickView(true);
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black hover:bg-black hover:text-white transition-colors"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Wishlist button */}
            <motion.button
              onClick={handleWishlistClick}
              className={cn(
                "absolute top-3 right-3 p-2 bg-white/50 backdrop-blur-sm rounded-full transition-colors hover:bg-white",
                inWishlist ? "text-red-500" : "text-black"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered || inWishlist ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Heart className={cn("w-4 h-4", inWishlist && "fill-current")} strokeWidth={1.5} />
            </motion.button>

            {/* Tags */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isNew && (
                <span className="text-[10px] tracking-[0.2em] uppercase text-black bg-white/80 backdrop-blur-sm px-2 py-1">
                  New
                </span>
              )}
              {product.originalPrice && (
                <span className="text-[10px] tracking-[0.2em] uppercase text-white bg-red-600 px-2 py-1">
                  Sale
                </span>
              )}
            </div>

            {/* Quick view on mobile tap overlay */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowQuickView(true);
              }}
              className="absolute inset-0 md:hidden z-0"
              aria-label="Quick view"
            />
          </div>

          <div className="text-center space-y-1">
            <h3 className="text-sm font-medium tracking-wide">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {product.category}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-sm">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </Link>
      </motion.div>

      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
};

export default ProductCard;
