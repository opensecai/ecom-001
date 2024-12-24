import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart`,
    });
  };

  return (
    <Card className="overflow-hidden backdrop-blur-sm bg-card/50 border">
      <CardHeader className="p-0">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <p className="text-lg font-bold mt-2">${product.price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}