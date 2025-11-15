import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getProductById } from '@/services/productService';
import { Product } from '@/lib/db/products';
import { formatPrice } from '@/lib/db/products';
import { useCart } from '@/contexts/CartContext';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const productData = await getProductById(id);
        if (productData) {
          setProduct(productData);
        } else {
          navigate('/shop');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: 'Error',
          description: 'Failed to load product details',
          variant: 'destructive',
        });
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate, toast]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id!,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      stock: product.stock,
    });
    
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-8 flex-grow mt-16">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            ← Back to products
          </Button>
          <div className="grid md:grid-cols-2 gap-8 animate-pulse">
            {/* Image placeholder */}
            <div className="bg-gray-100 rounded-lg aspect-square"></div>
            {/* Content placeholder */}
            <div className="space-y-6">
              <div className="h-8 bg-gray-100 rounded w-3/4"></div>
              <div className="h-6 bg-gray-100 rounded w-1/4"></div>
              <div className="space-y-2 pt-4">
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                <div className="h-4 bg-gray-100 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Button onClick={() => navigate('/shop')} className="mt-4">
          Back to Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="container mx-auto px-4 py-8 flex-grow mt-20">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        ← Back to products
      </Button>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-white rounded-lg overflow-hidden shadow-lg aspect-square">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-semibold text-primary mt-2">
              {formatPrice(product.price)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </p>
          </div>
          
          <div className="border-t border-b py-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground">
              {product.description || 'No description available.'}
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Category:</span>
              <span className="text-muted-foreground capitalize">{product.category}</span>
            </div>
            
            <Button 
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-full md:w-auto"
              size="lg"
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            
            {product.stock <= 0 && (
              <p className="text-sm text-destructive">
                This product is currently out of stock.
              </p>
            )}
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
