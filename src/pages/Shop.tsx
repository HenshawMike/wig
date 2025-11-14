import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Long", "Medium", "Short", "Curly", "Straight"];

  const products = [
    { id: '1', name: "Luxe Midnight Waves", price: 599.99, image: "/placeholder.svg", category: "Long", stock: 12 },
    { id: '2', name: "Royal Silk Bob", price: 449.99, image: "/placeholder.svg", category: "Medium", stock: 8 },
    { id: '3', name: "Crown Curls Deluxe", price: 699.99, image: "/placeholder.svg", category: "Curly", stock: 5 },
    { id: '4', name: "Regal Straight Flow", price: 549.99, image: "/placeholder.svg", category: "Straight", stock: 10 },
    { id: '5', name: "Golden Hour Waves", price: 629.99, image: "/placeholder.svg", category: "Long", stock: 7 },
    { id: '6', name: "Empress Pixie Cut", price: 399.99, image: "/placeholder.svg", category: "Short", stock: 4 },
    { id: '7', name: "Diamond Locs", price: 799.99, image: "/placeholder.svg", category: "Long", stock: 2 },
    { id: '8', name: "Velvet Bounce", price: 479.99, image: "/placeholder.svg", category: "Curly", stock: 9 },
  ];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20">
        {/* Header */}
        <section className="relative py-24 bg-cover bg-center" style={{ backgroundImage: 'url("/src/assets/logo*.jpg")' }}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-4 drop-shadow-lg">
              Shop Our Collection
            </h1>
            <p className="text-xl text-center text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Discover handcrafted luxury wigs designed to crown your confidence, Stay slayed , stay elegant.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "luxury" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Mobile horizontal scroll */}
            <div className="md:hidden">
              <div className="flex overflow-x-auto pb-4 -mx-4 px-4 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-[200px]">
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Shop;
