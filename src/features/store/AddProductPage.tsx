import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Resolver } from 'react-hook-form';
import { Input } from '../../components/ui/Input';
import { TextArea } from '../../components/ui/TextArea';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { FileUpload } from '../../components/ui/FileUpload';
import { Card } from '../../components/ui/Card';
import { useMediaUpload } from '../../hooks/useMediaUpload';
import { createProduct } from './api';
import { PRODUCT_CATEGORIES } from '../../config/constants';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  salePrice: z.coerce.number().min(0).optional().or(z.literal('')),
  category: z.string().min(1, 'Category is required'),
  stock: z.coerce.number().min(0, 'Stock must be positive').optional(),
  sku: z.string().optional(),
});

type ProductForm = z.output<typeof schema>;

export function AddProductPage() {
  const navigate = useNavigate();
  const { uploadMany, uploading } = useMediaUpload();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(schema) as Resolver<ProductForm>,
    defaultValues: { stock: 0 },
  });

  const handleFilesSelected = async (files: File[]) => {
    const urls = await uploadMany(files);
    setImageUrls((prev) => [...prev, ...urls]);
  };

  const onSubmit = async (data: ProductForm) => {
    setSubmitting(true);
    try {
      await createProduct({
        name: data.name,
        description: data.description,
        price: data.price,
        salePrice: data.salePrice ? Number(data.salePrice) : undefined,
        category: data.category,
        stock: data.stock,
        sku: data.sku || undefined,
        images: imageUrls,
      });
      toast.success('Product created successfully');
      navigate('/store');
    } catch {
      toast.error('Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate('/store')}
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Store
      </button>

      <h1 className="text-2xl font-bold text-text-primary mb-6">Add Product</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* General Info */}
        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            General Information
          </h2>
          <div className="space-y-4">
            <Input
              label="Product Name"
              placeholder="e.g. Whey Protein Powder"
              error={errors.name?.message}
              {...register('name')}
            />
            <TextArea
              label="Description"
              placeholder="Describe the product..."
              error={errors.description?.message}
              {...register('description')}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price ($)"
                type="number"
                step="0.01"
                placeholder="29.99"
                error={errors.price?.message}
                {...register('price')}
              />
              <Input
                label="Sale Price ($)"
                type="number"
                step="0.01"
                placeholder="Optional"
                error={errors.salePrice?.message}
                {...register('salePrice')}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Category"
                options={PRODUCT_CATEGORIES.map((c) => ({
                  value: c,
                  label: c.charAt(0).toUpperCase() + c.slice(1),
                }))}
                error={errors.category?.message}
                {...register('category')}
              />
              <Input
                label="Stock"
                type="number"
                placeholder="0"
                error={errors.stock?.message}
                {...register('stock')}
              />
            </div>
            <Input
              label="SKU"
              placeholder="Optional SKU code"
              error={errors.sku?.message}
              {...register('sku')}
            />
          </div>
        </Card>

        {/* Media */}
        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Media</h2>
          <FileUpload
            label="Product Images"
            accept="image/*"
            multiple
            onFilesSelected={handleFilesSelected}
            previews={imageUrls}
            onRemovePreview={(i) =>
              setImageUrls((prev) => prev.filter((_, idx) => idx !== i))
            }
          />
          {uploading && (
            <p className="text-sm text-accent mt-2">Uploading...</p>
          )}
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/store')}
          >
            Cancel
          </Button>
          <Button type="submit" loading={submitting || uploading}>
            Create Product
          </Button>
        </div>
      </form>
    </div>
  );
}
