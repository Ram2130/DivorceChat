import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Header = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="border-b border-gray-200 py-4 px-6 md:px-12 bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl md:text-3xl font-bold flex items-center">
          Restart <span className="text-primary ml-2">❤️</span>
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link 
            href="/" 
            className={`font-medium hover:text-primary transition-colors ${location === '/' ? 'text-primary' : 'text-foreground'}`}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className={`font-medium hover:text-primary transition-colors ${location === '/about' ? 'text-primary' : 'text-foreground'}`}
          >
            About
          </Link>
          <Link 
            href="/browse" 
            className={`font-medium hover:text-primary transition-colors ${location === '/browse' ? 'text-primary' : 'text-foreground'}`}
          >
            Browse
          </Link>
          <Link 
            href="/my-profile" 
            className={`font-medium hover:text-primary transition-colors ${location === '/my-profile' ? 'text-primary' : 'text-foreground'}`}
          >
            My Profile
          </Link>
        </nav>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileMenu}
          className="md:hidden"
          aria-label="Menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="px-6 py-4 border-t border-gray-200 md:hidden bg-white">
          <nav className="flex flex-col space-y-4">
            <Link 
              href="/" 
              className={`font-medium hover:text-primary ${location === '/' ? 'text-primary' : 'text-foreground'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className={`font-medium hover:text-primary ${location === '/about' ? 'text-primary' : 'text-foreground'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/browse" 
              className={`font-medium hover:text-primary ${location === '/browse' ? 'text-primary' : 'text-foreground'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse
            </Link>
            <Link 
              href="/my-profile" 
              className={`font-medium hover:text-primary ${location === '/my-profile' ? 'text-primary' : 'text-foreground'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              My Profile
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
