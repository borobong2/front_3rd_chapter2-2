import React, { useState } from "react";
import { Product } from "../../../../types.ts";
import { NewProductForm } from "./NewProductForm.tsx";
import { ProductList } from "./ProductList.tsx";

interface ProductManagementProps {
  products: Product[];
  onProductUpdate: (product: Product) => void;
  onProductAdd: (product: Product) => void;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  onProductUpdate,
  onProductAdd,
}) => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
      <button
        onClick={() => setShowNewProductForm(!showNewProductForm)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
      >
        {showNewProductForm ? "취소" : "새 상품 추가"}
      </button>
      {showNewProductForm && <NewProductForm onProductAdd={onProductAdd} />}
      <ProductList products={products} onProductUpdate={onProductUpdate} />
    </div>
  );
};
