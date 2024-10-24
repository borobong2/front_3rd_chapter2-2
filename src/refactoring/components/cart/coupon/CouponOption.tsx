import React from "react";
import { Coupon } from "../../../../types";

interface CouponOptionProps {
  coupon: Coupon;
  index: number;
}

export const CouponOption: React.FC<CouponOptionProps> = ({
  coupon,
  index,
}) => (
  <option value={index} key={coupon.code}>
    {coupon.name} -{" "}
    {coupon.discountType === "amount"
      ? `${coupon.discountValue}원`
      : `${coupon.discountValue}%`}
  </option>
);
