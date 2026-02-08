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
import { createWorkout } from './api';
import { DIFFICULTY_LEVELS } from '../../config/constants';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  instructions: z.string().min(1, 'Instructions are required'),
  tips: z.string().optional(),
  difficulty: z.string().min(1, 'Difficulty is required'),
  duration: z.coerce.number().min(1, 'Duration is required'),
  calories: z.coerce.number().min(0, 'Must be positive'),
  tags: z.string().optional(),
});

type WorkoutForm = z.output<typeof schema>;

export function AddWorkoutPage() {
  const navigate = useNavigate();
  const { upload, uploading } = useMediaUpload();
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkoutForm>({
    resolver: zodResolver(schema) as Resolver<WorkoutForm>,
  });

  const handleVideoSelected = async (files: File[]) => {
    if (files[0]) {
      const url = await upload(files[0]);
      if (url) setVideoUrl(url);
    }
  };

  const handleThumbnailSelected = async (files: File[]) => {
    if (files[0]) {
      const url = await upload(files[0]);
      if (url) setThumbnailUrl(url);
    }
  };

  const onSubmit = async (data: WorkoutForm) => {
    setSubmitting(true);
    try {
      // Serialize instructions + tips into description field
      let description = `## Instructions\n${data.instructions}`;
      if (data.tips) {
        description += `\n\n## Tips\n${data.tips}`;
      }

      const tags = data.tags
        ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      await createWorkout({
        title: data.title,
        description,
        videoUrl: videoUrl || undefined,
        thumbnailUrl: thumbnailUrl || undefined,
        difficulty: data.difficulty,
        duration: data.duration,
        calories: data.calories,
        tags,
      });
      toast.success('Workout created successfully');
      navigate('/workouts');
    } catch {
      toast.error('Failed to create workout');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate('/workouts')}
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Workouts
      </button>

      <h1 className="text-2xl font-bold text-text-primary mb-6">Add Workout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Workout Details
          </h2>
          <div className="space-y-4">
            <Input
              label="Title"
              placeholder="e.g. Full Body HIIT"
              error={errors.title?.message}
              {...register('title')}
            />
            <div className="grid grid-cols-3 gap-4">
              <Select
                label="Difficulty"
                options={DIFFICULTY_LEVELS.map((d) => ({ value: d, label: d }))}
                error={errors.difficulty?.message}
                {...register('difficulty')}
              />
              <Input
                label="Duration (min)"
                type="number"
                placeholder="30"
                error={errors.duration?.message}
                {...register('duration')}
              />
              <Input
                label="Calories"
                type="number"
                placeholder="350"
                error={errors.calories?.message}
                {...register('calories')}
              />
            </div>
            <TextArea
              label="Instructions"
              placeholder="Step-by-step workout instructions..."
              error={errors.instructions?.message}
              {...register('instructions')}
            />
            <TextArea
              label="Tips"
              placeholder="Optional tips for best results..."
              {...register('tips')}
            />
            <Input
              label="Tags"
              placeholder="HIIT, full-body, cardio (comma separated)"
              {...register('tags')}
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Media
          </h2>
          <div className="space-y-4">
            <FileUpload
              label="Thumbnail Image"
              accept="image/*"
              onFilesSelected={handleThumbnailSelected}
              previews={thumbnailUrl ? [thumbnailUrl] : []}
              onRemovePreview={() => setThumbnailUrl('')}
            />
            <FileUpload
              label="Workout Video (optional)"
              accept="video/*"
              onFilesSelected={handleVideoSelected}
              previews={videoUrl ? [videoUrl] : []}
              onRemovePreview={() => setVideoUrl('')}
            />
          </div>
          {uploading && (
            <p className="text-sm text-accent mt-2">Uploading...</p>
          )}
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/workouts')}
          >
            Cancel
          </Button>
          <Button type="submit" loading={submitting || uploading}>
            Create Workout
          </Button>
        </div>
      </form>
    </div>
  );
}
