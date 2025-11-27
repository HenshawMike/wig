import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { uploadFile, deleteFile } from '@/lib/supabase';
import { FieldValue } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, X, Upload as UploadIcon  } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { addProduct, updateProduct, getProductById, serverTimestamp } from '@/lib/db/products';
import { string } from 'zod';

// Price conversion functions
const toKobo = (naira: number): number => Math.round(naira * 1);
const toNaira = (kobo: number): number => kobo / 1;

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
  createdAt?: Date | string | FieldValue;
  updatedAt?: Date | string | FieldValue;
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
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Clean up object URLs when component unmounts or when image changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (JPEG, PNG, etc.)',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Maximum file size is 5MB',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploading(true);
      console.log('Starting file upload...');
      
      // Upload the file to Supabase
      const uploaded = await uploadFile(file, 'images');
      console.log('File uploaded successfully. URL:', uploaded.url);

      // Set the image URL in the form state and local state
      setImageUrl(uploaded.url);
      setValue('imageUrl', uploaded.url, { shouldValidate: true });
      
      // Also update the image file in the form state
      setValue('imageFile', file, { shouldValidate: true, shouldDirty: true });
      
      // Create a preview URL for the image
      setImagePreview(uploaded.url);
      
      // Log the current form state
      console.log('Form values after upload:', getValues());
      
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async () => {
    try {
      if (imagePreview) {
        console.log('Removing image...');
        
        // If this is an existing image URL (not a data URL), delete it from storage
        if (imagePreview && imagePreview.startsWith('http')) {
          console.log('Deleting file from storage:', imagePreview);
          await deleteFile(imagePreview).catch(error => {
            console.error('Error deleting file:', error);
            // Continue even if deletion fails
          });
        }
        
        // Clear the image preview
        setImagePreview('');
        
        // Reset the form fields
        setValue('imageUrl', '', { shouldValidate: true, shouldDirty: true });
        setValue('imageFile', undefined, { shouldValidate: true, shouldDirty: true });
        
        // Reset the file input
        const fileInput = document.getElementById('image-upload') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        
        console.log('Image removed. Form values:', getValues());
        
        toast({
          title: 'Success',
          description: 'Image removed successfully',
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove image',
        variant: 'destructive',
      });
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
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
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, reset, toast]);

  const onSubmit = async (formData: ProductFormValues) => {
    if (loading) return; // Prevent double submission
    
    setLoading(true);
    
    try {
      // For new products, image is required. For updates, it's optional
      if (!isEdit && !imageUrl) { 
        throw new Error('Product image is required for new products'); 
      }
      
      // Convert price from Naira string to kobo for storage
      const numericPrice = Number(formData.price.replace(/[^0-9.]/g, ''));
      if (isNaN(numericPrice) || numericPrice <= 0) {
        throw new Error('Please enter a valid price');
      }
      
      const priceInKobo = toKobo(numericPrice);
      
      // Prepare product data
      const productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: priceInKobo,
        category: formData.category.trim(),
        stock: Number(formData.stock) || 0,
        featured: Boolean(formData.featured),
        imageUrl: imageUrl || '',
      };

      console.log('Submitting product data:', {
        ...productData,
        price: `₦${(productData.price / 100).toFixed(2)}`
      });

      if (isEdit && id) {
        // Update existing product
        console.log('Updating product with ID:', id);
        
        // Only include fields that have changed
        const updateData: Partial<Product> = {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          category: productData.category,
          stock: productData.stock,
          featured: productData.featured,
          updatedAt: serverTimestamp()
        };
        
        // Only update image if a new one was uploaded
        if (formData.imageFile || imageUrl) {
          updateData.imageUrl = imageUrl || '';
        }
        
        console.log('Update data:', updateData);
        await updateProduct(id, updateData, formData.imageFile);
        
        toast({
          title: 'Success!',
          description: 'Product updated successfully',
          variant: 'default',
        });
      } else {
        // Create new product
        console.log('Creating new product');
        
        if (!formData.imageFile) {
          throw new Error('Product image is required');
        }
        
        const productId = await addProduct(productData, formData.imageFile);
        console.log('New product created with ID:', productId);
        
        toast({
          title: 'Success!',
          description: 'Product created successfully',
          variant: 'default',
        });
      }
      
      // Reset form after successful submission
      reset();
      setImagePreview('');
      
      // Redirect to products list after a short delay
      setTimeout(() => {
        navigate('/admin/products');
      }, 1000);
      
    } catch (error: any) {
      console.error('Error submitting form:', error);
      
      // More specific error messages
      let errorMessage = 'An error occurred while saving the product';
      if (error.code === 'storage/unauthorized') {
        errorMessage = 'You do not have permission to upload files';
      } else if (error.code === 'storage/retry-limit-exceeded') {
        errorMessage = 'File upload failed. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
            <p className="text-sm text-muted-foreground">
              {isEdit ? 'Update the product details below.' : 'Fill in the product details below.'}
            </p>
          </div>

          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="Enter product name"
                {...register('name')}
                error={errors.name?.message}
                disabled={loading}
              />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Enter product description"
                className="min-h-[100px]"
                {...register('description')}
                error={errors.description?.message}
                disabled={loading}
              />
            </div>

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
                    {uploading ? (
                      <div className="flex flex-col items-center space-y-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Uploading...</p>
                      </div>
                    ) : (
                      <>
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
                              accept="image/*" required
                              disabled={uploading || loading}
                            />
                          </Label>
                        </div>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    PNG, JPG, GIF up to 5MB
                  </p>
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
    </div>
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
      {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
