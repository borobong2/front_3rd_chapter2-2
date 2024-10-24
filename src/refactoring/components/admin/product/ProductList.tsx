import React from "react";
import { Product } from "../../../../types.ts";
import { ProductItem } from "./ProductItem.tsx";
import { useProductAccordion } from "../../../hooks/useProductAccordion";

interface ProductListProps {
  products: Product[];
  onProductUpdate: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onProductUpdate,
}) => {
  const { openProductIds, toggleProductAccordion } = useProductAccordion();

  return (
    <div className="space-y-2">
      {products.map((product, index) => (
        <ProductItem
          key={product.id}
          product={product}
          index={index}
          isOpen={openProductIds.has(product.id)}
          onToggle={() => toggleProductAccordion(product.id)}
          onUpdate={onProductUpdate}
        />
      ))}
    </div>
  );
};
