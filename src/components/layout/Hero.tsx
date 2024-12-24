import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <div className="relative h-[70vh] flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50" />
      </div>
      <div className="container mx-auto px-4 relative">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Our Latest Collection
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Shop the latest trends with our curated selection of premium products
          </p>
          <Button asChild size="lg">
            <Link to="/products">Shop Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}