import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/db/products";
import { Product } from "@/lib/db/products";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
      setProducts(productsData);
    });

    return () => unsubscribe();
  }, []);

  const categories = ["All", ...new Set(products.map(p => p.category))];

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
                    <ProductCard {...product} price={product.price / 100} image={product.imageUrl} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} price={product.price / 100} image={product.imageUrl} />
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
