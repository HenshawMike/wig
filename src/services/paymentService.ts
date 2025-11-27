import { CartItem } from '@/contexts/CartContext';

export interface PaymentDetails {
  email: string;
  amount: number;
  reference: string;
  cartItems: CartItem[];
  customerName: string;
  customerPhone: string;
}

export interface PaymentReceipt {
  reference: string;
  amount: number;
  email: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  timestamp: Date;
  status: 'success' | 'failed';
}

export const initializePaystackPayment = (
  email: string,
  amount: number,
  reference: string,
  onSuccess: (response: any) => Promise<void>,
  onClose: () => void
) => {
  const handler = (window as any).PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email,
    amount: amount * 100, // Paystack expects amount in kobo (cents)
    ref: reference,
    onClose: () => {
      onClose();
    },
    callback: (response: any) => {
      // Call the async onSuccess function
      onSuccess(response).catch((error) => {
        console.error('Error in payment callback:', error);
      });
    },
  });

  handler.openIframe();
};

export const generatePaymentReceipt = (paymentDetails: PaymentDetails, status: 'success' | 'failed'): PaymentReceipt => {
  return {
    reference: paymentDetails.reference,
    amount: paymentDetails.amount,
    email: paymentDetails.email,
    customerName: paymentDetails.customerName,
    customerPhone: paymentDetails.customerPhone,
    items: paymentDetails.cartItems,
    timestamp: new Date(),
    status,
  };
};

export const downloadReceipt = (receipt: PaymentReceipt) => {
  const receiptContent = `
PAYMENT RECEIPT
===============================================
Date: ${receipt.timestamp.toLocaleString()}
Reference: ${receipt.reference}
Status: ${receipt.status.toUpperCase()}
===============================================

CUSTOMER INFORMATION
Name: ${receipt.customerName}
Email: ${receipt.email}
Phone: ${receipt.customerPhone}

===============================================
ITEMS PURCHASE
===============================================
${receipt.items.map((item) => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

===============================================
TOTAL AMOUNT: $${receipt.amount.toFixed(2)}
===============================================

Thank you for your purchase!
  `;

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(receiptContent));
  element.setAttribute('download', `receipt-${receipt.reference}.txt`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
