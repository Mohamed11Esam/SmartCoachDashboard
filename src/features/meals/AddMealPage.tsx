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
import { Button } from '../../components/ui/Button';
import { FileUpload } from '../../components/ui/FileUpload';
import { Card } from '../../components/ui/Card';
import { useMediaUpload } from '../../hooks/useMediaUpload';
import { createMeal } from './api';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  ingredients: z.string().min(1, 'Ingredients are required'),
  instructions: z.string().min(1, 'Instructions are required'),
  calories: z.coerce.number().min(0, 'Must be positive'),
  protein: z.coerce.number().min(0, 'Must be positive'),
  carbs: z.coerce.number().min(0, 'Must be positive'),
  fats: z.coerce.number().min(0, 'Must be positive'),
  tags: z.string().optional(),
});

type MealForm = z.output<typeof schema>;

export function AddMealPage() {
  const navigate = useNavigate();
  const { upload, uploading } = useMediaUpload();
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MealForm>({
    resolver: zodResolver(schema) as Resolver<MealForm>,
  });

  const handleFileSelected = async (files: File[]) => {
    if (files[0]) {
      const url = await upload(files[0]);
      if (url) setImageUrl(url);
    }
  };

  const onSubmit = async (data: MealForm) => {
    setSubmitting(true);
    try {
      // Serialize ingredients + instructions into content field
      const content = `## Ingredients\n${data.ingredients}\n\n## Instructions\n${data.instructions}`;
      const tags = data.tags
        ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      await createMeal({
        title: data.title,
        content,
        imageUrl: imageUrl || undefined,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fats: data.fats,
        tags,
      });
      toast.success('Meal created successfully');
      navigate('/meals');
    } catch {
      toast.error('Failed to create meal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate('/meals')}
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Meals
      </button>

      <h1 className="text-2xl font-bold text-text-primary mb-6">Add Meal</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Meal Details
          </h2>
          <div className="space-y-4">
            <Input
              label="Title"
              placeholder="e.g. Grilled Chicken Salad"
              error={errors.title?.message}
              {...register('title')}
            />
            <TextArea
              label="Ingredients"
              placeholder="List ingredients, one per line..."
              error={errors.ingredients?.message}
              {...register('ingredients')}
            />
            <TextArea
              label="Instructions"
              placeholder="Step-by-step cooking instructions..."
              error={errors.instructions?.message}
              {...register('instructions')}
            />
            <Input
              label="Tags"
              placeholder="high-protein, low-carb, vegan (comma separated)"
              {...register('tags')}
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Nutrition Info
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Calories"
              type="number"
              placeholder="450"
              error={errors.calories?.message}
              {...register('calories')}
            />
            <Input
              label="Protein (g)"
              type="number"
              placeholder="35"
              error={errors.protein?.message}
              {...register('protein')}
            />
            <Input
              label="Carbs (g)"
              type="number"
              placeholder="40"
              error={errors.carbs?.message}
              {...register('carbs')}
            />
            <Input
              label="Fats (g)"
              type="number"
              placeholder="15"
              error={errors.fats?.message}
              {...register('fats')}
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Media</h2>
          <FileUpload
            label="Meal Image"
            accept="image/*"
            onFilesSelected={handleFileSelected}
            previews={imageUrl ? [imageUrl] : []}
            onRemovePreview={() => setImageUrl('')}
          />
          {uploading && (
            <p className="text-sm text-accent mt-2">Uploading...</p>
          )}
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/meals')}
          >
            Cancel
          </Button>
          <Button type="submit" loading={submitting || uploading}>
            Create Meal
          </Button>
        </div>
      </form>
    </div>
  );
}
