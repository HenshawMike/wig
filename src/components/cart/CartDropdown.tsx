import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Cart } from "./Cart";
import { Badge } from "@/components/ui/badge";

export function CartDropdown() {
  const { totalItems } = useCart();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-[calc(100vw-2.5rem)] sm:w-[25rem] max-w-[calc(100vw-2.5rem)] p-0 mx-auto shadow-xl rounded-lg border" 
        align="center"
        sideOffset={15}
        side="bottom"
      >
        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
          <Cart />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
