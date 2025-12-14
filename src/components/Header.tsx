import { Hotel, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'booking', label: 'New Booking' },
  { id: 'guests', label: 'Guests' },
];

export const Header = ({ activeTab, onTabChange }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
              <Hotel className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-semibold text-foreground">Grand Luxe</h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Hotel & Resort</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'gold' : 'ghost'}
                size="sm"
                onClick={() => onTabChange(item.id)}
                className="px-4"
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border/50 animate-slide-up">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? 'gold' : 'ghost'}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="justify-start"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
