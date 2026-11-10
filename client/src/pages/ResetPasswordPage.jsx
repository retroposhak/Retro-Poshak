import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ArrowRight } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import { authService } from '../services/authService';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const onSubmit = async ({ password }) => {
    try {
      await authService.resetPassword(token, password);
      setDone(true);
      toast.success('Password updated — you are logged in');
      setTimeout(() => navigate('/', { replace: true }), 900);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Reset failed';
      setError('password', { message: msg });
    }
  };

  return (
    <AuthLayout
      eyebrow="NEW PASSWORD"
      headline={
        <>
          A fresh
          <br />
          <em>start.</em>
        </>
      }
      sub="Choose a strong password with at least 8 characters."
    >
      <h1 className="font-serif text-3xl sm:text-4xl text-ink">Reset Password</h1>
      <p className="mt-2 text-sm text-ink-mute">Set a new password for your account.</p>

      {done ? (
        <div className="mt-8 rounded-card border border-green/20 bg-green/5 p-5">
          <p className="text-sm text-green font-medium">✓ Password updated</p>
          <p className="mt-1 text-xs text-ink-mute">Redirecting you home…</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
          <div>
            <label className="mb-1.5 block text-[11px] font-cond uppercase tracking-wide2 text-ink-soft">
              New Password
            </label>
            <input
              type="password"
              autoComplete="new-password"
              className={`input ${errors.password ? 'border-red' : ''}`}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'At least 8 characters' },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-4">
            {isSubmitting ? 'Updating…' : (
              <>
                <span>Update Password</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-ink-mute">
        <Link to="/login" className="text-ink underline-offset-4 hover:text-red hover:underline">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}