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
  isModelView?: boolean;
}

const ProductCard = ({ product, index = 0, isModelView = true }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);

  // Logic: if isModelView is true, we want Model (img[0]) first.
  // If isModelView is false (Product view), we want Product (img[1] or img[0]).
  // NOTE: Assuming img[0] is always Model and img[1] is Product/Ghost.
  // If data is mixed, this heuristic might need adjustment, but standardizing data is key.
  const modelImage = product.images[0];
  const productionImage = product.images[1] || product.images[0];

  const primaryImage = isModelView ? modelImage : productionImage;
  const secondaryImage = isModelView ? productionImage : modelImage;

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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/product/${product.id}`}>
          <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-3">
            {/* Primary Image */}
            <motion.img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            />

            {/* Secondary Image (Hover) */}
            <motion.img
              src={secondaryImage}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1.05 : 1
              }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            />

            {/* Wishlist button */}
            <motion.button
              onClick={handleWishlistClick}
              className={cn(
                "absolute top-3 right-3 p-2 bg-white transition-colors hover:bg-black hover:text-white",
                inWishlist ? "text-red-500" : "text-black"
              )}
              animate={{ opacity: isHovered || inWishlist ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Heart className={cn("w-4 h-4", inWishlist && "fill-current")} strokeWidth={2} />
            </motion.button>

            {/* Quick Add (+) Button - Bottom Right */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowQuickView(true);
              }}
              className="absolute bottom-4 right-4 text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
              aria-label="Quick Add"
            >
              <span className="text-2xl font-light">+</span>
            </button>
          </div>

          <div className="text-left">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                {product.name}
              </h3>
              <span className="text-xs font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider">
              <span>{product.colors?.[0]?.name || 'Black'}</span>
              {product.colors && product.colors.length > 1 && (
                <span>{product.colors.length} Colours</span>
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
