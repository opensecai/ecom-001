import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Overview } from '@/components/admin/Overview';
import { RecentOrders } from '@/components/admin/RecentOrders';
import { DollarSign, Package, ShoppingCart } from 'lucide-react';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const [orders, products] = await Promise.all([
        supabase.from('orders').select('total_amount'),
        supabase.from('products').select('id'),
      ]);

      const totalRevenue = orders.data?.reduce(
        (sum, order) => sum + order.total_amount,
        0
      ) || 0;

      setStats({
        totalOrders: orders.data?.length || 0,
        totalProducts: products.data?.length || 0,
        totalRevenue,
      });
    }
    fetchStats();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="backdrop-blur-sm bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue}</div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-7">
        <Overview className="md:col-span-4" />
        <RecentOrders className="md:col-span-3" />
      </div>
    </div>
  );
}