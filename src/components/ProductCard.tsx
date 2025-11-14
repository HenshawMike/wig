import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/components/ui/use-toast";

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
  const { addToCart, isInCart } = useCart();

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
    });
  };

  return (
    <Card className="group bg-card border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 rounded-2xl w-full">
      <div className="relative w-full aspect-square overflow-hidden rounded-t-2xl">
        <div className="absolute inset-0 flex items-center justify-center p-4 bg-gray-50">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-accent transition-all duration-300 hover:scale-110"
        >
          <Heart
            className={`w-5 h-5 transition-colors duration-300 ${
              isLiked ? "fill-accent text-accent" : "text-foreground"
            }`}
          />
        </button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full bg-primary/90 backdrop-blur-sm">
          <span className="text-xs text-primary-foreground">{category}</span>
        </div>
      </div>
      <CardContent className="p-4 text-center">
        <h3 className="font-semibold text-sm sm:text-base text-foreground mb-2 line-clamp-2">{name}</h3>
        <p className="text-xl font-bold text-accent mb-4">${price.toFixed(2)}</p>
        {/* Stock display */}
        {stock > 0 ? (
          <p className="text-sm font-medium text-green-600 mb-3">In stock: {stock}</p>
        ) : (
          <p className="text-sm font-medium text-destructive mb-3">Out of stock</p>
        )}
        <Button 
          variant="luxury" 
          size="sm" 
          className="w-full"
          onClick={handleAddToCart}
          disabled={isInCart(id) || stock <= 0}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isInCart(id) ? 'In Cart' : 'Add to Cart'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
