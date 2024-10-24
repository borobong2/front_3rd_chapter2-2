import { useState } from "react";
import { Coupon } from "../../types";

export const useCouponManagement = (
  initialCoupons: Coupon[],
  onCouponAdd: (coupon: Coupon) => void
) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: "",
    code: "",
    discountType: "amount",
    discountValue: 0,
  });

  const handleAddCoupon = () => {
    onCouponAdd(newCoupon);
    setCoupons([...coupons, newCoupon]);
    setNewCoupon({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
  };

  return {
    coupons,
    newCoupon,
    setNewCoupon,
    handleAddCoupon,
  };
};
