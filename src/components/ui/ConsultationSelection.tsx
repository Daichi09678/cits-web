"use client";

import ProductPhoto from "@/components/ui/ProductPhoto";
import type { ProductItem } from "@/types/schema";
import type { ServicePresentation } from "@/data/serviceDetails";

export default function ConsultationSelection({
  service,
  product,
  selectedFeatures,
  onFeaturesChange,
}: {
  service?: ServicePresentation;
  product?: ProductItem;
  selectedFeatures: string[];
  onFeaturesChange: (features: string[]) => void;
}) {
  const features = [...new Set([...(service?.features || []), ...(product?.features || [])])];
  if (!service && !product) return null;
  return (
    <div className="space-y-3" data-testid="consultation-selection">
      {service && (
        <section
          className="rounded-xl border border-orange-200 dark:border-orange-800/60 bg-orange-50/60 dark:bg-orange-950/20 p-4"
          data-testid="consultation-service"
        >
          <p className="text-xs font-semibold text-orange-800 dark:text-orange-300">Layanan yang Dikonsultasikan</p>
          <h4 className="mt-1 font-bold break-words text-slate-900 dark:text-white">{service.title}</h4>
          <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{service.description}</p>
          {service.details && service.details !== service.description && (
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-200">
              {service.details}
            </p>
          )}
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">Dukungan: {service.slaNote}</p>
        </section>
      )}
      {product && (
        <section
          className="overflow-hidden rounded-xl border border-orange-200 dark:border-orange-800/60 bg-orange-50/60 dark:bg-orange-950/20"
          data-testid="consultation-product"
        >
          <ProductPhoto image={product.image} name={product.name} className="h-36 sm:h-44" />
          <div className="p-4">
            <p className="text-xs font-semibold text-orange-800 dark:text-orange-300">Produk yang Dikonsultasikan</p>
            <h4 className="mt-1 font-bold break-words text-slate-900 dark:text-white">{product.name}</h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{product.description}</p>
          </div>
        </section>
      )}
      {features.length > 0 && (
        <fieldset className="rounded-xl border border-slate-200 dark:border-white/10 p-4">
          <legend className="px-1 text-sm font-bold text-slate-900 dark:text-white">Fitur yang Ingin Dibahas</legend>
          <p className="mb-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            Pilih hingga 20 fitur yang relevan. Pilihan dari spesifikasi produk sudah ditandai otomatis.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {features.map((feature) => (
              <label
                key={feature}
                className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(feature)}
                  disabled={!selectedFeatures.includes(feature) && selectedFeatures.length >= 20}
                  onChange={() =>
                    onFeaturesChange(
                      selectedFeatures.includes(feature)
                        ? selectedFeatures.filter((item) => item !== feature)
                        : [...selectedFeatures, feature]
                    )
                  }
                  className="mt-0.5 h-4 w-4 shrink-0 accent-orange-700"
                />
                <span className="min-w-0 break-words">{feature}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}
