import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ProductCard } from '@/components/products/ProductCard';
import { Hero } from '@/components/layout/Hero';

export function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .limit(6);
      setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <div className="space-y-8">
      <Hero />
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[300px] rounded-lg bg-accent/50 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}