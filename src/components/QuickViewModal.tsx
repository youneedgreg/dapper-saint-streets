import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, product.colors[selectedColor].name, product.sizes[selectedSize], quantity);
    onClose();
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] bg-card rounded-lg shadow-xl z-50 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-background/80 rounded-full text-foreground hover:bg-background transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid md:grid-cols-2 max-h-[90vh] overflow-y-auto">
              {/* Image section */}
              <div className="relative aspect-square md:aspect-auto md:h-full bg-muted">
                <img
                  src={product.images[currentImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {product.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImage(idx)}
                        className={cn(
                          "w-2 h-2 rounded-full transition-colors",
                          currentImage === idx ? "bg-primary" : "bg-foreground/50"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Product info */}
              <div className="p-6 md:p-8 flex flex-col">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                    {product.category}
                  </p>
                  <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                    {product.name}
                  </h2>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl font-bold text-foreground">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  <p className="text-muted-foreground mb-6">{product.description}</p>

                  {/* Color selection */}
                  <div className="mb-6">
                    <p className="text-sm font-medium mb-3">
                      Color: <span className="text-muted-foreground">{product.colors[selectedColor].name}</span>
                    </p>
                    <div className="flex gap-2">
                      {product.colors.map((color, idx) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(idx)}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 transition-all",
                            selectedColor === idx 
                              ? "border-primary ring-2 ring-primary/30" 
                              : "border-border hover:border-muted-foreground"
                          )}
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Size selection */}
                  <div className="mb-6">
                    <p className="text-sm font-medium mb-3">Size</p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size, idx) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(idx)}
                          className={cn(
                            "px-4 py-2 border rounded-md text-sm font-medium transition-colors",
                            selectedSize === idx
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border text-foreground hover:border-muted-foreground"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="mb-6">
                    <p className="text-sm font-medium mb-3">Quantity</p>
                    <div className="flex items-center gap-4 w-fit border border-border rounded-md">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-muted transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-3 hover:bg-muted transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 gap-2"
                    size="lg"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={handleWishlistToggle}
                    variant="outline"
                    size="lg"
                    className={cn(inWishlist && "text-crimson border-crimson")}
                  >
                    <Heart className={cn("w-5 h-5", inWishlist && "fill-current")} />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
