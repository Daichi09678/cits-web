"use client";

import ProductManagementEditor from "@/components/pages/admin-products/ProductManagementEditor";
import useProductManagementEditor from "@/components/pages/admin-products/useProductManagementEditor";

export default function AdminProductsPage() {
  const editor = useProductManagementEditor();
  return <ProductManagementEditor editor={editor} />;
}
