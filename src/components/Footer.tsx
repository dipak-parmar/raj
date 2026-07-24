import Link from "next/link";
import { MessageSquare, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-lightMint border-t border-white/5 font-inter pt-16 pb-8 z-10 relative">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-6">
          <Link href="/">
            <span className="text-2xl font-playfair font-bold text-white tracking-widest block">
              RAJ MARKETING
            </span>
          </Link>
          <p className="text-sm text-lightMint/60 max-w-sm leading-relaxed">
            Crafting the peak of organic skincare science since 2004. Our formulations represent the harmony of wild nature, molecular innovation, and over three decades of trust.
          </p>
          <div className="flex space-x-4 pt-2">
            <a
              href="https://wa.me/919924750849"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-white/5 hover:bg-accent hover:text-primary transition-all duration-300 text-white"
              aria-label="WhatsApp link"
            >
              <MessageSquare className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/raj_marketing15/"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-white/5 hover:bg-accent hover:text-primary transition-all duration-300 text-white"
              aria-label="Instagram link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Navigation */}
        <div className="space-y-4">
          <h4 className="font-playfair text-white text-base font-semibold tracking-wider">
            Explore
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/" className="text-lightMint/60 hover:text-accent transition-colors duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-lightMint/60 hover:text-accent transition-colors duration-300">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-lightMint/60 hover:text-accent transition-colors duration-300">
                Products
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-lightMint/60 hover:text-accent transition-colors duration-300">
                Our Services
              </Link>
            </li>
            <li>
              <Link href="/trust" className="text-lightMint/60 hover:text-accent transition-colors duration-300">
                Trust & Purity
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Regulations */}
        <div className="space-y-4">
          <h4 className="font-playfair text-white text-base font-semibold tracking-wider">
            Policies
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/privacy" className="text-lightMint/60 hover:text-accent transition-colors duration-300">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-lightMint/60 hover:text-accent transition-colors duration-300">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="text-lightMint/60 hover:text-accent transition-colors duration-300">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link href="/returns" className="text-lightMint/60 hover:text-accent transition-colors duration-300">
                Return & Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/orders" className="text-lightMint/60 hover:text-accent transition-colors duration-300">
                Track My Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div className="space-y-4">
          <h4 className="font-playfair text-white text-base font-semibold tracking-wider">
            Contact Us
          </h4>
          <ul className="space-y-3.5 text-sm">
            <li className="flex items-start space-x-3 text-lightMint/60">
              <Mail className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <a href="mailto:dipakparmar2466@gmail.com" className="hover:text-accent transition-colors duration-300">
                dipakparmar2466@gmail.com
              </a>
            </li>
            <li className="flex items-start space-x-3 text-lightMint/60">
              <Phone className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div className="flex flex-col space-y-1">
                <a href="tel:+919924750849" className="hover:text-accent transition-colors duration-300">
                  +91 99247 50849
                </a>
                <a href="tel:+919510583980" className="hover:text-accent transition-colors duration-300">
                  +91 95105 83980
                </a>
                <a href="tel:+919328045809" className="hover:text-accent transition-colors duration-300">
                  +91 93280 45809
                </a>
              </div>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-lightMint/40">
        <p>© {currentYear} RAJ MARKETING. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Designed & crafted for unmatched biological skincare excellence.</p>
      </div>
    </footer>
  );
}
