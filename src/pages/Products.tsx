import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ProductCard } from '@/components/products/ProductCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  stock_quantity: number;
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      const query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (search) {
        query.ilike('name', `%${search}%`);
      }

      const { data } = await query;
      setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, [search]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-[300px] rounded-lg bg-accent/50 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}