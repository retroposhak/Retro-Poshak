import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, Mail, Sparkles, KeyRound } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import { authService } from '../services/authService';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// Reusable premium field (identical to Login/Signup for consistency)
function Field({ id, label, type = 'text', icon: Icon, error, register, placeholder, autoComplete }) {
  return (
    <div className="relative group">
      <div className="mb-2 flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1A1715]/45 transition-colors group-focus-within:text-[#b33a3a]"
        >
          {label}
        </label>
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

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ email }) => {
    try {
      await authService.forgotPassword(email);
    } catch {
      /* even errors → generic success (no enumeration) */
    }
    setSent(true);
  };

  return (
    <AuthLayout
      variant="right" // Panel on the right for the "reset" flow (mirrors login)
      eyebrow="RESET PASSWORD"
      headline={<>Let&apos;s get you<br/><em>back inside.</em></>}
      sub="Enter the email you used to sign up. We'll send a secure reset link."
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        {/* Eyebrow badge */}
        <motion.div variants={fadeUp} className="mb-6 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b33a3a]/20 bg-[#b33a3a]/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#b33a3a]">
            <Sparkles size={11} /> Recovery
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="font-serif text-[2.25rem] leading-[1.05] text-[#1A1715] md:text-[2.75rem]"
        >
          Forgot your
          <br />
          <em className="relative inline-block">
            <span className="relative z-10">password?</span>
            <span className="absolute bottom-1.5 left-0 -z-0 h-2.5 w-full bg-[#D9C08A]/50" />
          </em>
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-4 text-sm text-[#1A1715]/55 font-sans">
          We'll email you a link to choose a new password.
        </motion.p>

        {/* Script divider */}
        <motion.div variants={fadeUp} className="mt-6 mb-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#1A1715]/15 to-[#1A1715]/15" />
          <span className="font-script text-sm text-[#1A1715]/35">wapsi ka raasta</span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#1A1715]/15 to-[#1A1715]/15" />
        </motion.div>

        {/* Success / Form Area */}
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-[#2c7a4a]/20 bg-[#2c7a4a]/[0.04] p-6 sm:p-8 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#2c7a4a]/10 mb-4">
                <CheckCircle2 size={28} className="text-[#2c7a4a]" />
              </div>
              <h3 className="font-serif text-xl text-[#2c7a4a]">Check your inbox</h3>
              <p className="mt-2 text-sm text-[#1A1715]/60 leading-relaxed">
                We've sent a secure reset link to your email. It expires in 10 minutes.
              </p>
              <p className="mt-3 text-[11px] text-[#1A1715]/40">
                Didn't get it? Check spam or try again in a few minutes.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              <motion.div variants={fadeUp}>
                <Field
                  id="email"
                  label="Email Address"
                  type="email"
                  icon={Mail}
                  autoComplete="email"
                  placeholder="you@example.com"
                  error={errors.email}
                  register={register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email',
                    },
                  })}
                />
              </motion.div>

              <motion.button
                variants={fadeUp}
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                whileTap={!isSubmitting ? { scale: 0.985 } : {}}
                className="group relative mt-2 flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-[#1A1715] text-[11px] font-bold uppercase tracking-[0.22em] text-[#F7F3EC] transition-colors duration-300 hover:bg-[#b33a3a]"
              >
                {!isSubmitting && (
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                )}

                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending link…
                  </span>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </>
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Footer Link */}
        <motion.p
          variants={fadeUp}
          className="mt-8 text-center text-sm font-sans text-[#1A1715]/55"
        >
          Remembered it?{' '}
          <Link
            to="/login"
            className="font-bold text-[#1A1715] underline-offset-4 transition-colors hover:text-[#b33a3a] hover:underline"
          >
            Back to login
          </Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  );
}