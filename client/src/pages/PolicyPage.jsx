import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { policyService } from '../services/policyService';

export default function PolicyPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    policyService.get(slug).then(setPage).catch(() => setPage(null));
  }, [slug]);

  if (!page) {
    return (
      <main className="bg-[#F7F3EC] min-h-screen pt-32 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#b33a3a]"></div>
      </main>
    );
  }

  // Extract headings for sticky sidebar
  const headings = page.sections?.map(s => s.heading) || [];
  if (page.faqs?.length > 0) headings.push("Frequently Asked Questions");
  if (page.sizeTable?.headers?.length > 0) headings.push("Size Chart");

  return (
    <main className="bg-[#F7F3EC] min-h-screen py-16">
      <div className="container-page max-w-6xl">
        
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-[#1A1715]/50 hover:text-[#b33a3a] transition-colors mb-10">
          <ArrowLeft size={14} /> Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#b33a3a] block mb-4">
            {page.eyebrow}
          </span>
          <h1 className="font-serif text-5xl md:text-6xl text-[#1A1715] leading-tight">
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="mt-4 text-[#1A1715]/60 font-sans max-w-2xl mx-auto">
              {page.subtitle}
            </p>
          )}
          {page.updatedAtLabel && (
            <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[#1A1715]/40">
              {page.updatedAtLabel}
            </p>
          )}
        </div>

        <div className="grid gap-12 lg:grid-cols-[240px_1fr] items-start">
          
          {/* Sticky Sidebar Navigation */}
          <aside className="hidden lg:block sticky top-24">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#1A1715]/40 mb-6">On this page</h3>
            <ul className="space-y-3 border-l border-[#1A1715]/10">
              {headings.map((h, i) => (
                <li key={i}>
                  <a 
                    href={`#section-${i}`}
                    className="block pl-4 text-sm font-sans text-[#1A1715]/60 hover:text-[#b33a3a] hover:border-l-2 hover:border-[#b33a3a] transition-all -ml-px"
                  >
                    {h}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main Content Area */}
          <div className="space-y-8">
            
            {/* Sections */}
            {page.sections?.map((s, i) => (
              <motion.div 
                key={i} 
                id={`section-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="bg-[#FCFAF5] border border-[#1A1715]/10 rounded-3xl p-8 sm:p-10 shadow-sm"
              >
                <h2 className="font-serif text-2xl text-[#1A1715] mb-4">{s.heading}</h2>
                {s.body && <p className="text-sm md:text-base text-[#1A1715]/70 leading-relaxed font-sans mb-6">{s.body}</p>}
                {s.bullets?.length > 0 && (
                  <ul className="space-y-3">
                    {s.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm md:text-base text-[#1A1715]/70 font-sans leading-relaxed">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#b33a3a]/50 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {s.note && (
                  <div className="mt-6 bg-[#EBE4D8]/50 border border-[#C8A97E]/30 rounded-xl p-5 text-sm text-[#1A1715]/80 font-sans">
                    <strong className="text-[#1A1715]">Note:</strong> {s.note}
                  </div>
                )}
              </motion.div>
            ))}

            {/* FAQs */}
            {page.faqs?.length > 0 && (
              <motion.div 
                id={`section-${page.sections?.length || 0}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#FCFAF5] border border-[#1A1715]/10 rounded-3xl p-4 sm:p-8 shadow-sm"
              >
                <h2 className="font-serif text-2xl text-[#1A1715] mb-6 px-2">Frequently Asked Questions</h2>
                {page.faqs.map((f, i) => (
                  <div key={i} className="border-b border-[#1A1715]/10 last:border-0 px-2">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="flex w-full items-center justify-between py-5 text-left group"
                    >
                      <span className="font-serif text-lg text-[#1A1715] group-hover:text-[#b33a3a] transition-colors">{f.question}</span>
                      <ChevronDown 
                        size={20} 
                        className={`text-[#1A1715]/40 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} 
                      />
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="pb-6 text-sm md:text-base text-[#1A1715]/70 leading-relaxed font-sans">
                            {f.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Size guide table */}
            {page.sizeTable?.headers?.length > 0 && (
              <motion.div 
                id={`section-${(page.sections?.length || 0) + (page.faqs?.length > 0 ? 1 : 0)}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#FCFAF5] border border-[#1A1715]/10 rounded-3xl p-6 sm:p-8 shadow-sm overflow-hidden"
              >
                <h2 className="font-serif text-2xl text-[#1A1715] mb-6">Size Chart</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-[#1A1715]/10">
                        {page.sizeTable.headers.map((h, i) => (
                          <th key={i} className="py-4 pr-4 font-bold uppercase tracking-widest text-[11px] text-[#1A1715]/50">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {page.sizeTable.rows.map((row, i) => (
                        <tr key={i} className="border-b border-[#1A1715]/5 last:border-0 hover:bg-[#EBE4D8]/30 transition-colors">
                          {row.map((cell, j) => (
                            <td key={j} className={`py-4 pr-4 font-sans ${j === 0 ? 'font-bold text-[#1A1715]' : 'text-[#1A1715]/70'}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}