import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Search, User } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Shop', href: '/shop' },
  { name: 'Collections', href: '/collections' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const location = useLocation();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 -ml-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
              <h1 className="font-display text-xl md:text-2xl font-bold tracking-wider">
                DAPPER<span className="text-gradient-gold ml-1">SAINT</span>
              </h1>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center gap-8 ml-12">
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "text-sm font-body tracking-wide uppercase line-reveal transition-colors",
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                className="p-2 text-foreground hover:text-primary transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button 
                className="hidden md:block p-2 text-foreground hover:text-primary transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-foreground hover:text-primary transition-colors relative"
                onClick={() => setIsCartOpen(true)}
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 w-full max-w-sm bg-background z-50 border-r border-border"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h2 className="font-display text-xl font-bold">
                    DAPPER<span className="text-gradient-gold ml-1">SAINT</span>
                  </h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-foreground"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="flex-1 p-6">
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
                            "text-2xl font-display tracking-wide block",
                            location.pathname === link.href
                              ? "text-primary"
                              : "text-foreground"
                          )}
                        >
                          {link.name}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                <div className="p-6 border-t border-border">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <User className="w-5 h-5" />
                      <span className="text-sm">Account</span>
                    </button>
                  </div>
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
