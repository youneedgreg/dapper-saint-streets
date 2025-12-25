import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import logo from '@/assets/logo.png';

// Minimal TikTok glyph because the current lucide-react version lacks it
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    role="img"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M18.67 7.46a5.2 5.2 0 01-3.07-2.93v9.25a6.3 6.3 0 11-6.3-6.3c.23 0 .45.01.67.04v2.45a3.87 3.87 0 00-.67-.06 3.83 3.83 0 103.83 3.83V2.25h2.48a5.17 5.17 0 004.72 4.73v2.49a7.65 7.65 0 01-1.66-.01z"
    />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link to="/" className="inline-block mb-6">
              <img src={logo} alt="Dapper Sainte" className="h-10 w-auto" />
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
                href="https://instagram.com/dappersainteinc"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <Instagram className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a
                href="https://www.tiktok.com/@dappersainteinc"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="TikTok"
                target="_blank"
                rel="noreferrer"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2024 Dapper Sainte. All rights reserved.
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
