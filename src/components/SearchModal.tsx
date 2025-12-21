import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products, Product } from '@/data/products';
import { formatPrice } from '@/lib/currency';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = products.filter(
      product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    setResults(filtered);
  }, [query]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/98"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full h-full flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-6 h-6" strokeWidth={1.5} />
            </button>

            {/* Search container */}
            <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-6">
              {/* Search input */}
              <div className="w-full border-b border-border pb-4 mb-8">
                <div className="flex items-center gap-4">
                  <Search className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 bg-transparent text-2xl md:text-3xl font-display outline-none placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="w-full max-h-[50vh] overflow-y-auto">
                {query && results.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    <p className="text-sm">No products found for "{query}"</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-4">
                    {results.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={`/product/${product.id}`}
                          onClick={onClose}
                          className="flex items-center gap-4 p-3 hover:bg-secondary transition-colors"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-16 h-20 object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium truncate">
                              {product.name}
                            </h4>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">
                              {product.category}
                            </p>
                          </div>
                          <span className="text-sm">
                            {formatPrice(product.price)}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-4">Popular</p>
                    <div className="flex flex-wrap gap-3">
                      {['Hoodies', 'Jackets', 'T-Shirts', 'New Arrivals'].map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-4 py-2 border border-border text-xs tracking-[0.1em] uppercase hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
