import { motion } from 'framer-motion';
import { products } from '@/data/products';
import { Link } from 'react-router-dom';

// Mapping of collection IDs to specific product IDs for demonstration
const collectionProductMap: Record<string, string[]> = {
    'fw25': ['3', '9', '7'],         // Winter/heavy items
    'initial': ['1', '2', '6'],      // Core basics
    '247': ['4', '10', '5'],         // Active/Performance
    'owners-club': ['1', '6', '2'],  // Branded items (reusing some)
    'woman': ['5', '8', '2'],        // Unisex/Woman appropriate
    'essentials': ['2', '6', '10']   // Basics
};

interface MenuCollectionPreviewProps {
    collectionId: string;
}

const MenuCollectionPreview = ({ collectionId }: MenuCollectionPreviewProps) => {
    const productIds = collectionProductMap[collectionId] || [];
    const displayProducts = products.filter(p => productIds.includes(p.id));

    // If no specific products found, show latest 3 products as fallback
    const finalProducts = displayProducts.length > 0
        ? displayProducts
        : products.slice(0, 3);

    return (
        <motion.div
            className="absolute top-0 left-full h-full w-[400px] bg-background border-r border-border p-8 hidden lg:flex flex-col gap-6 z-40 overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <div className="flex items-center justify-between border-b border-border pb-4 mb-2">
                <span className="text-sm font-bold tracking-widest uppercase text-muted-foreground">Preview</span>
                <Link
                    to={`/shop?collection=${collectionId}`}
                    className="text-xs font-medium uppercase tracking-wider hover:text-muted-foreground transition-colors"
                >
                    View All
                </Link>
            </div>

            <div className="flex-1 grid grid-cols-1 gap-4 overflow-y-auto">
                {finalProducts.map((product) => (
                    <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="group flex gap-4 items-center p-2 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                        <div className="w-20 h-24 overflow-hidden rounded bg-secondary">
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm uppercase tracking-wide mb-1 group-hover:text-muted-foreground transition-colors">
                                {product.name}
                            </h4>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                {product.description}
                            </p>
                            <span className="text-sm font-medium">
                                ${product.price}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </motion.div>
    );
};

export default MenuCollectionPreview;
