import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle, Package, Lightbulb, Heart } from 'lucide-react';
import { contactService } from '../services/contactService';

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await contactService.submit(data);
      toast.success('Message sent — we’ll reply soon');
      reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not send message');
    }
  };

  return (
    <main className="bg-[#F7F3EC] min-h-screen relative overflow-hidden font-sans">
      
      {/* Subtle Grain Overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-40 mix-blend-multiply" 
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }} 
      />

      {/* ═══════════ MAIN CONTENT (3 Columns) ═══════════ */}
      <section className="relative z-10 max-w-[1600px] mx-auto flex flex-col lg:flex-row min-h-[85vh]">
        
        {/* ── LEFT COLUMN: Text Info ── */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-[30%] flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-16"
        >
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#b33a3a] block mb-4">
            Let's Talk
          </span>
          <h1 className="font-serif text-6xl md:text-7xl text-[#1A1715] leading-[1.05]">
            Contact Us<span className="text-[#b33a3a]">.</span>
          </h1>
          <p className="font-script text-4xl text-[#1A1715] mt-4 mb-8 rotate-[-2deg]">
            We're just a message away.
          </p>
          <p className="text-[#1A1715]/70 leading-relaxed text-[15px] max-w-sm mb-12">
            Have a question, suggestion or just want to share your childhood memories with us? We'd love to hear from you.
          </p>

          <div className="space-y-8">
            <a href="mailto:retroposhak2026@gmail.com" className="flex items-start gap-4 group">
              <div className="h-12 w-12 rounded-full bg-[#b33a3a] text-[#F7F3EC] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md">
                <Mail size={20} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-[#1A1715] text-base group-hover:text-[#b33a3a] transition-colors">Email Us</p>
                <p className="text-[#1A1715]/80 text-sm mt-0.5">retroposhak2026@gmail.com</p>
                <p className="text-[#1A1715]/50 text-xs mt-1">We usually respond within 24 hours.</p>
              </div>
            </a>

            <a href="tel:+919220722844" className="flex items-start gap-4 group">
              <div className="h-12 w-12 rounded-full bg-[#b33a3a] text-[#F7F3EC] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md">
                <Phone size={20} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-[#1A1715] text-base group-hover:text-[#b33a3a] transition-colors">Call Us</p>
                <p className="text-[#1A1715]/80 text-sm mt-0.5">+91 92207 22844</p>
                <p className="text-[#1A1715]/50 text-xs mt-1">Mon – Sat, 10 AM to 7 PM</p>
              </div>
            </a>

            <div className="flex items-start gap-4 group">
              <div className="h-12 w-12 rounded-full bg-[#b33a3a] text-[#F7F3EC] flex items-center justify-center shrink-0 shadow-md">
                <MapPin size={20} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-[#1A1715] text-base">Our Location</p>
                <p className="text-[#1A1715]/80 text-sm mt-0.5">Noida, Delhi NCR, India</p>
                <p className="text-[#1A1715]/50 text-xs mt-1">Visit us by appointment.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── CENTER COLUMN: The Taped Paper Form ── */}
        <div className="w-full lg:w-[40%] relative flex items-center justify-center py-16 px-4 sm:px-8">
          
          {/* Form Container with 3D rotation effect */}
          <motion.div 
            initial={{ opacity: 0, y: 50, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: -1.5 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
            className="relative w-full max-w-[460px] bg-[#FCFAF5] shadow-[0_30px_60px_rgba(0,0,0,0.12)] z-20"
          >
            {/* Masking Tape (Top) */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#E8DCC4]/90 backdrop-blur-sm rotate-1 shadow-sm border border-[#1A1715]/5 z-30" />

            {/* India Stamp (Top Right) */}
            <motion.div 
              animate={{ rotate: [2, 5, 2] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -top-6 -right-8 w-28 h-32 border-2 border-dashed border-[#1A1715]/20 p-2 bg-[#FCFAF5] flex flex-col items-center justify-center text-[#1A1715]/40 shadow-sm z-30"
            >
               <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-1">
                 <path d="M3 21h18M9 21V9l6-4 6 4v12M9 9l6-4M15 21V9"/>
               </svg>
               <span className="font-serif text-[10px] uppercase tracking-widest mt-1">India</span>
            </motion.div>

            <div className="p-8 md:p-10">
              {/* Form Title */}
              <div className="text-center mb-8 relative">
                <h2 className="font-script text-4xl text-[#1A1715]">Send us a Message</h2>
                {/* Custom Hand-drawn Underline */}
                <svg className="absolute left-1/2 -bottom-3 -translate-x-1/2 w-40 h-3 text-[#b33a3a]" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M10 8 Q 50 12 90 8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                </svg>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
                
                <div className="group">
                  <input 
                    className="w-full bg-transparent border-b border-[#1A1715]/20 px-1 py-3 text-sm outline-none focus:border-[#b33a3a] transition-all placeholder:text-[#1A1715]/40 text-[#1A1715] font-medium" 
                    placeholder="Your Name *" 
                    {...register('name', { required: 'Name required' })} 
                  />
                  {errors.name && <p className="text-xs text-[#b33a3a] mt-1">{errors.name.message}</p>}
                </div>

                <div className="group">
                  <input 
                    type="email" 
                    className="w-full bg-transparent border-b border-[#1A1715]/20 px-1 py-3 text-sm outline-none focus:border-[#b33a3a] transition-all placeholder:text-[#1A1715]/40 text-[#1A1715] font-medium" 
                    placeholder="Your Email *" 
                    {...register('email', { required: 'Email required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })} 
                  />
                  {errors.email && <p className="text-xs text-[#b33a3a] mt-1">{errors.email.message}</p>}
                </div>

                <div className="relative group">
                  <select 
                    className="w-full bg-transparent border-b border-[#1A1715]/20 px-1 py-3 text-sm outline-none focus:border-[#b33a3a] transition-all text-[#1A1715] font-medium appearance-none cursor-pointer" 
                    {...register('subject', { required: 'Required' })}
                  >
                    <option value="" disabled hidden>Subject *</option>
                    <option value="general">General Enquiry</option>
                    <option value="order">Order Support</option>
                    <option value="return">Returns & Exchange</option>
                    <option value="feedback">Feedback</option>
                    <option value="collab">Collaboration</option>
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#1A1715]/50 group-hover:text-[#b33a3a] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>

                <div className="group">
                  <textarea 
                    className="w-full bg-transparent border-b border-[#1A1715]/20 px-1 py-3 text-sm outline-none focus:border-[#b33a3a] transition-all placeholder:text-[#1A1715]/40 text-[#1A1715] font-medium resize-none" 
                    rows={3} 
                    placeholder="Your Message *" 
                    {...register('message', { required: 'Required' })} 
                  />
                  {errors.message && <p className="text-xs text-[#b33a3a] mt-1">{errors.message.message}</p>}
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#b33a3a] text-[#F7F3EC] font-script text-2xl py-3 hover:bg-[#8f2e2e] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-3 mt-6 group"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN: The Telephone Booth Image ── */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full lg:w-[30%] hidden lg:block relative min-h-[600px]"
        >
           {/* Image with a subtle torn edge effect on the left side */}
           <div 
             className="absolute inset-0 bg-[url('/assets/images/contactus-hero.jpeg')] bg-cover bg-center"
             style={{ 
               clipPath: 'polygon(2% 0, 100% 0, 100% 100%, 2% 100%, 0 95%, 4% 85%, 0 75%, 5% 65%, 0 55%, 4% 45%, 0 35%, 5% 25%, 0 15%, 4% 5%)'
             }}
           />
           <div className="absolute inset-0 bg-[#1A1715]/10 mix-blend-multiply" />
           
           {/* Cursive Note on the Image */}
           <div className="absolute bottom-12 right-8 text-[#F7F3EC] text-right drop-shadow-lg">
              <p className="font-script text-3xl leading-tight rotate-[-3deg]">
                Same streets.<br/>
                Different generations.<br/>
                <em className="text-[#E8DCC4] not-italic">Same feelings. ♡</em>
              </p>
           </div>
        </motion.div>
      </section>

      {/* ═══════════ BOTTOM STRIP (Features) ═══════════ */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative bg-[#F7F3EC] border-t border-[#1A1715]/10 py-10"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-wrap justify-between items-center gap-8">
          
          {[
            { icon: MessageCircle, title: 'Quick Response', desc: 'We reply within 24 hours.' },
            { icon: Package, title: 'Order Support', desc: 'Help with orders, returns and exchanges.' },
            { icon: Lightbulb, title: 'Suggestions', desc: 'Share your ideas with us.' },
            { icon: Heart, title: 'Just Say Hi', desc: 'We love hearing your stories.' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 group cursor-default">
              <div className="p-3 rounded-full bg-[#1A1715]/5 group-hover:bg-[#b33a3a]/10 transition-colors">
                <item.icon size={28} strokeWidth={1.2} className="text-[#1A1715] group-hover:text-[#b33a3a] transition-colors" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1A1715]">{item.title}</p>
                <p className="text-xs text-[#1A1715]/60 mt-1 max-w-[180px] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}

          {/* Far Right Note & Stamp */}
          <div className="flex items-center gap-6 ml-auto">
            <div className="font-script text-2xl text-[#1A1715] rotate-[-3deg] text-right leading-tight hidden xl:block">
              Same streets.<br/>Different generations.<br/>Same feelings. ♡
            </div>
            
            {/* Red India Stamp */}
            <div className="w-20 h-24 border-[1.5px] border-dashed border-[#b33a3a]/50 rounded-sm p-1 flex flex-col items-center justify-center text-[#b33a3a] rotate-[-8deg] opacity-80">
              <span className="text-[8px] font-cond uppercase tracking-widest">India</span>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="my-1">
                <path d="M3 21h18M9 21V9l6-4 6 4v12M9 9l6-4M15 21V9"/>
              </svg>
              <span className="text-[8px] font-cond uppercase tracking-widest">India</span>
            </div>
          </div>

        </div>
      </motion.div>
    </main>
  );
}