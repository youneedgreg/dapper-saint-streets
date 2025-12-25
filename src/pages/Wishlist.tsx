import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/currency';
import { getWishlist, removeFromWishlist as removeFromWishlistDB } from '@/lib/database';

const Wishlist = () => {
  const { user, loading: authLoading } = useAuth();
  const { items: localItems, removeFromWishlist: removeLocalWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      // Use local wishlist items when not logged in
      setWishlistItems(localItems);
      setIsLoading(false);
    }
  }, [user, localItems]);

  const loadWishlist = async () => {
    if (!user) return;
    
    try {
      const data = await getWishlist(user.id);
      setWishlistItems((data || []).map((item: any) => item.products));
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (user) {
      try {
        await removeFromWishlistDB(user.id, itemId);
        await loadWishlist();
      } catch (error) {
        console.error('Error removing from wishlist:', error);
      }
    } else {
      removeLocalWishlist(itemId);
    }
  };

  const handleAddToCart = (product: any) => {
    const color = product.colors?.[0]?.name || product.color || 'Default';
    const size = product.sizes?.[0] || product.size || 'M';
    addToCart(product, color, size, 1);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const items = wishlistItems;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />
      
      <main className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full mb-6">
              <Heart className="w-4 h-4 text-crimson fill-current" />
              <span className="text-sm font-medium uppercase tracking-wider">Your Wishlist</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Saved <span className="text-gradient-gold">Items</span>
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              {items.length > 0 
                ? `You have ${items.length} item${items.length > 1 ? 's' : ''} saved for later`
                : 'Your wishlist is empty'
              }
            </p>
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <p className="text-muted-foreground mb-8">Start adding items to your wishlist</p>
              <Link to="/shop">
                <Button size="lg">Browse Products</Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-card rounded-lg overflow-hidden"
                >
                  <Link to={`/product/${product.id}`} className="block relative aspect-[3/4]">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.isNew && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider rounded">
                        New
                      </span>
                    )}
                  </Link>
                  
                  <div className="p-4">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-display text-lg font-semibold group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-semibold">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 gap-2"
                        size="sm"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                      </Button>
                      <Button
                        onClick={() => handleRemoveItem(product.id)}
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
