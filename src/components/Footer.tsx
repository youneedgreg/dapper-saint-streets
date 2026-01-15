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
    <footer className="bg-background border-t border-border pt-20 pb-10 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block mb-8">
              <img src={logo} alt="Dapper Sainte" className="h-8 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-6">
              Premium streetwear. <br />Designed for the bold.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/dappersainteinc"
                className="text-foreground hover:text-muted-foreground transition-colors"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <Instagram className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a
                href="https://www.tiktok.com/@dappersainteinc"
                className="text-foreground hover:text-muted-foreground transition-colors"
                aria-label="TikTok"
                target="_blank"
                rel="noreferrer"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-sm font-bold tracking-[0.2em] uppercase mb-6 text-foreground">Shop</h4>
              <ul className="space-y-4">
                {['New Arrivals', 'Hoodies', 'T-Shirts', 'Accessories'].map(item => (
                  <li key={item}>
                    <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground transition-colors line-reveal">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-[0.2em] uppercase mb-6 text-foreground">Company</h4>
              <ul className="space-y-4">
                {[
                  { name: 'About', href: '/about' },
                  { name: 'Contact', href: '/contact' },
                  { name: 'Lookbook', href: '/lookbook' },
                ].map(item => (
                  <li key={item.name}>
                    <Link to={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors line-reveal">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-[0.2em] uppercase mb-6 text-foreground">Support</h4>
              <ul className="space-y-4">
                {['Shipping', 'Returns', 'Size Guide', 'FAQ'].map(item => (
                  <li key={item}>
                    <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors line-reveal">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Big Branding */}
        <div className="border-t border-border pt-10 flex flex-col items-center">
          <h1 className="font-oswald text-[16vw] leading-none text-foreground/5 tracking-tighter select-none pointer-events-none uppercase">
            Dapper Sainte
          </h1>
          <div className="w-full flex justify-between items-center text-xs text-muted-foreground mt-8">
            <p>© 2024 Dapper Sainte Inc.</p>
            <div className="flex gap-6">
              <Link to="/privacy-policy" className="hover:text-foreground">Privacy</Link>
              <Link to="/terms-of-service" className="hover:text-foreground">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
