import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

const ProductCard = ({ id, name, price, image, category, stock }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart, isInCart } = useCart();
  const imgRef = useRef<HTMLImageElement>(null);

  // Handle image load
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete) {
      setImageLoaded(true);
    }
  }, []);

  const handleAddToCart = () => {
    if (stock <= 0) {
      // shouldn't happen because button is disabled, but guard anyway
      toast({ title: 'Out of stock', description: 'This item is currently out of stock.' });
      return;
    }

    addToCart({
      id,
      name,
      price,
      image,
      stock,
    });
  };

  return (
    <Card className="group bg-card border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 rounded-2xl w-full">
      <div className="relative">
        <div className="relative w-full aspect-square overflow-hidden rounded-t-2xl">
          <Link to={`/product/${id}`} className="block h-full">
            <div className="absolute inset-0 flex items-center justify-center p-4 bg-gray-50">
              <div className={`absolute inset-0 bg-gray-100 transition-opacity duration-300 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}></div>
              <img
                ref={imgRef}
                src={image}
                alt={name}
                className={`w-full h-full object-contain transition-all duration-500 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} group-hover:scale-105`}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/placeholder-product.jpg';
                  setImageLoaded(true);
                }}
              />
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full bg-primary/90 backdrop-blur-sm">
              <span className="text-xs text-primary-foreground">{category}</span>
            </div>
          </Link>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-accent transition-all duration-300 hover:scale-110 z-10"
          >
            <Heart
              className={`w-5 h-5 transition-colors duration-300 ${
                isLiked ? "fill-accent text-accent" : "text-foreground"
              }`}
            />
          </button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <Link to={`/product/${id}`} className="hover:underline">
                <h3 className="font-medium text-foreground">{name}</h3>
              </Link>
              <p className="text-sm text-muted-foreground capitalize">{category}</p>
            </div>
            <div className="text-lg font-semibold">
              ${price.toFixed(2)}
            </div>
          </div>
          
          <Button 
            variant="luxury" 
            size="sm" 
            className="w-full mt-2"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={isInCart(id) || stock <= 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isInCart(id) ? 'In Cart' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
