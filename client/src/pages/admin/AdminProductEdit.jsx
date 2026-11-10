import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, UploadCloud, X } from 'lucide-react';
import { adminService } from '../../services/adminService';

const ALL_COLORS = ['Beige', 'Navy Blue', 'Black', 'Charcoal Grey'];
const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const resolveImage = (src) => {
  if (!src) return null;
  const clean = src.replace(/^\/+/, '');
  return clean.startsWith('http') || clean.startsWith('assets') ? `/${clean}` : `/${clean}`;
};

export default function AdminProductEdit() {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '', subtitle: '', description: '', price: '', compareAt: '',
    images: [], colors: [], sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    categories: [], isFeatured: false, isActive: true,
    defaultStock: 8, variantStocks: {},
  });

  useEffect(() => {
    adminService.categories().then(setCategories).catch(() => {});
    if (!isNew) {
      adminService.products.get(id)
        .then((p) => {
          const stocks = {};
          (p.variants || []).forEach((v) => { stocks[`${v.colour}|${v.size}`] = v.stock; });
          setForm({
            name: p.name || '', subtitle: p.subtitle || '', description: p.description || '',
            price: p.price, compareAt: p.compareAt || '', images: p.images || [],
            colors: p.colors || [], sizes: p.sizes || ALL_SIZES, categories: p.categories || [],
            isFeatured: !!p.isFeatured, isActive: p.isActive !== false,
            defaultStock: 8, variantStocks: stocks,
          });
        })
        .catch(() => toast.error('Failed to load product'))
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const toggleColor = (c) => setForm((f) => ({ ...f, colors: f.colors.includes(c) ? f.colors.filter((x) => x !== c) : [...f.colors, c] }));
  const toggleSize = (s) => setForm((f) => ({ ...f, sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s] }));
  const toggleCategory = (slug) => setForm((f) => ({ ...f, categories: f.categories.includes(slug) ? f.categories.filter((x) => x !== slug) : [...f.categories, slug] }));

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await adminService.products.uploadImages(files);
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
      toast.success(`${urls.length} image${urls.length > 1 ? 's' : ''} uploaded`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (i) => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) {
        await adminService.products.create(form);
        toast.success('Product created');
      } else {
        await adminService.products.update(id, form);
        toast.success('Product updated');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse h-96 rounded-card bg-cream-200" />;
  }

  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl pb-20">
      <Link to="/admin/products" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-mute hover:text-red transition-colors mb-6">
        <ArrowLeft size={14} /> Back to products
      </Link>
      <h1 className="font-display text-4xl tracking-wide text-ink mb-8">
        {isNew ? 'New Product' : 'Edit Product'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Section title="Basic Details">
          <Input label="Product Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
          <div className="grid grid-cols-2 gap-6">
            <Input label="Price (₹) *" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <Input label="Compare At (₹)" type="number" value={form.compareAt} onChange={(e) => setForm({ ...form, compareAt: e.target.value })} />
          </div>
        </Section>

        <Section title="Media Gallery">
          <p className="text-xs text-ink-mute mb-4">Upload high-quality images or paste direct asset paths.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            {form.images.map((img, i) => (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-ink/10 bg-cream-100">
                <img 
                  src={resolveImage(img)} 
                  alt="" 
                  className="h-full w-full object-cover" 
                  onError={(e) => { e.target.src = 'https://placehold.co/400x400/f4ede1/1a1715?text=Image+Missing' }}
                />
                <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="h-8 w-8 rounded-full bg-white text-red shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
            
            <label className="aspect-square flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/20 hover:border-ink/40 hover:bg-cream-50 cursor-pointer transition-colors text-ink-mute">
              <UploadCloud size={24} className={uploading ? 'animate-bounce' : ''} />
              <span className="text-xs font-bold uppercase tracking-wider">{uploading ? 'Uploading...' : 'Upload'}</span>
              <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
          <input
            placeholder="...or paste image path here and press Enter"
            className="input w-full bg-cream-50"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const val = e.currentTarget.value.trim();
                if (val) {
                  setForm((f) => ({ ...f, images: [...f.images, val] }));
                  e.currentTarget.value = '';
                }
              }
            }}
          />
        </Section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Section title="Available Colours">
            <div className="flex flex-wrap gap-2">
              {ALL_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => toggleColor(c)}
                  className={`chip px-4 py-2 ${form.colors.includes(c) ? 'bg-ink text-cream border-ink shadow-md' : 'bg-cream-50'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Available Sizes">
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => toggleSize(s)}
                  className={`h-10 min-w-[48px] rounded-lg border text-sm font-medium transition-all ${
                    form.sizes.includes(s) ? 'border-ink bg-ink text-cream shadow-md scale-105' : 'border-ink/15 bg-cream-50 hover:border-ink/30'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Section>
        </div>

        {isNew && (
          <Section title="Initial Inventory">
            <Input label="Stock per variant" type="number" min="0" value={form.defaultStock} onChange={(e) => setForm({ ...form, defaultStock: Number(e.target.value) })} />
          </Section>
        )}

        {!isNew && form.colors.length > 0 && (
          <Section title="Inventory Matrix">
            <div className="overflow-x-auto rounded-xl border border-ink/10 shadow-sm">
              <table className="w-full text-sm bg-cream-50">
                <thead className="bg-cream-100 text-[11px] font-bold uppercase tracking-wide2 text-ink-mute border-b border-ink/10">
                  <tr>
                    <th className="px-4 py-3 text-left">Colour</th>
                    {form.sizes.map((s) => <th key={s} className="px-4 py-3 text-left">{s}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {form.colors.map((c) => (
                    <tr key={c} className="border-b border-ink/5 last:border-0 hover:bg-white transition-colors">
                      <td className="px-4 py-3 font-medium">{c}</td>
                      {form.sizes.map((s) => {
                        const key = `${c}|${s}`;
                        return (
                          <td key={s} className="px-4 py-3">
                            <input
                              type="number" min="0" value={form.variantStocks[key] ?? 0}
                              onChange={(e) => setForm((f) => ({ ...f, variantStocks: { ...f.variantStocks, [key]: Number(e.target.value) } }))}
                              className="input py-1.5 px-2 w-20 bg-white"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        <Section title="Collections & Visibility">
          <div className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-wide2 text-ink-soft mb-3">Collections</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  type="button" key={c.slug} onClick={() => toggleCategory(c.slug)}
                  className={`chip px-4 py-2 ${form.categories.includes(c.slug) ? 'bg-ink text-cream border-ink shadow-md' : 'bg-cream-50'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3 pt-4 border-t border-ink/10">
            <label className="flex items-center gap-3 text-sm font-medium cursor-pointer group">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-5 h-5 accent-ink rounded cursor-pointer" />
              <span className="group-hover:text-ink transition-colors">Visible in Store (Active)</span>
            </label>
            <label className="flex items-center gap-3 text-sm font-medium cursor-pointer group">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="w-5 h-5 accent-ink rounded cursor-pointer" />
              <span className="group-hover:text-ink transition-colors">Feature on Homepage</span>
            </label>
          </div>
        </Section>

        <div className="flex items-center gap-4 pt-4">
          <button type="submit" disabled={saving} className="btn-primary min-w-[160px]">
            {saving ? 'Saving...' : isNew ? 'Create Product' : 'Save Changes'}
          </button>
          <Link to="/admin/products" className="btn-ghost">Cancel</Link>
        </div>
      </form>
    </motion.div>
  );
}

function Section({ title, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card p-6 md:p-8 space-y-5 border border-ink/5 shadow-sm">
      <h3 className="font-serif text-xl border-b border-ink/10 pb-3">{title}</h3>
      {children}
    </motion.div>
  );
}

function Input({ label, ...rest }) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide2 text-ink-soft">{label}</label>
      <input className="input bg-cream-50 focus:bg-white shadow-sm" {...rest} />
    </div>
  );
}

function Textarea({ label, ...rest }) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide2 text-ink-soft">{label}</label>
      <textarea className="input bg-cream-50 focus:bg-white shadow-sm min-h-[100px]" {...rest} />
    </div>
  );
}