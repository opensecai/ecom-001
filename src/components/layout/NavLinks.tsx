import { Link } from 'react-router-dom';

interface NavLink {
  to: string;
  label: string;
}

const links: NavLink[] = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

interface NavLinksProps {
  onClick?: () => void;
  className?: string;
}

export function NavLinks({ onClick, className = '' }: NavLinksProps) {
  return (
    <>
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`text-foreground/80 hover:text-foreground transition-colors relative group ${className}`}
          onClick={onClick}
        >
          {link.label}
          <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-primary/60 to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform" />
        </Link>
      ))}
    </>
  );
}