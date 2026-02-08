import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import { useAuth } from '../../hooks/useAuth';
import { loginApi } from './api';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await loginApi({ email: data.email, password: data.password });
      if (res.user.role !== 'Admin') {
        toast.error('Access denied. Admin only.');
        return;
      }
      setAuth(res.access_token, res.refresh_token, res.user);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Welcome Back</h1>
      <p className="text-text-secondary text-sm mb-6">
        Sign in to your admin dashboard
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="admin@fitglow.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between">
          <Checkbox label="Remember me" {...register('remember')} />
          <Link
            to="/forgot-password"
            className="text-sm text-accent hover:text-accent-hover transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Sign In
        </Button>
      </form>
    </AuthLayout>
  );
}
