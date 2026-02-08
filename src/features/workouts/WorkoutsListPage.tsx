import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Dumbbell, Trash2, Clock, Flame } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { PageSpinner } from '../../components/ui/Spinner';
import { getWorkouts, deleteWorkout } from './api';
import type { FreeWorkout } from '../../types';

export function WorkoutsListPage() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<FreeWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<FreeWorkout | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const data = await getWorkouts();
      setWorkouts(data);
    } catch {
      toast.error('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteWorkout(deleteTarget._id);
      toast.success('Workout deleted');
      setDeleteTarget(null);
      fetchWorkouts();
    } catch {
      toast.error('Failed to delete workout');
    } finally {
      setDeleting(false);
    }
  };

  const difficultyColor = (d: string) => {
    switch (d) {
      case 'Beginner': return 'approved';
      case 'Intermediate': return 'pending';
      case 'Advanced': return 'declined';
      default: return 'default';
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Workouts CMS</h1>
          <p className="text-text-secondary text-sm">{workouts.length} workouts</p>
        </div>
        <Button onClick={() => navigate('/workouts/add')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Workout
        </Button>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-20">
          <Dumbbell className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-muted text-lg">No workouts yet</p>
          <p className="text-text-muted text-sm mb-4">Add your first workout to get started</p>
          <Button onClick={() => navigate('/workouts/add')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Workout
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workouts.map((workout) => (
            <div
              key={workout._id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-border-light transition-colors group"
            >
              <div className="aspect-video bg-main relative">
                {workout.videoUrl ? (
                  <video
                    src={workout.videoUrl}
                    className="w-full h-full object-cover"
                    muted
                  />
                ) : workout.thumbnailUrl ? (
                  <img
                    src={workout.thumbnailUrl}
                    alt={workout.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Dumbbell className="w-10 h-10 text-text-muted" />
                  </div>
                )}
                <button
                  onClick={() => setDeleteTarget(workout)}
                  className="absolute top-2 right-2 p-2 rounded-lg bg-black/50 text-text-secondary hover:text-status-declined opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={difficultyColor(workout.difficulty) as 'approved' | 'pending' | 'declined'}>
                    {workout.difficulty}
                  </Badge>
                </div>
                <h3 className="font-medium text-text-primary line-clamp-1">
                  {workout.title}
                </h3>
                <div className="flex items-center gap-3 mt-3 text-xs text-text-secondary">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {workout.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-status-pending" />
                    {workout.calories} cal
                  </span>
                </div>
                {workout.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {workout.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-card-hover rounded text-xs text-text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Workout"
      >
        <p className="text-text-secondary mb-6">
          Are you sure you want to delete "{deleteTarget?.title}"?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
