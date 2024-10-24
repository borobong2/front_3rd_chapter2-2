import React from "react";
import { Product } from "../../../../types";

interface ProductHeaderProps {
  product: Product;
  onToggle: () => void;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  product,
  onToggle,
}) => (
  <button
    data-testid="toggle-button"
    onClick={onToggle}
    className="w-full text-left font-semibold"
  >
    {product.name} - {product.price}원 (재고: {product.stock})
  </button>
);
