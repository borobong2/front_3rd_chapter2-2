import { Coupon, Product } from "../../types.ts";
import { useCart } from "../hooks/index.ts";
import { OrderSummary } from "../components/cart/order/OrderSummary.tsx";
import { CouponSelector } from "../components/cart/coupon/CouponSelector.tsx";
import { CartList } from "../components/cart/CartList.tsx";
import { ProductList } from "../components/cart/product/ProductList.tsx";
import { CartItem } from "../components/cart/CartItem.tsx";

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
    getMaxDiscount,
    getRemainingStock,
    getAppliedDiscount,
  } = useCart();

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } =
    calculateTotal();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductList
          products={products}
          addToCart={addToCart}
          getRemainingStock={getRemainingStock}
          getMaxDiscount={getMaxDiscount}
        />
        <div>
          <CartList>
            {cart.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                appliedDiscount={getAppliedDiscount(item)}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            ))}
          </CartList>
          <CouponSelector
            coupons={coupons}
            applyCoupon={applyCoupon}
            selectedCoupon={selectedCoupon}
          />
          <OrderSummary
            totalBeforeDiscount={totalBeforeDiscount}
            totalAfterDiscount={totalAfterDiscount}
            totalDiscount={totalDiscount}
          />
        </div>
      </div>
    </div>
  );
};
