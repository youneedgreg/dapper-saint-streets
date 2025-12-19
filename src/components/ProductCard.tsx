import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, ShoppingBag, Heart } from 'lucide-react';
import { Product } from '@/data/products';
import { useWishlist } from '@/hooks/useWishlist';
import { cn } from '@/lib/utils';
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

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowQuickView(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="group relative"
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
          <div className="relative aspect-[3/4] overflow-hidden bg-card rounded-lg">
            <motion.img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.4 }}
            />

            <motion.div
              className="absolute inset-0 bg-background/40 flex items-center justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                onClick={handleQuickView}
                className="p-3 bg-background/90 rounded-full text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={handleWishlistClick}
                className={cn(
                  "p-3 rounded-full transition-colors",
                  inWishlist 
                    ? "bg-crimson text-foreground" 
                    : "bg-background/90 text-foreground hover:bg-crimson"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className={cn("w-5 h-5", inWishlist && "fill-current")} />
              </motion.button>
            </motion.div>

            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isNew && (
                <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider rounded">
                  New
                </span>
              )}
              {product.originalPrice && (
                <span className="px-3 py-1 bg-crimson text-foreground text-xs font-semibold uppercase tracking-wider rounded">
                  Sale
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
              )}
            </div>
            <div className="flex gap-1.5 pt-1">
              {product.colors.slice(0, 4).map(color => (
                <span
                  key={color.name}
                  className={cn(
                    "w-4 h-4 rounded-full border-2 border-background ring-1 ring-border",
                    color.hex === '#FFFFFF' || color.hex === '#FAFAFA' ? 'ring-muted' : ''
                  )}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-muted-foreground">+{product.colors.length - 4}</span>
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
