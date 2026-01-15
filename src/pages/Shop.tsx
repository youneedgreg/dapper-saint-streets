import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/data/products';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { LayoutGrid, Layers, Columns } from "lucide-react";

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

interface FilterContentProps {
  showOnSale: boolean;
  setShowOnSale: (value: boolean) => void;
  showNew: boolean;
  setShowNew: (value: boolean) => void;
  showBestSellers: boolean;
  setShowBestSellers: (value: boolean) => void;
  showFeatured: boolean;
  setShowFeatured: (value: boolean) => void;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  activeFiltersCount: number;
  clearFilters: () => void;
}

const FilterContent = ({
  showOnSale,
  setShowOnSale,
  showNew,
  setShowNew,
  showBestSellers,
  setShowBestSellers,
  showFeatured,
  setShowFeatured,
  priceRange,
  setPriceRange,
  activeFiltersCount,
  clearFilters
}: FilterContentProps) => (
  <div className="space-y-6">
    <div>
      <h3 className="font-semibold mb-3">Filters</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sale"
            checked={showOnSale}
            onCheckedChange={(checked) => setShowOnSale(checked as boolean)}
          />
          <Label htmlFor="sale" className="text-sm cursor-pointer">On Sale</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="new"
            checked={showNew}
            onCheckedChange={(checked) => setShowNew(checked as boolean)}
          />
          <Label htmlFor="new" className="text-sm cursor-pointer">New Arrivals</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="bestseller"
            checked={showBestSellers}
            onCheckedChange={(checked) => setShowBestSellers(checked as boolean)}
          />
          <Label htmlFor="bestseller" className="text-sm cursor-pointer">Best Sellers</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={showFeatured}
            onCheckedChange={(checked) => setShowFeatured(checked as boolean)}
          />
          <Label htmlFor="featured" className="text-sm cursor-pointer">Featured</Label>
        </div>
      </div>
    </div>

    <div>
      <h3 className="font-semibold mb-3">Price Range</h3>
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="minPrice" className="text-xs">Min</Label>
            <Input
              id="minPrice"
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="h-9 text-sm"
              min="0"
              max={priceRange[1]}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="maxPrice" className="text-xs">Max</Label>
            <Input
              id="maxPrice"
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="h-9 text-sm"
              min={priceRange[0]}
            />
          </div>
        </div>
      </div>
    </div>

    {activeFiltersCount > 0 && (
      <Button
        variant="outline"
        size="sm"
        onClick={clearFilters}
        className="w-full"
      >
        Clear All Filters
      </Button>
    )}
  </div>
);

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || 'All';
  const featuredFromUrl = searchParams.get('featured') === 'true';
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showOnSale, setShowOnSale] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showBestSellers, setShowBestSellers] = useState(false);
  const [showFeatured, setShowFeatured] = useState(featuredFromUrl);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isModelView, setIsModelView] = useState(true);

  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
    setShowFeatured(featuredFromUrl);
  }, [categoryFromUrl, featuredFromUrl]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  const clearFilters = () => {
    setShowOnSale(false);
    setShowNew(false);
    setShowBestSellers(false);
    setShowFeatured(false);
    setPriceRange([0, 1000]);
    setSortBy('newest');
  };

  const activeFiltersCount = [showOnSale, showNew, showBestSellers, showFeatured].filter(Boolean).length;

  // Apply filters
  let filtered = selectedCategory === 'All'
    ? [...products]
    : products.filter(p => p.category === selectedCategory);

  // Filter by sale
  if (showOnSale) {
    filtered = filtered.filter(p => p.originalPrice && p.originalPrice > p.price);
  }

  // Filter by new
  if (showNew) {
    filtered = filtered.filter(p => p.isNew);
  }

  // Filter by bestsellers
  if (showBestSellers) {
    filtered = filtered.filter(p => p.isBestSeller);
  }

  // Filter by featured
  if (showFeatured) {
    filtered = filtered.filter(p => p.isFeatured);
  }

  // Filter by price range
  filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

  // Apply sorting
  switch (sortBy) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'newest':
      filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />
      <main className="pt-24 md:pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* New Header Layout */}
          <div className="flex flex-col mb-8">
            <div className="flex items-baseline gap-2 mb-4">
              <h1 className="font-bold text-2xl uppercase tracking-wide">
                {selectedCategory === 'All' ? 'New Arrivals' : selectedCategory}
              </h1>
              <span className="text-muted-foreground text-sm font-medium pt-1">
                {filtered.length}
              </span>
            </div>

            <div className="max-w-4xl mb-8">
              <p className="text-sm text-foreground/80 leading-relaxed max-w-2xl">
                Discover the latest menswear arrivals from Dapper Saint. Explore new pieces from our Fall Winter '25 Mainline Collection, FW247 performance pieces, and the latest collaborations. From everyday staples to statement silhouettes, each arrival is crafted with signature detail and precision. <span className="underline cursor-pointer">read more</span>
              </p>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between border-t border-b border-border py-4 bg-background sticky top-[72px] z-30">
              <div className="flex items-center gap-6">
                {/* View Toggles (Visual only for now) */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-xs font-bold uppercase tracking-widest text-foreground mr-2">View</span>
                  <button className="hover:text-foreground transition-colors"><Columns className="w-5 h-5 rotate-90" strokeWidth={1.5} /></button>
                  <button className="text-foreground"><LayoutGrid className="w-5 h-5" strokeWidth={1.5} /></button>
                </div>

                {/* Model Toggle */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-foreground">Model</span>
                  <Switch
                    checked={isModelView}
                    onCheckedChange={setIsModelView}
                    className="data-[state=checked]:bg-black"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Filter Trigger */}
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                      <span className="text-xs font-bold uppercase tracking-widest">Filter</span>
                      <Filter className="h-4 w-4" />
                    </button>
                  </SheetTrigger>
                  {/* ... Sheet Content Content ... */}
                  <SheetContent side="right" className="w-[400px]">
                    <SheetHeader>
                      <SheetTitle className="uppercase tracking-widest text-left border-b border-border pb-4">Filter</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent
                        showOnSale={showOnSale}
                        setShowOnSale={setShowOnSale}
                        showNew={showNew}
                        setShowNew={setShowNew}
                        showBestSellers={showBestSellers}
                        setShowBestSellers={setShowBestSellers}
                        showFeatured={showFeatured}
                        setShowFeatured={setShowFeatured}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        activeFiltersCount={activeFiltersCount}
                        clearFilters={clearFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {showOnSale && (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-secondary rounded-full">
                  On Sale
                  <button onClick={() => setShowOnSale(false)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {showNew && (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-secondary rounded-full">
                  New Arrivals
                  <button onClick={() => setShowNew(false)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {showBestSellers && (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-secondary rounded-full">
                  Best Sellers
                  <button onClick={() => setShowBestSellers(false)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {showFeatured && (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-secondary rounded-full">
                  Featured
                  <button onClick={() => setShowFeatured(false)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Products Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
              {filtered.map((product, i) => <ProductCard key={product.id} product={product} index={i} isModelView={isModelView} />)}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No products found matching your filters.</p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
