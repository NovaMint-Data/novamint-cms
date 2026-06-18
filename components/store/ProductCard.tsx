import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Package, ShoppingBag, Star } from 'lucide-react';

export default function ProductCard({ product, featured = false }: { product: any; featured?: boolean }) {
  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.compare_price) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="group block product-card-ring rounded-3xl overflow-hidden bg-white">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-parchment overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-sage-200">
            <Package size={36} strokeWidth={1.2} />
            <span className="text-xs text-stone-300">No image</span>
          </div>
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {hasDiscount && (
            <span className="bg-sage-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
              -{discountPct}%
            </span>
          )}
          {product.featured && !hasDiscount && (
            <span className="bg-white/90 backdrop-blur-sm text-sage-700 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Star size={10} className="fill-sage-500 text-sage-500" /> Popular
            </span>
          )}
        </div>

        {/* Quick buy hover button */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <span className="bg-white text-sage-700 text-xs font-semibold px-5 py-2 rounded-full shadow-product flex items-center gap-1.5">
            <ShoppingBag size={13} /> View Product
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 py-4">
        {product.categories?.name && (
          <span className="text-[11px] font-semibold tracking-widest text-sage-500 uppercase">
            {product.categories.name}
          </span>
        )}
        <h3 className="font-display font-semibold text-stone-800 leading-snug mt-1 group-hover:text-sage-700 transition-colors line-clamp-2">
          {product.title}
        </h3>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="text-stone-900 font-bold text-lg">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className="text-stone-400 text-sm line-through">{formatPrice(product.compare_price)}</span>
            )}
          </div>
          <span className="text-xs text-stone-400 bg-stone-50 px-2.5 py-1 rounded-full">
            Digital
          </span>
        </div>
      </div>
    </Link>
  );
}
