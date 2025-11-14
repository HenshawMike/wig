import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, X, Upload as UploadIcon  } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { addProduct, updateProduct, getProductById, toKobo, toNaira } from '@/lib/db/products';
import { string } from 'zod';

// Define the Product interface
export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  featured: boolean;
  imageUrl: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

interface ProductFormProps {
  isEdit?: boolean;
}

const productFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(Number(val.replace(/[^0-9.]/g, ''))), {
      message: 'Please enter a valid price',
    }),
  category: z.string().min(1, 'Category is required'),
  stock: z.coerce.number().min(0, 'Stock must be a positive number'),
  featured: z.boolean().default(false),
  imageFile: z.instanceof(File).optional(),
  imageUrl: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  isEdit?: boolean;
}

export function ProductForm({ isEdit = false }: ProductFormProps) {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Set the file in the form
      setValue('imageFile', file);
      
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Clean up the object URL when component unmounts
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const removeImage = () => {
    // Clear the image preview and reset the file input
    setImagePreview('');
    setValue('imageFile', undefined);
    // Reset the file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      category: '',
      stock: 0,
      featured: false,
      imageUrl: '',
      imageFile: undefined,
    },
  });

  // Fetch product data if in edit mode
  useEffect(() => {
    if (!isEdit || !id) return;
    
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const product = await getProductById(id);
        if (product) {
          // Convert price from kobo to Naira for display
          const priceInNaira = toNaira(product.price);
          
          // Set form values
          reset({
            ...product,
            price: priceInNaira.toString(),
          });
          
          // Set image preview if imageUrl exists
          if (product.imageUrl) {
            setImagePreview(product.imageUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: 'Error',
          description: 'Failed to load product data',
          variant: 'destructive',
        });
      }
    };

    fetchProduct();
  }, [id, reset]);

  const onSubmit = async (formData: ProductFormValues) => {
    try {
      setLoading(true);
      
      // Convert price from Naira string to kobo for storage
      const numericPrice = Number(formData.price.replace(/[^0-9.]/g, ''));
      const priceInKobo = toKobo(numericPrice);
      
      const productData = {
        name: formData.name,
        description: formData.description,
        price: priceInKobo, // Store price in kobo
        category: formData.category,
        stock: formData.stock,
        featured: formData.featured,
        imageUrl: formData.imageUrl || '',
      };

      if (isEdit && id) {
        await updateProduct(id, productData, formData.imageFile);
        toast({
          title: 'Success!',
          description: 'Product updated successfully',
          variant: 'default',
        });
      } else {
        await addProduct(productData, formData.imageFile);
        toast({
          title: 'Success!',
          description: 'Product created successfully',
          variant: 'default',
        });
      }
      
      navigate('/admin/products');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while saving the product',
      });
      setLoading(false);
    }
  };

  return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
            <p className="text-sm text-muted-foreground">
              {isEdit ? 'Update the product details below.' : 'Fill in the product details below.'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₦) *</Label>
                <div className="relative">
                  <Input
                    id="price"
                    className="pl-10"
                    {...register('price', {
                      onChange: (e) => {
                        // Format the input as currency while typing
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        const number = parseFloat(value) || 0;
                        e.target.value = number.toLocaleString('en-NG');
                      },
                    })}
                    placeholder="0.00"
                    disabled={loading}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                </div>
                {errors.price && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.price.message?.toString()}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  {...register('stock')}
                  error={errors.stock?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  placeholder="e.g., Wigs, Extensions"
                  {...register('category')}
                  error={errors.category?.message}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                onCheckedChange={(checked) => setValue('featured', Boolean(checked))}
                checked={watch('featured')}
              />
              <Label htmlFor="featured" className="text-sm font-medium leading-none">
                Featured Product
              </Label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Product Image</Label>
              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-md border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center h-64">
                  <div className="text-center space-y-2">
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto" />
                    <div className="text-sm text-muted-foreground">
                      <Label
                        htmlFor="image-upload"
                        className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90"
                      >
                        <span>Upload an image</span>
                        <Input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              )}
              {errors.imageFile && (
                <p className="text-sm text-destructive">{errors.imageFile.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/products')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
  );
}

// Add the Upload icon component
function Upload(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
