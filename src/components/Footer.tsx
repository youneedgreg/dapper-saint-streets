import { Link } from 'react-router-dom';
import { Instagram, Twitter } from 'lucide-react';
import logo from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link to="/" className="inline-block mb-6">
              <img src={logo} alt="Dapper Saint" className="h-10 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Don't blend in, Rule the scene. Premium streetwear for those who refuse to blend in.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-2">
            <h4 className="text-xs tracking-[0.2em] uppercase mb-6 text-foreground">
              Shop
            </h4>
            <ul className="space-y-3">
              {['New Arrivals', 'Hoodies', 'T-Shirts', 'Jackets', 'Accessories'].map(item => (
                <li key={item}>
                  <Link
                    to="/shop"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs tracking-[0.2em] uppercase mb-6 text-foreground">
              Company
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'About', href: '/about' },
                { name: 'Contact', href: '/contact' },
                { name: 'Lookbook', href: '/lookbook' },
              ].map(item => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs tracking-[0.2em] uppercase mb-6 text-foreground">
              Help
            </h4>
            <ul className="space-y-3">
              {['Shipping', 'Returns', 'FAQ', 'Size Guide'].map(item => (
                <li key={item}>
                  <Link
                    to="#"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-2">
            <h4 className="text-xs tracking-[0.2em] uppercase mb-6 text-foreground">
              Follow
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2024 Dapper Saint. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
