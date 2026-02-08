import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, UtensilsCrossed, Trash2, Flame } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { PageSpinner } from '../../components/ui/Spinner';
import { getMeals, deleteMeal } from './api';
import type { FreeNutrition } from '../../types';

export function MealsListPage() {
  const navigate = useNavigate();
  const [meals, setMeals] = useState<FreeNutrition[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<FreeNutrition | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const data = await getMeals();
      setMeals(data);
    } catch {
      toast.error('Failed to load meals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMeal(deleteTarget._id);
      toast.success('Meal deleted');
      setDeleteTarget(null);
      fetchMeals();
    } catch {
      toast.error('Failed to delete meal');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Meals CMS</h1>
          <p className="text-text-secondary text-sm">{meals.length} meals</p>
        </div>
        <Button onClick={() => navigate('/meals/add')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Meal
        </Button>
      </div>

      {meals.length === 0 ? (
        <div className="text-center py-20">
          <UtensilsCrossed className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-muted text-lg">No meals yet</p>
          <p className="text-text-muted text-sm mb-4">Add your first meal to get started</p>
          <Button onClick={() => navigate('/meals/add')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Meal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meals.map((meal) => (
            <div
              key={meal._id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-border-light transition-colors group"
            >
              <div className="aspect-video bg-main relative">
                {meal.imageUrl ? (
                  <img
                    src={meal.imageUrl}
                    alt={meal.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UtensilsCrossed className="w-10 h-10 text-text-muted" />
                  </div>
                )}
                <button
                  onClick={() => setDeleteTarget(meal)}
                  className="absolute top-2 right-2 p-2 rounded-lg bg-black/50 text-text-secondary hover:text-status-declined opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-text-primary line-clamp-1">
                  {meal.title}
                </h3>
                <div className="flex items-center gap-3 mt-3 text-xs text-text-secondary">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-status-pending" />
                    {meal.calories} cal
                  </span>
                  <span>P: {meal.protein}g</span>
                  <span>C: {meal.carbs}g</span>
                  <span>F: {meal.fats}g</span>
                </div>
                {meal.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {meal.tags.slice(0, 3).map((tag) => (
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
        title="Delete Meal"
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
