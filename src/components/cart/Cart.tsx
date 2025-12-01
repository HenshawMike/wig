import { X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { reduceProductStock } from "@/services/productService";

export function Cart() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  // Format and validate WhatsApp number
  const formatWhatsAppNumber = (number: string): string | null => {
    if (!number) return null;
    // Remove all non-digit characters
    const digits = number.replace(/\D/g, '');
    
    // Check if number has country code, if not assume it's a Nigerian number (234)
    if (digits.startsWith('0')) {
      return '234' + digits.substring(1);
    } else if (!digits.startsWith('234') && digits.length <= 10) {
      return '234' + digits;
    } else if (digits.startsWith('+')) {
      return digits.substring(1);
    }
    return digits;
  };

  const handleWhatsAppOrder = async () => {
    // Validation
    if (!customerName.trim()) {
      toast({ title: "Error", description: "Please enter your name" });
      return;
    }
    if (!customerPhone.trim()) {
      toast({ title: "Error", description: "Please enter your phone number" });
      return;
    }
    if (!customerAddress.trim()) {
      toast({ title: "Error", description: "Please enter your delivery address" });
      return;
    }

    setIsProcessing(true);

    try {
      // Reduce stock for each item
      for (const item of items) {
        await reduceProductStock(item.id, item.quantity)
          .catch(() => {});
      }

      // Format phone number (add country code if missing)
      const formatPhoneNumber = (number: string) => {
        const digits = number.replace(/\D/g, "");
        if (digits.startsWith("0")) return "234" + digits.substring(1);
        if (!digits.startsWith("234") && digits.length <= 10) return "234" + digits;
        return digits;
      };

      const phoneNumber = formatPhoneNumber("08147188319"); // Your WhatsApp number
      
      // Build the order message
      let message = `New Order from ${customerName}\n`;
      message += `Phone: ${customerPhone}\n`;
      message += `Address: ${customerAddress}\n\n`;
      message += "*Order Items:*\n";
      
      items.forEach(item => {
        message += `• ${item.name} (x${item.quantity}) - ₦${(item.price * item.quantity).toLocaleString("en-NG")}\n`;
      });
      
      message += `\n*Total: ₦${totalPrice.toLocaleString("en-NG")}*`;
      message += "\n\nPlease confirm this order. Thank you!";

      // Redirect to WhatsApp with the order details
      window.location.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

      // Clear cart and form
      toast({
        title: "Order Sent!",
        description: "Stock updated and opening WhatsApp to complete your order.",
      });
      clearCart();
      setShowCheckoutForm(false);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
    } catch (error) {
      console.error("Error processing order:", error);
      let errorMessage = `${error }`;
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || !navigator.onLine) {
          errorMessage = "Network error. Please check your internet connection and try again.";
        } else if (error.message.includes('Invalid WhatsApp number')) {
          errorMessage = "Invalid WhatsApp number configuration. Please contact support.";
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

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
        {!showCheckoutForm ? (
          <>
            <div className="flex justify-between text-lg font-medium mb-4">
              <span>Total</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
            </p>
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => setShowCheckoutForm(true)}
              disabled={isProcessing}
            >
              Proceed to Checkout
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Delivery Information</h3>
            
            <div>
              <label className="text-xs font-medium mb-1 block">Full Name *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 border rounded text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isProcessing}
              />
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block">Phone Number *</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter your phone (e.g., +234 or 0)"
                className="w-full px-3 py-2 border rounded text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isProcessing}
              />
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block">Delivery Address *</label>
              <textarea
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Enter your delivery address"
                className="w-full px-3 py-2 border rounded text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={2}
                disabled={isProcessing}
              />
            </div>

            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm font-medium mb-4">
                <span>Total</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>

              <Button
                className="w-full mb-2"
                size="sm"
                onClick={handleWhatsAppOrder}
                disabled={isProcessing}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Order via WhatsApp
              </Button>

              <Button
                variant="outline"
                className="w-full"
                size="sm"
                onClick={() => setShowCheckoutForm(false)}
                disabled={isProcessing}
              >
                Back to Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
