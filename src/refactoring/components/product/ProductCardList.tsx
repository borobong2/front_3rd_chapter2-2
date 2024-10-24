import React from "react";
import { Product } from "../../../types";
import { ProductCard } from "./ProductCard";

interface ProductCardListProps {
  product: Product;
  onEditClick: () => void;
}

export const ProductCardList: React.FC<ProductCardListProps> = ({
  product,
  onEditClick,
}) => (
  <div>
    {product.discounts.map((discount, index) => (
      <ProductCard key={index} discount={discount} />
    ))}
    <button
      data-testid="modify-button"
      onClick={onEditClick}
      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
    >
      수정
    </button>
  </div>
);
