import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, CheckCircle2, User, Mail, Phone, Lock, Eye, EyeOff, Sparkles,
} from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import { useAuth } from '../context/AuthContext';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function Field({ id, label, type = 'text', icon: Icon, error, register, placeholder, autoComplete, optional, trailing }) {
  return (
    <div className="group relative">
      <div className="mb-2 flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1A1715]/45 transition-colors group-focus-within:text-[#b33a3a]"
        >
          {label}
          {optional && (
            <span className="ml-1.5 font-normal normal-case tracking-normal text-[#1A1715]/30">
              (optional)
            </span>
          )}
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

function StrengthMeter({ password = '' }) {
  const score = useMemo(() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  }, [password]);

  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['#b33a3a', '#b33a3a', '#c98a3a', '#7a8a3a', '#2c7a4a'];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="h-1 flex-1 rounded-full transition-colors duration-300"
            style={{ background: i < score ? colors[score] : 'rgba(26,23,21,0.1)' }}
          />
        ))}
      </div>
      <p
        className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.15em] transition-colors"
        style={{ color: colors[score] }}
      >
        {labels[score]}
      </p>
    </div>
  );
}

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, setError } = useForm();
  const password = watch('password', '');

  const onSubmit = async (data) => {
    try {
      await signup(data);
      setSuccess(true);
      toast.success('Account created — welcome to Retro Poshak!');
      setTimeout(() => navigate('/', { replace: true }), 900);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Signup failed';
      setError('email', { message: msg });
    }
  };

  return (
    // variant="left" puts the dark panel on the left
    <AuthLayout
      variant="left"
      eyebrow="JOIN THE STORY"
      headline={<>Pehno<br /><em>yaaden.</em></>}
      sub="Create your account and start collecting memories."
      photos={[
        'assets/images/shopbystory/golawalekigali.jpeg',
        'assets/images/shopbystory/galicricket.jpeg',
        'assets/images/shopbystory/readysetbachpan.jpeg',
      ]}
      footLabel="Since 2026 · Wear your nostalgia"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
      >
        <motion.div variants={fadeUp} className="mb-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b33a3a]/20 bg-[#b33a3a]/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#b33a3a]">
            <Sparkles size={11} /> New here
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="font-serif text-[2.25rem] leading-[1.05] text-[#1A1715] md:text-[2.75rem]"
        >
          Create your
          <br />
          <em className="relative inline-block">
            <span className="relative z-10">account</span>
            <span className="absolute bottom-1.5 left-0 -z-0 h-2.5 w-full bg-[#D9C08A]/50" />
          </em>
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-3 text-sm text-[#1A1715]/55 font-sans">
          A few details and you're in. No spam, ever.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-5 mb-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#1A1715]/15 to-[#1A1715]/15" />
          <span className="font-script text-sm text-[#1A1715]/35">shuruaat yahan se</span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#1A1715]/15 to-[#1A1715]/15" />
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <motion.div variants={fadeUp}>
            <Field
              id="name"
              label="Full name"
              icon={User}
              autoComplete="name"
              placeholder="Aarav Sharma"
              error={errors.name}
              register={register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'At least 2 characters' },
              })}
            />
          </motion.div>

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
              id="phone"
              label="Phone"
              optional
              type="tel"
              icon={Phone}
              autoComplete="tel"
              placeholder="+91 98765 43210"
              error={errors.phone}
              register={register('phone')}
            />
          </motion.div>

          <motion.div variants={fadeUp}>
            <Field
              id="password"
              label="Password"
              type={showPass ? 'text' : 'password'}
              icon={Lock}
              autoComplete="new-password"
              placeholder="••••••••"
              error={errors.password}
              register={register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'At least 8 characters' },
              })}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#1A1715]/40 transition-colors hover:text-[#b33a3a]"
                >
                  {showPass ? <EyeOff size={12} /> : <Eye size={12} />}
                  {showPass ? 'Hide' : 'Show'}
                </button>
              }
            />
            <StrengthMeter password={password} />
          </motion.div>

          <motion.p variants={fadeUp} className="text-[11px] leading-relaxed text-[#1A1715]/40">
            By creating an account you agree to our{' '}
            <Link to="/terms" className="underline underline-offset-2 hover:text-[#b33a3a]">Terms</Link>{' '}
            &{' '}
            <Link to="/privacy" className="underline underline-offset-2 hover:text-[#b33a3a]">Privacy Policy</Link>.
          </motion.p>

          <motion.button
            variants={fadeUp}
            type="submit"
            disabled={isSubmitting || success}
            whileHover={!isSubmitting && !success ? { scale: 1.01 } : {}}
            whileTap={!isSubmitting && !success ? { scale: 0.985 } : {}}
            className={`group relative mt-2 flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-full text-[11px] font-bold uppercase tracking-[0.22em] transition-colors duration-300 ${
              success ? 'bg-[#2c7a4a] text-[#F7F3EC]' : 'bg-[#1A1715] text-[#F7F3EC] hover:bg-[#b33a3a]'
            }`}
          >
            {!success && !isSubmitting && (
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            )}

            {success ? (
              <><CheckCircle2 size={18} /> Account created</>
            ) : isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Creating account…
              </span>
            ) : (
              <>
                Create account
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </motion.button>
        </form>

        <motion.p variants={fadeUp} className="mt-6 text-center text-sm font-sans text-[#1A1715]/55">
          Already a member?{' '}
          <Link to="/login" className="font-bold text-[#1A1715] underline-offset-4 transition-colors hover:text-[#b33a3a] hover:underline">
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  );
}