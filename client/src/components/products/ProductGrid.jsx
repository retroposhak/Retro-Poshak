import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '../common/Skeletons';

export default function ProductGrid({ products, loading, skeletonCount = 6, activeColors = [] }) {
  if (loading) return <ProductGridSkeleton count={skeletonCount} />;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} activeColors={activeColors} />
      ))}
    </div>
  );
}