import React from "react";
import { Discount } from "../../../types";

interface ProductCardProps {
  discount: Discount;
}

export const ProductCard: React.FC<ProductCardProps> = ({ discount }) => (
  <div className="mb-2">
    <span>
      {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
    </span>
  </div>
);
