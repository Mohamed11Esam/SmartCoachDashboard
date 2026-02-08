import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, Star, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { PageSpinner } from '../../components/ui/Spinner';
import { getProducts, deleteProduct } from './api';
import type { Product } from '../../types';

export function StoreManagementPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget._id);
      toast.success('Product deleted');
      setDeleteTarget(null);
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Store Management</h1>
          <p className="text-text-secondary text-sm">
            {products.length} products
          </p>
        </div>
        <Button onClick={() => navigate('/store/add')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-muted text-lg">No products yet</p>
          <p className="text-text-muted text-sm mb-4">Add your first product to get started</p>
          <Button onClick={() => navigate('/store/add')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-border-light transition-colors group"
            >
              <div className="aspect-square bg-main relative">
                {product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-text-muted" />
                  </div>
                )}
                <button
                  onClick={() => setDeleteTarget(product)}
                  className="absolute top-2 right-2 p-2 rounded-lg bg-black/50 text-text-secondary hover:text-status-declined opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <Badge>{product.category}</Badge>
                  {product.averageRating > 0 && (
                    <div className="flex items-center gap-1 text-sm text-text-secondary">
                      <Star className="w-3 h-3 text-status-pending fill-status-pending" />
                      {product.averageRating.toFixed(1)}
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-text-primary mt-2 line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-bold text-accent">
                    ${product.salePrice || product.price}
                  </span>
                  {product.salePrice && (
                    <span className="text-sm text-text-muted line-through">
                      ${product.price}
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted mt-2">
                  Stock: {product.stock} | {product.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Product"
      >
        <p className="text-text-secondary mb-6">
          Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be
          undone.
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
