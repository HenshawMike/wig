import { Crown, Instagram, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-accent/30 p-0.5 bg-background">
                <img 
                  src="/src/assets/logo*.jpg" 
                  alt="Domtornyluxe Hairmpire Logo" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-lg font-bold bg-gradient-purple-gold bg-clip-text text-transparent">
                Domtornyluxe Hairmpire
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Stay Slayed , Stay Elegant
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe for exclusive offers and updates.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-1"
              />
              <Button variant="gold" size="sm">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Domtornyluxe Hairmpire. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
