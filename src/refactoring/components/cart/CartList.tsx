import React from "react";

interface CartListProps {
  children: React.ReactNode;
}

export const CartList: React.FC<CartListProps> = ({ children }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
};
