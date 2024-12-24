import { useState } from 'react';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function CartSheet() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCartStore();
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [address, setAddress] = useState('');
  const { toast } = useToast();

  const handleCheckout = () => {
    if (!whatsappNumber || !address) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    // Format the order message for WhatsApp
    const message = `New Order:\n\n${items
      .map((item) => `${item.name} x${item.quantity} - $${item.price * item.quantity}`)
      .join('\n')}\n\nTotal: $${total}\n\nDelivery Address: ${address}`;

    // Create WhatsApp link
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

    // Open WhatsApp in new tab
    window.open(whatsappLink, '_blank');

    // Clear cart after order
    clearCart();
    toast({
      title: 'Order Placed',
      description: 'Your order has been sent via WhatsApp',
    });
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground">Add some products to get started</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto py-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center space-x-4 mb-4 p-4 rounded-lg bg-accent/50 backdrop-blur-sm"
          >
            <img
              src={item.image_url}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-md"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-muted-foreground">
                ${item.price * item.quantity}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span>{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="mb-4">
          <Input
            placeholder="WhatsApp number (with country code)"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            className="mb-2"
          />
          <Input
            placeholder="Delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total:</span>
          <span className="font-semibold">${total}</span>
        </div>
        <Button className="w-full" onClick={handleCheckout}>
          Checkout via WhatsApp
        </Button>
      </div>
    </div>
  );
}