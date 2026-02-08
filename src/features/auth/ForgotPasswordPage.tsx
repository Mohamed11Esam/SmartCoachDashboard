import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { forgotPasswordApi } from './api';
import { useState } from 'react';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordForm = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);
    try {
      await forgotPasswordApi(data);
      setSent(true);
      toast.success('Reset link sent to your email');
    } catch {
      toast.error('Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Link
        to="/login"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to login
      </Link>

      <h1 className="text-2xl font-bold text-text-primary mb-1">Forgot Password</h1>
      <p className="text-text-secondary text-sm mb-6">
        Enter your email and we'll send you a reset link
      </p>

      {sent ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-status-approved/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <p className="text-text-primary font-medium">Check your email</p>
          <p className="text-text-secondary text-sm mt-1">
            We've sent a password reset link to your email address
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="admin@fitglow.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Button type="submit" loading={loading} className="w-full">
            Send Reset Link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
