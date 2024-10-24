import React, { useState } from "react";
import { Product } from "../../../../types.ts";
import { ProductItem } from "./ProductItem.tsx";

interface ProductListProps {
  products: Product[];
  onProductUpdate: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onProductUpdate,
}) => {
  const [openProductIds, setOpenProductIds] = useState(new Set<string>());

  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prevIds) => {
      const newIds = new Set(prevIds);
      if (newIds.has(productId)) {
        newIds.delete(productId);
      } else {
        newIds.add(productId);
      }
      return newIds;
    });
  };

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
