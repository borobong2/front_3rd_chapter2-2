import React from "react";
import { CartItem as CartItemType } from "../../../types";
import { CartItem } from "./CartItem";

interface CartListProps {
  cart: CartItemType[];
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeFromCart: (productId: string) => void;
  getAppliedDiscount: (item: CartItemType) => number;
}

export const CartList: React.FC<CartListProps> = ({
  cart,
  updateQuantity,
  removeFromCart,
  getAppliedDiscount,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>
      <div className="space-y-2">
        {cart.map((item) => (
          <CartItem
            key={item.product.id}
            item={item}
            appliedDiscount={getAppliedDiscount(item)}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
          />
        ))}
      </div>
    </div>
  );
};
