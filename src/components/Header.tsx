import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Search, Sun, Moon, User, LogOut } from 'lucide-react';
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

const navLinks = [
  { name: 'Shop', href: '/shop' },
  { name: 'Lookbook', href: '/lookbook' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [firstName, setFirstName] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);

  const { totalItems, setIsCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const logo = (!isScrolled && location.pathname === '/') ? logoLight : (theme === 'dark' ? logoLight : logoDark);
  const textColor = (!isScrolled && location.pathname === '/') ? "text-white" : "text-foreground";

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
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          isScrolled ? "bg-background/95 backdrop-blur-sm py-2 shadow-sm" : "bg-transparent py-4"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">

            {/* Left Actions: Menu + Search */}
            <div className="flex items-center gap-4 flex-1">
              <button
                className={cn("p-2 -ml-2 transition-colors hover:opacity-70", textColor)}
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" strokeWidth={1.5} />
              </button>
              <button
                className={cn(
                  "p-2 transition-colors hidden md:block hover:opacity-70",
                  textColor
                )}
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
              >
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Center: Logo */}
            <div className="flex-1 flex justify-center">
              <Link to="/">
                <img
                  src={logo}
                  alt="Dapper Sainte"
                  className="h-10 md:h-16 w-auto transition-all duration-300 transform hover:scale-105" // Made logo slightly bigger
                />
              </Link>
            </div>

            {/* Right Actions: User + Cart */}
            <div className="flex items-center justify-end gap-2 flex-1">
              {/* Search on mobile moves here or stays in menu? Let's add search icon here for mobile too */}
              <button
                className={cn("p-2 transition-colors md:hidden hover:opacity-70", textColor)}
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
              >
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </button>

              <button
                className={cn("p-2 transition-colors hidden md:block hover:opacity-70", textColor)}
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" strokeWidth={1.5} /> : <Moon className="w-5 h-5" strokeWidth={1.5} />}
              </button>

              {loading ? (
                <button className={cn("p-2", textColor)}><User className="w-5 h-5" strokeWidth={1.5} /></button>
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className={cn("p-2 transition-colors flex items-center gap-2 hover:opacity-70", textColor)}>
                      {firstName ? (
                        <div className={cn("w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center",
                          !isScrolled && location.pathname === '/' ? "bg-white text-black" : "bg-foreground text-background"
                        )}>
                          {firstName.charAt(0).toUpperCase()}
                        </div>
                      ) : (
                        <User className="w-5 h-5" strokeWidth={1.5} />
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-background border-border">
                    <DropdownMenuItem asChild><Link to="/profile">Profile</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/orders">Orders</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/wishlist">Wishlist</Link></DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild><Link to="/admin">Admin Panel</Link></DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}><LogOut className="w-4 h-4 mr-2" /> Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login" className={cn("p-2 hover:opacity-70", textColor)}><User className="w-5 h-5" strokeWidth={1.5} /></Link>
              )}

              <button
                className={cn("p-2 transition-colors relative hover:opacity-70", textColor)}
                onClick={() => setIsCartOpen(true)}
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-white text-[10px] font-medium flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Side Menu (Mobile & Desktop Trigger) */}
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
              className="fixed inset-y-0 left-0 w-full max-w-sm bg-background border-r border-border z-50 p-6 shadow-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex items-center justify-between mb-8">
                <img src={logo} alt="Dapper" className="h-6 w-auto" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-foreground hover:bg-muted rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav>
                <ul className="space-y-4">
                  {navLinks.map((link, idx) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                    >
                      <Link
                        to={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-3xl font-display font-medium text-foreground hover:text-muted-foreground transition-colors block"
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <div className="absolute bottom-8 left-6 right-6">
                <button onClick={toggleTheme} className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground">
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
