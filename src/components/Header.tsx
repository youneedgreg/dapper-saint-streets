import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Search, User, LogOut, Heart, Bell, Sun, Moon } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import logoLight from '@/assets/logo.png';
import logoDark from '@/assets/logo-dark.png';
import SearchModal from './SearchModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import MenuCollectionPreview from './MenuCollectionPreview';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [firstName, setFirstName] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);

  const { totalItems, setIsCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Always use light logo (white) on top for this specific dark/premium aesthetic unless scrolled on white bg
  // But strictly following "Represent" style usually implies a dark or transparent header with white text initially.
  // We'll stick to dynamic based on scroll for usability.
  const logo = (!isScrolled && location.pathname === '/') ? logoLight : (theme === 'dark' ? logoLight : logoDark);
  const textColor = (!isScrolled && location.pathname === '/') ? "text-white" : "text-foreground";
  const linkClass = cn(
    "text-xs font-bold tracking-[0.15em] uppercase hover:text-white/70 transition-colors",
    textColor
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      loadUserProfile();
    } else if (!user) {
      setFirstName('');
    }
  }, [user, loading, isAdmin]);

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('id', user?.id);

      if (error) {
        console.error('[Header] loadUserProfile: error', error.message);
        return;
      }

      if (data && data.length > 0 && data[0]?.first_name) {
        setFirstName(data[0].first_name);
      }
    } catch (error) {
      console.error('[Header] loadUserProfile: exception', error instanceof Error ? error.message : String(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: 'Signed out',
        description: 'You have been logged out.',
      });
    } catch (error) {
      console.error('[Header] signOut: error', error instanceof Error ? error.message : String(error));
      toast({
        title: 'Sign out failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300 font-sans",
          isScrolled ? "bg-background/95 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Left: Menu & Nav */}
          <div className="flex items-center gap-4 md:gap-6">
            <button
              className={cn("p-2 -ml-2 transition-colors hover:opacity-70", textColor)}
              onClick={() => setIsMobileMenuOpen(true)}
              onMouseEnter={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/shop" className={linkClass}>Shop</Link>
              <Link to="/lookbook" className={linkClass}>Lookbook</Link>
            </nav>
          </div>

          {/* Center: Logo */}
          <Link to="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <img
              src={logo}
              alt="Dapper Sainte"
              className="h-8 md:h-9 w-auto object-contain"
            />
          </Link>

          {/* Right: Search Only */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className={cn("p-2 -mr-2 transition-colors hover:opacity-70", textColor)}
            aria-label="Search"
          >
            <Search className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>
      </motion.header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Side Menu (Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 w-full max-w-[360px] bg-background border-r border-border z-50 flex flex-col shadow-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onMouseLeave={() => setIsMobileMenuOpen(false)}
            >
              <div className="p-6 flex items-center justify-between border-b border-border">
                <span className="text-sm font-bold tracking-widest uppercase text-muted-foreground">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-foreground hover:bg-muted rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto flex flex-col">
                {/* Navigation Links */}
                <nav className="p-8 space-y-8">
                  <ul className="space-y-6" onMouseLeave={() => setActiveCollection(null)}>
                    <li>
                      <Link
                        to="/shop?collection=fw25"
                        onClick={() => setIsMobileMenuOpen(false)}
                        onMouseEnter={() => setActiveCollection('fw25')}
                        className="text-3xl font-bold uppercase tracking-tighter block hover:text-muted-foreground transition-colors"
                      >
                        THE PRELUDE
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop?collection=initial"
                        onClick={() => setIsMobileMenuOpen(false)}
                        onMouseEnter={() => setActiveCollection('initial')}
                        className="text-3xl font-bold uppercase tracking-tighter block hover:text-muted-foreground transition-colors"
                      >
                        Initial
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop?collection=247"
                        onClick={() => setIsMobileMenuOpen(false)}
                        onMouseEnter={() => setActiveCollection('247')}
                        className="text-3xl font-bold uppercase tracking-tighter block hover:text-muted-foreground transition-colors"
                      >
                        247
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop?collection=owners-club"
                        onClick={() => setIsMobileMenuOpen(false)}
                        onMouseEnter={() => setActiveCollection('owners-club')}
                        className="text-3xl font-bold uppercase tracking-tighter block hover:text-muted-foreground transition-colors"
                      >
                        Owners Club
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop?collection=woman"
                        onClick={() => setIsMobileMenuOpen(false)}
                        onMouseEnter={() => setActiveCollection('woman')}
                        className="text-3xl font-bold uppercase tracking-tighter block hover:text-muted-foreground transition-colors"
                      >
                        Woman
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop?collection=essentials"
                        onClick={() => setIsMobileMenuOpen(false)}
                        onMouseEnter={() => setActiveCollection('essentials')}
                        className="text-2xl font-bold uppercase tracking-wider block text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Essentials
                      </Link>
                    </li>
                  </ul>

                  <div className="space-y-4 pt-8 border-t border-border">
                    <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground block hover:text-foreground">About</Link>
                    <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground block hover:text-foreground">Contact</Link>
                  </div>
                </nav>
              </div>

              {/* Toolbar Icons in Footer */}
              <div className="p-6 border-t border-border bg-muted/10">
                <div className="flex items-center justify-between px-4">
                  {/* Theme Toggle */}
                  <button onClick={toggleTheme} className="hover:opacity-70 transition-opacity" aria-label="Toggle Theme">
                    {theme === 'dark' ? <Sun className="w-6 h-6" strokeWidth={1.5} /> : <Moon className="w-6 h-6" strokeWidth={1.5} />}
                  </button>

                  {/* Notifications */}
                  <button className="hover:opacity-70 transition-opacity relative" aria-label="Notifications">
                    <Bell className="w-6 h-6" strokeWidth={1.5} />
                  </button>

                  {/* Wishlist */}
                  <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="hover:opacity-70 transition-opacity" aria-label="Wishlist">
                    <Heart className="w-6 h-6" strokeWidth={1.5} />
                  </Link>

                  {/* Profile */}
                  {user ? (
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="hover:opacity-70 transition-opacity" aria-label="Profile">
                      <User className="w-6 h-6" strokeWidth={1.5} />
                    </Link>
                  ) : (
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="hover:opacity-70 transition-opacity" aria-label="Login">
                      <User className="w-6 h-6" strokeWidth={1.5} />
                    </Link>
                  )}

                  {/* Cart */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsCartOpen(true);
                    }}
                    className="hover:opacity-70 transition-opacity relative"
                    aria-label="Cart"
                  >
                    <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                        {totalItems}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Collection Preview Panel */}
              <AnimatePresence>
                {activeCollection && (
                  <MenuCollectionPreview collectionId={activeCollection} />
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
