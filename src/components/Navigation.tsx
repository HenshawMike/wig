import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { CartDropdown } from "./cart/CartDropdown";
import { UserMenu } from "./UserMenu";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/images/logo*.jpg"
              alt="Domtornyluxe Hairmpire logo"
              className="w-10 h-10 object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-xl font-bold bg-gradient-purple-gold bg-clip-text text-transparent">
              Domtornyluxe Hairmpire
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-300 hover:text-accent ${
                  isActive(link.path) ? "text-accent" : "text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth and Cart */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </>
            )}
            <CartDropdown />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <CartDropdown />
            <button
              className="text-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div 
        className={`fixed top-0 right-0 h-screen w-[320px] bg-background shadow-2xl z-50 transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Close Button */}
          <div className="flex justify-end p-4">
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-accent/10 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center py-4 px-4 text-lg font-medium transition-colors duration-200 ${
                  isActive(link.path) 
                    ? 'text-accent font-semibold' 
                    : 'text-foreground hover:text-accent'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Auth Section */}
            <div className="border-t border-border p-4 mt-4">
              {isAuthenticated ? (
                <div className="mb-4">
                  <div className="flex items-center gap-3 px-2 py-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-accent/10 flex items-center justify-center">
                      {user?.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={user.displayName || 'User'} 
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <User className="h-5 w-5 text-accent" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{user?.displayName || 'User'}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/account');
                      setIsOpen(false);
                    }}
                    className="w-full py-2 px-4 rounded-lg hover:bg-accent/10 transition-colors duration-300 text-left mt-3"
                  >
                    My Account
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full py-2 px-4 rounded-lg hover:bg-accent/10 transition-colors duration-300 text-red-500 mt-2 text-left"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate('/login');
                      setIsOpen(false);
                    }}
                    className="w-full py-3 px-6 rounded-lg hover:bg-accent/10 transition-colors duration-300 text-left"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      navigate('/signup');
                      setIsOpen(false);
                    }}
                    className="w-full py-3 px-6 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors duration-300 mt-3 text-left"
                  >
                    Create Account
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Domtornyluxe Hairmpire
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
