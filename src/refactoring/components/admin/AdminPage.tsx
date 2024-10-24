import React from "react";
import { Product, Coupon } from "../../../types";
import { ProductManagement } from "../product/ProductManagement";
import { CouponManagement } from "../coupon/CouponManagement";

interface Props {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (product: Product) => void;
  onProductAdd: (product: Product) => void;
  onCouponAdd: (coupon: Coupon) => void;
}

export const AdminPage: React.FC<Props> = ({
  products,
  coupons,
  onProductUpdate,
  onProductAdd,
  onCouponAdd,
}) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductManagement
          products={products}
          onProductUpdate={onProductUpdate}
          onProductAdd={onProductAdd}
        />
        <CouponManagement coupons={coupons} onCouponAdd={onCouponAdd} />
      </div>
    </div>
  );
};
