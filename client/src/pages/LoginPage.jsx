import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import { useAuth } from '../context/AuthContext';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function Field({ id, label, type = 'text', icon: Icon, error, register, placeholder, autoComplete, trailing }) {
  return (
    <div className="relative group">
      <div className="mb-2 flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1A1715]/45 transition-colors group-focus-within:text-[#b33a3a]"
        >
          {label}
        </label>
        {trailing}
      </div>

      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1715]/35 transition-colors group-focus-within:text-[#b33a3a]"
          />
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...register}
          className={`w-full rounded-xl border bg-[#FDFBF6]/80 px-4 py-3.5 ${
            Icon ? 'pl-11' : ''
          } text-sm font-medium text-[#1A1715] outline-none transition-all duration-300 placeholder:text-[#1A1715]/25 ${
            error
              ? 'border-[#b33a3a]/60 bg-[#b33a3a]/[0.04] shadow-[0_0_0_3px_rgba(179,58,58,0.08)]'
              : 'border-[#1A1715]/10 hover:border-[#1A1715]/20 focus:border-[#b33a3a]/60 focus:bg-white focus:shadow-[0_0_0_4px_rgba(179,58,58,0.08)]'
          }`}
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1.5 text-[11px] font-medium text-[#b33a3a]"
          >
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/';

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const onSubmit = async ({ email, password }) => {
    try {
      const u = await login(email, password);
      setSuccess(true);
      toast.success(`Welcome back, ${u.name.split(' ')[0]}!`);
      setTimeout(() => navigate(redirect, { replace: true }), 900);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed';
      setError('password', { message: msg });
    }
  };

  return (
    // variant="right" puts the dark panel on the right
    <AuthLayout variant="right">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        <motion.div variants={fadeUp} className="mb-6 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b33a3a]/20 bg-[#b33a3a]/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#b33a3a]">
            <Sparkles size={11} /> Welcome back
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="font-serif text-[2.75rem] leading-[1.05] text-[#1A1715] md:text-5xl"
        >
          Login to your
          <br />
          <em className="relative inline-block">
            <span className="relative z-10">yaaden</span>
            <span className="absolute bottom-1.5 left-0 h-2.5 w-full bg-[#D9C08A]/50 -z-0" />
          </em>
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-4 text-sm text-[#1A1715]/55 font-sans">
          Enter your details to continue your journey.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-7 mb-7 flex items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#1A1715]/15 to-[#1A1715]/15" />
          <span className="font-script text-sm text-[#1A1715]/35">yaadon ka safar</span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#1A1715]/15 to-[#1A1715]/15" />
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <motion.div variants={fadeUp}>
            <Field
              id="email"
              label="Email"
              type="email"
              icon={Mail}
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email}
              register={register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
              })}
            />
          </motion.div>

          <motion.div variants={fadeUp}>
            <Field
              id="password"
              label="Password"
              type={showPass ? 'text' : 'password'}
              icon={Lock}
              autoComplete="current-password"
              placeholder="••••••••"
              error={errors.password}
              register={register('password', { required: 'Password is required' })}
              trailing={
                <Link
                  to="/forgot-password"
                  className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1715]/40 transition-colors hover:text-[#b33a3a]"
                >
                  Forgot?
                </Link>
              }
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="mt-2 ml-1 inline-flex items-center gap-1.5 text-[11px] text-[#1A1715]/40 transition-colors hover:text-[#1A1715]/70"
            >
              {showPass ? <EyeOff size={12} /> : <Eye size={12} />}
              {showPass ? 'Hide password' : 'Show password'}
            </button>
          </motion.div>

          <motion.button
            variants={fadeUp}
            type="submit"
            disabled={isSubmitting || success}
            whileHover={!isSubmitting && !success ? { scale: 1.01 } : {}}
            whileTap={!isSubmitting && !success ? { scale: 0.985 } : {}}
            className={`group relative mt-4 flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-full text-[11px] font-bold uppercase tracking-[0.22em] transition-colors duration-300 ${
              success ? 'bg-[#2c7a4a] text-[#F7F3EC]' : 'bg-[#1A1715] text-[#F7F3EC] hover:bg-[#b33a3a]'
            }`}
          >
            {!success && !isSubmitting && (
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            )}

            {success ? (
              <><CheckCircle2 size={18} /> Welcome back</>
            ) : isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Signing in…
              </span>
            ) : (
              <>
                Login
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </motion.button>
        </form>

        <motion.p variants={fadeUp} className="mt-8 text-center text-sm font-sans text-[#1A1715]/55">
          New here?{' '}
          <Link to="/signup" className="font-bold text-[#1A1715] underline-offset-4 transition-colors hover:text-[#b33a3a] hover:underline">
            Create an account
          </Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  );
}