import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Edit, Trash2, Loader2, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Product } from '@/types/product';
import { getProducts, deleteProduct } from '@/services/productService';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

type SortField = 'name' | 'price' | 'stock' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { products } = await getProducts({});
      setProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      setDeletingId(id);
      await deleteProduct(id);
      setProducts(products.filter(product => product.id !== id));
      toast({
        title: 'Success',
        description: 'Product deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Get unique categories for filter
  const categories = ['all', ...new Set(products.map(p => p.category))];

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let compareResult = 0;
      
      if (sortField === 'name') {
        compareResult = a.name.localeCompare(b.name);
      } else if (sortField === 'price') {
        compareResult = a.price - b.price;
      } else if (sortField === 'stock') {
        compareResult = a.stock - b.stock;
      } else if (sortField === 'createdAt') {
        const getDate = (date: Date | { toDate: () => Date } | undefined): Date => {
          if (!date) return new Date(0);
          return typeof date === 'object' && 'toDate' in date ? date.toDate() : new Date(date);
        };
        const dateA = getDate(a.createdAt);
        const dateB = getDate(b.createdAt);
        compareResult = dateA.getTime() - dateB.getTime();
      }
      
      return sortOrder === 'asc' ? compareResult : -compareResult;
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown className="ml-1 h-4 w-4 opacity-50" />;
    return sortOrder === 'asc' 
      ? <ChevronUp className="ml-1 h-4 w-4" /> 
      : <ChevronDown className="ml-1 h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory and details</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {categoryFilter !== 'all' && (
              <Badge variant="secondary" className="px-1.5">
                {categoryFilter}
              </Badge>
            )}
          </Button>
          <Button asChild>
            <Link to="/admin/products/new" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-muted/50 p-4 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Filters</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setCategoryFilter('all');
                setSearchQuery('');
              }}
              className="h-8 px-2 text-xs"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear filters
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Image</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-accent/50"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Name
                  <SortIcon field="name" />
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-accent/50"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center">
                  Price
                  <SortIcon field="price" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-accent/50"
                onClick={() => handleSort('stock')}
              >
                <div className="flex items-center">
                  Stock
                  <SortIcon field="stock" />
                </div>
              </TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={product.description || 'No description'}>
                    {product.description || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    ₦{product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-1 text-xs rounded-full font-medium",
                      product.stock > 10 
                        ? "bg-green-100 text-green-800" 
                        : product.stock > 0 
                          ? "bg-amber-100 text-amber-800" 
                          : "bg-red-100 text-red-800"
                    )}>
                      {product.stock} in stock
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {product.featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                      {product.stock === 0 && (
                        <Badge variant="destructive">Out of Stock</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                        className="h-8 w-8 p-0"
                      >
                        <Link to={`/admin/products/edit/${product.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => product.id && setDeletingId(product.id)}
                        disabled={deletingId === product.id}
                      >
                        {deletingId === product.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Search className="h-12 w-12 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="font-medium">No products found</p>
                      <p className="text-sm text-muted-foreground">
                        {searchQuery || categoryFilter !== 'all' 
                          ? 'Try adjusting your search or filter criteria'
                          : 'Get started by adding a new product'}
                      </p>
                    </div>
                    {!searchQuery && categoryFilter === 'all' && (
                      <Button asChild>
                        <Link to="/admin/products/new" className="mt-2">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Product
                        </Link>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!deletingId} 
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (deletingId) {
                  await handleDelete(deletingId);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Helper function for conditional class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
