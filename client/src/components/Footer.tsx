import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="text-xl font-bold flex items-center">
              Restart <span className="text-primary ml-2">❤️</span>
            </Link>
            <p className="text-gray-600 mt-2 text-sm">A new beginning for meaningful connections</p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 text-center md:text-left">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">About</h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li><Link href="/about" className="hover:text-primary">Our Story</Link></li>
                <li><Link href="/about#how-it-works" className="hover:text-primary">How It Works</Link></li>
                <li><Link href="/about#security" className="hover:text-primary">Security</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Support</h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li><Link href="/about#help" className="hover:text-primary">Help Center</Link></li>
                <li><Link href="/about#safety" className="hover:text-primary">Safety Tips</Link></li>
                <li><a href="mailto:support@restart.com" className="hover:text-primary">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Legal</h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li><Link href="/about#privacy" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/about#terms" className="hover:text-primary">Terms of Service</Link></li>
                <li><Link href="/about#cookies" className="hover:text-primary">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Restart. All rights reserved.</p>
          <p className="mt-2">Restart focuses on secure dating for new beginnings.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
