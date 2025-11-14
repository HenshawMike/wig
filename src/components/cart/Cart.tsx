import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";

export function Cart() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div>
          <h3 className="text-lg font-medium">Your cart is empty</h3>
          <p className="text-muted-foreground mt-2">
            Looks like you haven't added anything to your cart yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-md overflow-hidden border">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(item.price)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="h-8 w-8 p-0"
                >
                  -
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="h-8 w-8 p-0"
                >
                  +
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item.id)}
                  className="h-8 w-8 text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t p-6">
        <div className="flex justify-between text-lg font-medium mb-4">
          <span>Total</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
        </p>
        <Button className="w-full" size="lg">
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}
