import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/lib/currency';

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            className="fixed inset-y-0 right-0 w-full max-w-md bg-background z-50 border-l border-border flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-display text-xl font-semibold">Your Cart</h2>
                <span className="text-sm text-muted-foreground">({items.length})</span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground mb-2">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground/70 mb-6">
                    Add some items to get started
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCartOpen(false)}
                    asChild
                  >
                    <Link to="/shop">Continue Shopping</Link>
                  </Button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((item, index) => (
                    <motion.li
                      key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-4"
                    >
                      {/* Product image */}
                      <div className="w-24 h-24 bg-card rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-sm font-semibold truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.selectedColor} / {item.selectedSize}
                        </p>
                        <p className="text-sm font-semibold text-primary mt-1">
                          {formatPrice(item.product.price)}
                        </p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-border rounded">
                            <button
                              onClick={() => updateQuantity(
                                item.product.id,
                                item.selectedColor,
                                item.selectedSize,
                                item.quantity - 1
                              )}
                              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-sm tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(
                                item.product.id,
                                item.selectedColor,
                                item.selectedSize,
                                item.quantity + 1
                              )}
                              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(
                              item.product.id,
                              item.selectedColor,
                              item.selectedSize
                            )}
                            className="text-xs text-muted-foreground hover:text-destructive transition-colors underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-display text-xl font-semibold">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping and taxes calculated at checkout
                </p>
                <Button 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                  asChild
                >
                  <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
                    Checkout
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setIsCartOpen(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
