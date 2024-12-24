import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface RecentOrdersProps {
  className?: string;
}

export function RecentOrders({ className }: RecentOrdersProps) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .order('created_at', { ascending: false })
        .limit(5);
      setOrders(data || []);
    }
    fetchOrders();
  }, []);

  return (
    <Card className={`backdrop-blur-sm bg-card/50 ${className}`}>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 rounded-lg bg-accent/50"
            >
              <div>
                <p className="font-medium">{order.whatsapp_number}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${order.total_amount}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {order.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}