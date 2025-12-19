import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Heart, Share2, ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { Button } from '@/components/ui/button';
import { getProductById } from '@/data/products';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/currency';

const ProductDetail = () => {
  const { id } = useParams();
  const product = getProductById(id || '');
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);

  if (!product) return <div className="min-h-screen bg-background flex items-center justify-center">Product not found</div>;

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error('Please select a size'); return; }
    addToCart(product, selectedColor, selectedSize, quantity);
    toast.success('Added to cart');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />
      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ChevronLeft className="w-4 h-4" /> Back to Shop
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            <div className="space-y-4">
              <motion.div className="aspect-[3/4] bg-card rounded-lg overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <img src={product.images[currentImage]} alt={product.name} className="w-full h-full object-cover" />
              </motion.div>
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setCurrentImage(i)} className={cn("w-20 h-20 rounded-lg overflow-hidden border-2", currentImage === i ? "border-primary" : "border-transparent")}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-primary mb-2">{product.category}</p>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
                  {product.originalPrice && <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>}
                </div>
              </div>
              <p className="text-muted-foreground">{product.description}</p>
              <div>
                <p className="text-sm font-semibold mb-3">Color: {selectedColor}</p>
                <div className="flex gap-2">
                  {product.colors.map(c => (
                    <button key={c.name} onClick={() => setSelectedColor(c.name)} className={cn("w-10 h-10 rounded-full border-2", selectedColor === c.name ? "border-primary" : "border-border")} style={{ backgroundColor: c.hex }} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-3">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)} className={cn("px-4 py-2 border rounded-lg text-sm", selectedSize === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-foreground")}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3"><Minus className="w-4 h-4" /></button>
                  <span className="px-4 tabular-nums">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3"><Plus className="w-4 h-4" /></button>
                </div>
                <Button onClick={handleAddToCart} size="lg" className="flex-1 bg-primary text-primary-foreground">Add to Cart</Button>
              </div>
              <div className="flex gap-4 pt-4 border-t border-border">
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><Heart className="w-4 h-4" /> Wishlist</button>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><Share2 className="w-4 h-4" /> Share</button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
