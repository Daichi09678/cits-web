"use client";

import ProductDetailsDialog from "@/components/ui/ProductDetailsDialog";
import type { ProductManagementEditorState } from "./useProductManagementEditor";

export default function ProductManagementPreview({ editor }: { editor: ProductManagementEditorState }) {
  const { previewProduct, setPreviewProduct } = editor;
  return (
    <>
      {previewProduct && (
        <ProductDetailsDialog product={previewProduct} preview onClose={() => setPreviewProduct(null)} />
      )}
    </>
  );
}
