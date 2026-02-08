import { useEffect, useState } from 'react';
import { Check, X, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { PageSpinner } from '../../components/ui/Spinner';
import { useUIStore } from '../../stores/uiStore';
import { getCoachProfiles, verifyCoach } from './api';
import type { CoachProfile, User } from '../../types';

const ITEMS_PER_PAGE = 10;

export function CoachVerificationPage() {
  const [coaches, setCoaches] = useState<CoachProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified'>('all');
  const [confirmModal, setConfirmModal] = useState<{
    coach: CoachProfile;
    action: 'approve' | 'reject';
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const setPendingCoachCount = useUIStore((s) => s.setPendingCoachCount);

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      const data = await getCoachProfiles();
      setCoaches(data);
      setPendingCoachCount(data.filter((c) => !c.isVerified).length);
    } catch {
      toast.error('Failed to load coaches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  const filteredCoaches = coaches.filter((c) => {
    if (filter === 'pending') return !c.isVerified;
    if (filter === 'verified') return c.isVerified;
    return true;
  });

  const totalPages = Math.ceil(filteredCoaches.length / ITEMS_PER_PAGE);
  const paginatedCoaches = filteredCoaches.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleAction = async () => {
    if (!confirmModal) return;
    setActionLoading(true);
    try {
      const isVerified = confirmModal.action === 'approve';
      await verifyCoach(confirmModal.coach._id, isVerified);
      toast.success(
        `Coach ${isVerified ? 'approved' : 'rejected'} successfully`
      );
      setConfirmModal(null);
      fetchCoaches();
    } catch {
      toast.error('Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const getUserName = (coach: CoachProfile) => {
    if (typeof coach.userId === 'object') {
      const u = coach.userId as User;
      return `${u.firstName} ${u.lastName}`;
    }
    return coach.userId;
  };

  const columns = [
    {
      key: 'name',
      header: 'Coach',
      render: (c: CoachProfile) => (
        <div>
          <p className="font-medium">{getUserName(c)}</p>
          <p className="text-xs text-text-muted">{c.specialties.join(', ')}</p>
        </div>
      ),
    },
    {
      key: 'experience',
      header: 'Experience',
      render: (c: CoachProfile) => `${c.experienceYears} years`,
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (c: CoachProfile) => (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-status-pending fill-status-pending" />
          <span>{c.averageRating.toFixed(1)}</span>
        </div>
      ),
    },
    {
      key: 'certifications',
      header: 'Certifications',
      render: (c: CoachProfile) => (
        <span className="text-text-secondary">{c.certifications.length} certs</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (c: CoachProfile) => (
        <Badge variant={c.isVerified ? 'approved' : 'pending'}>
          {c.isVerified ? 'Verified' : 'Pending'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (c: CoachProfile) =>
        !c.isVerified ? (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={() => setConfirmModal({ coach: c, action: 'approve' })}
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => setConfirmModal({ coach: c, action: 'reject' })}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <span className="text-text-muted text-sm">-</span>
        ),
    },
  ];

  if (loading) return <PageSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Coach Verification</h1>
          <p className="text-text-secondary text-sm">
            Review and verify coach profiles
          </p>
        </div>
        <div className="flex bg-card border border-border rounded-lg p-1">
          {(['all', 'pending', 'verified'] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-accent text-black'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredCoaches.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-text-muted text-lg">No coaches found</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border">
          <Table
            columns={columns}
            data={paginatedCoaches}
            keyExtractor={(c) => c._id}
          />
          <div className="px-4 pb-4">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <Modal
        isOpen={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        title={
          confirmModal?.action === 'approve'
            ? 'Approve Coach'
            : 'Reject Coach'
        }
      >
        <p className="text-text-secondary mb-6">
          Are you sure you want to{' '}
          {confirmModal?.action === 'approve' ? 'approve' : 'reject'} this coach?
          {confirmModal?.action === 'reject' &&
            ' This will mark them as unverified.'}
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setConfirmModal(null)}>
            Cancel
          </Button>
          <Button
            variant={confirmModal?.action === 'approve' ? 'primary' : 'danger'}
            loading={actionLoading}
            onClick={handleAction}
          >
            {confirmModal?.action === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
