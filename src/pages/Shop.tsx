import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useState, useEffect } from "react";
import { getProducts, getProductCategories } from "@/services/productService";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const fetchedCategories = await getProductCategories();
        setCategories(['All', ...fetchedCategories]);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { products: fetchedProducts } = await getProducts({ 
          limit: 50,
          ...(selectedCategory !== 'All' ? { category: selectedCategory } : {})
        });
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchProducts();
  }, [selectedCategory]);

  // Filter products based on selected category on the client side as a fallback
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20">
        {/* Hero Section */}
        <section className="relative py-24 bg-cover bg-center" style={{ backgroundImage: 'url("/src/assets/logo.jpg")' }}>
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
              {!categoriesLoading ? (
                categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category}
                  </Button>
                ))
              ) : (
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 w-20 bg-gray-200 rounded-md animate-pulse"></div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-destructive">{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            ) : (
              <>
                {/* Mobile horizontal scroll */}
                <div className="md:hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id || ''}
                      name={product.name}
                      price={product.price}
                      image={product.imageUrl}
                      category={product.category}
                      stock={product.stock}
                    />
                  ))}
                  {filteredProducts.length === 0 && !loading && (
                    <div className="col-span-full text-center py-12">
                      <p className="text-lg text-muted-foreground">No products found in this category.</p>
                    </div>
                  )}
                </div>
                </div>
                
                {!loading && !error && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id || ''}
                        name={product.name}
                        price={product.price}
                        image={product.imageUrl}
                        category={product.category}
                        stock={product.stock}
                      />
                    ))}
                    {filteredProducts.length === 0 && (
                      <div className="col-span-full text-center py-12">
                        <p className="text-lg text-muted-foreground">No products found in this category.</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Shop;
