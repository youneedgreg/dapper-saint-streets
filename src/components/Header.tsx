import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Search, Sun, Moon, User, LogOut } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
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
  const { totalItems, setIsCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut, isAdmin } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const logo = theme === 'dark' ? logoLight : logoDark;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: 'Signed out',
        description: 'You have been logged out.',
      });
    } catch (error) {
      console.error('Sign out failed', error);
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
        className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Top announcement bar */}
        <div className="border-b border-border">
          <div className="container mx-auto px-6">
            <p className="text-center text-xs tracking-widest uppercase py-2 text-muted-foreground">
              Free Shipping on Orders Over KSh 10,000
            </p>
          </div>
        </div>

        {/* Main header */}
        <div className="border-b border-border">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16 relative">
              {/* Left nav - Desktop */}
              <nav className="hidden md:flex items-center gap-8 flex-1">
                {navLinks.slice(0, 2).map(link => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={cn(
                      "text-xs tracking-[0.2em] uppercase transition-colors",
                      location.pathname === link.href
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 -ml-2 text-foreground"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" strokeWidth={1.5} />
              </button>

              {/* Logo - Centered */}
              <Link to="/" className="absolute left-1/2 -translate-x-1/2 z-10">
                <img 
                  src={logo} 
                  alt="Dapper Sainte" 
                  className="h-10 w-auto"
                />
              </Link>

              {/* Right nav - Desktop */}
              <nav className="hidden md:flex items-center gap-8 flex-1 justify-end">
                {navLinks.slice(2).map(link => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={cn(
                      "text-xs tracking-[0.2em] uppercase transition-colors",
                      location.pathname === link.href
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* Right icons */}
              <div className="flex items-center gap-1">
                <button
                  className="p-2 text-foreground hover:text-muted-foreground transition-colors"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5" strokeWidth={1.5} />
                  ) : (
                    <Moon className="w-5 h-5" strokeWidth={1.5} />
                  )}
                </button>
                
                {/* User dropdown */}
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-2 text-foreground hover:text-muted-foreground transition-colors"
                        aria-label="Account"
                      >
                        <User className="w-5 h-5" strokeWidth={1.5} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="cursor-pointer">
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/orders" className="cursor-pointer">
                          Order History
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/wishlist" className="cursor-pointer">
                          Wishlist
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to="/admin" className="cursor-pointer">
                              Admin Panel
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    to="/login"
                    className="p-2 text-foreground hover:text-muted-foreground transition-colors"
                    aria-label="Account"
                  >
                    <User className="w-5 h-5" strokeWidth={1.5} />
                  </Link>
                )}
                <button
                  className="p-2 text-foreground hover:text-muted-foreground transition-colors relative"
                  onClick={() => setIsCartOpen(true)}
                  aria-label="Cart"
                >
                  <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-foreground text-background text-[10px] font-medium flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile menu */}
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
              className="fixed inset-y-0 left-0 w-full max-w-sm bg-background/95 backdrop-blur-md z-50 border-r border-border"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <img 
                    src={logo} 
                    alt="Dapper Sainte" 
                    className="h-8 w-auto"
                  />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-foreground"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>

                <nav className="flex-1 p-8">
                  <ul className="space-y-6">
                    {navLinks.map((link, index) => (
                      <motion.li
                        key={link.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "text-2xl font-display tracking-wider block",
                            location.pathname === link.href
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {link.name}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                {/* Theme toggle in mobile menu */}
                <div className="p-6 border-t border-border">
                  <button
                    className="flex items-center gap-3 text-muted-foreground"
                    onClick={toggleTheme}
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun className="w-5 h-5" strokeWidth={1.5} />
                        <span className="text-sm">Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-5 h-5" strokeWidth={1.5} />
                        <span className="text-sm">Dark Mode</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
