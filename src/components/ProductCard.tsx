import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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

            {/* Wishlist button */}
            <motion.button
              onClick={handleWishlistClick}
              className={cn(
                "absolute top-4 right-4 p-2 transition-colors",
                inWishlist ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered || inWishlist ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Heart className={cn("w-5 h-5", inWishlist && "fill-current")} strokeWidth={1.5} />
            </motion.button>

            {/* Tags */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <span className="text-[10px] tracking-[0.2em] uppercase text-foreground bg-background px-3 py-1">
                  New
                </span>
              )}
              {product.originalPrice && (
                <span className="text-[10px] tracking-[0.2em] uppercase text-background bg-foreground px-3 py-1">
                  Sale
                </span>
              )}
            </div>

            {/* Quick view on mobile tap */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowQuickView(true);
              }}
              className="absolute inset-0 md:hidden"
              aria-label="Quick view"
            />
          </div>

          <div className="space-y-1">
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
