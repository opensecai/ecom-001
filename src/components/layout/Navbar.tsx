import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Sun, Moon, Menu, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { useCartStore } from '@/lib/store';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { CartSheet } from '@/components/cart/CartSheet';
import { NavLinks } from './NavLinks';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { setTheme, theme } = useTheme();
  const itemCount = useCartStore((state) => state.itemCount);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-gradient-to-r from-background/95 via-background/98 to-background/95 backdrop-blur-md shadow-sm'
          : 'bg-gradient-to-r from-background/50 via-background/30 to-background/50 backdrop-blur-sm'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <Store className="h-6 w-6 text-primary transition-colors group-hover:text-primary/80" />
            <span className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLinks />
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="relative w-9 h-9 hover:bg-primary/10"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-primary" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative w-9 h-9 hover:bg-primary/10"
                >
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center animate-in zoom-in">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Shopping Cart</SheetTitle>
                </SheetHeader>
                <CartSheet />
              </SheetContent>
            </Sheet>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-9 h-9 hover:bg-primary/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5 text-primary" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-background/98 to-background/95 backdrop-blur-md border-t border-primary/10">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <NavLinks
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 px-4 hover:bg-primary/5 rounded-md"
            />
          </div>
        </div>
      )}
    </nav>
  );
}