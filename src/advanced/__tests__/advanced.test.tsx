import { useState } from "react";
import { describe, expect, test } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  within,
  renderHook,
} from "@testing-library/react";
import { CartPage } from "../../refactoring/pages/CartPage";
import { AdminPage } from "../../refactoring/pages/AdminPage";
import { Coupon, Product } from "../../types";
import { useCart } from "../../refactoring/hooks/useCart";
import { useCoupons } from "../../refactoring/hooks/useCoupon";
import { useProducts } from "../../refactoring/hooks/useProduct";
import { useProductAccordion } from "../../refactoring/hooks/useProductAccordion";

const mockProducts: Product[] = [
  {
    id: "p1",
    name: "상품1",
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }],
  },
  {
    id: "p2",
    name: "상품2",
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: "p3",
    name: "상품3",
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
];
const mockCoupons: Coupon[] = [
  {
    name: "5000원 할인 쿠폰",
    code: "AMOUNT5000",
    discountType: "amount",
    discountValue: 5000,
  },
  {
    name: "10% 할인 쿠폰",
    code: "PERCENT10",
    discountType: "percentage",
    discountValue: 10,
  },
];

const TestAdminPage = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleProductAdd = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const handleCouponAdd = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  return (
    <AdminPage
      products={products}
      coupons={coupons}
      onProductUpdate={handleProductUpdate}
      onProductAdd={handleProductAdd}
      onCouponAdd={handleCouponAdd}
    />
  );
};

describe("advanced > ", () => {
  describe("시나리오 테스트 > ", () => {
    test("장바구니 페이지 테스트 > ", async () => {
      render(<CartPage products={mockProducts} coupons={mockCoupons} />);
      const product1 = screen.getByTestId("product-p1");
      const product2 = screen.getByTestId("product-p2");
      const product3 = screen.getByTestId("product-p3");
      const addToCartButtonsAtProduct1 =
        within(product1).getByText("장바구니에 추가");
      const addToCartButtonsAtProduct2 =
        within(product2).getByText("장바구니에 추가");
      const addToCartButtonsAtProduct3 =
        within(product3).getByText("장바구니에 추가");

      // 1. 상품 정보 표시
      expect(product1).toHaveTextContent("상품1");
      expect(product1).toHaveTextContent("10,000원");
      expect(product1).toHaveTextContent("재고: 20개");
      expect(product2).toHaveTextContent("상품2");
      expect(product2).toHaveTextContent("20,000원");
      expect(product2).toHaveTextContent("재고: 20개");
      expect(product3).toHaveTextContent("상품3");
      expect(product3).toHaveTextContent("30,000원");
      expect(product3).toHaveTextContent("재고: 20개");

      // 2. 할인 정보 표시
      expect(screen.getByText("10개 이상: 10% 할인")).toBeInTheDocument();

      // 3. 상품1 장바구니에 상품 추가
      fireEvent.click(addToCartButtonsAtProduct1); // 상품1 추가

      // 4. 할인율 계산
      expect(screen.getByText("상품 금액: 10,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 0원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 10,000원")).toBeInTheDocument();

      // 5. 상품 품절 상태로 만들기
      for (let i = 0; i < 19; i++) {
        fireEvent.click(addToCartButtonsAtProduct1);
      }

      // 6. 품절일 때 상품 추가 안 되는지 확인하기
      expect(product1).toHaveTextContent("재고: 0개");
      fireEvent.click(addToCartButtonsAtProduct1);
      expect(product1).toHaveTextContent("재고: 0개");

      // 7. 할인율 계산
      expect(screen.getByText("상품 금액: 200,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 20,000원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 180,000원")).toBeInTheDocument();

      // 8. 상품을 각각 10개씩 추가하기
      fireEvent.click(addToCartButtonsAtProduct2); // 상품2 추가
      fireEvent.click(addToCartButtonsAtProduct3); // 상품3 추가

      const increaseButtons = screen.getAllByText("+");
      for (let i = 0; i < 9; i++) {
        fireEvent.click(increaseButtons[1]); // 상품2
        fireEvent.click(increaseButtons[2]); // 상품3
      }

      // 9. 할인율 계산
      expect(screen.getByText("상품 금액: 700,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 110,000원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 590,000원")).toBeInTheDocument();

      // 10. 쿠폰 적용하기
      const couponSelect = screen.getByRole("combobox");
      fireEvent.change(couponSelect, { target: { value: "1" } }); // 10% 할인 쿠폰 선택

      // 11. 할인율 계산
      expect(screen.getByText("상품 금액: 700,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 169,000원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 531,000원")).toBeInTheDocument();

      // 12. 다른 할인 쿠폰 적용하기
      fireEvent.change(couponSelect, { target: { value: "0" } }); // 5000원 할인 쿠폰
      expect(screen.getByText("상품 금액: 700,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 115,000원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 585,000원")).toBeInTheDocument();
    });

    test("관리자 페이지 테스트 > ", async () => {
      render(<TestAdminPage />);

      const $product1 = screen.getByTestId("product-1");

      // 1. 새로운 상품 추가
      fireEvent.click(screen.getByText("새 상품 추가"));

      fireEvent.change(screen.getByLabelText("상품명"), {
        target: { value: "상품4" },
      });
      fireEvent.change(screen.getByLabelText("가격"), {
        target: { value: "15000" },
      });
      fireEvent.change(screen.getByLabelText("재고"), {
        target: { value: "30" },
      });

      fireEvent.click(screen.getByText("추가"));

      const $product4 = screen.getByTestId("product-4");

      expect($product4).toHaveTextContent("상품4");
      expect($product4).toHaveTextContent("15000원");
      expect($product4).toHaveTextContent("재고: 30");

      // 2. 상품 선택 및 수정
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId("toggle-button"));
      fireEvent.click(within($product1).getByTestId("modify-button"));

      act(() => {
        fireEvent.change(within($product1).getByDisplayValue("20"), {
          target: { value: "25" },
        });
        fireEvent.change(within($product1).getByDisplayValue("10000"), {
          target: { value: "12000" },
        });
        fireEvent.change(within($product1).getByDisplayValue("상품1"), {
          target: { value: "수정된 상품1" },
        });
      });

      fireEvent.click(within($product1).getByText("수정 완료"));

      expect($product1).toHaveTextContent("수정된 상품1");
      expect($product1).toHaveTextContent("12000원");
      expect($product1).toHaveTextContent("재고: 25");

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId("modify-button"));

      // 할인 추가
      act(() => {
        fireEvent.change(screen.getByPlaceholderText("수량"), {
          target: { value: "5" },
        });
        fireEvent.change(screen.getByPlaceholderText("할인율 (%)"), {
          target: { value: "5" },
        });
      });
      fireEvent.click(screen.getByText("할인 추가"));

      expect(
        screen.queryByText("5개 이상 구매 시 5% 할인")
      ).toBeInTheDocument();

      // 할인 삭제
      fireEvent.click(screen.getAllByText("삭제")[0]);
      expect(
        screen.queryByText("10개 이상 구매 시 10% 할인")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("5개 이상 구매 시 5% 할인")
      ).toBeInTheDocument();

      fireEvent.click(screen.getAllByText("삭제")[0]);
      expect(
        screen.queryByText("10개 이상 구매 시 10% 할인")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("5개 이상 구매 시 5% 할인")
      ).not.toBeInTheDocument();

      // 4. 쿠폰 추가
      fireEvent.change(screen.getByPlaceholderText("쿠폰 이름"), {
        target: { value: "새 쿠폰" },
      });
      fireEvent.change(screen.getByPlaceholderText("쿠폰 코드"), {
        target: { value: "NEW10" },
      });
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "percentage" },
      });
      fireEvent.change(screen.getByPlaceholderText("할인 값"), {
        target: { value: "10" },
      });

      fireEvent.click(screen.getByText("쿠폰 추가"));

      const $newCoupon = screen.getByTestId("coupon-3");

      expect($newCoupon).toHaveTextContent("새 쿠폰 (NEW10):10% 할인");
    });
  });

  describe("useCart hook", () => {
    test("상품을 장바구니에 추가하고 제거할 수 있다", () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart({
          id: "test1",
          name: "테스트 상품",
          price: 10000,
          stock: 10,
          discounts: [],
        });
      });

      expect(result.current.cart.length).toBe(1);
      expect(result.current.cart[0].product.name).toBe("테스트 상품");

      act(() => {
        result.current.removeFromCart("test1");
      });

      expect(result.current.cart.length).toBe(0);
    });

    test("장바구니 상품의 수량을 업데이트할 수 있다", () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart({
          id: "test1",
          name: "테스트 상품",
          price: 10000,
          stock: 10,
          discounts: [],
        });
      });

      act(() => {
        result.current.updateQuantity("test1", 5);
      });

      expect(result.current.cart[0].quantity).toBe(5);
    });

    test("쿠폰을 적용할 수 있다", () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart({
          id: "test1",
          name: "테스트 상품",
          price: 10000,
          stock: 10,
          discounts: [],
        });
      });

      act(() => {
        result.current.applyCoupon({
          name: "10% 할인 쿠폰",
          code: "TEST10",
          discountType: "percentage",
          discountValue: 10,
        });
      });

      expect(result.current.selectedCoupon?.code).toBe("TEST10");
    });

    test("장바구니의 총 가격을 계산할 수 있다", () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart({
          id: "test1",
          name: "테스트 상품 1",
          price: 10000,
          stock: 10,
          discounts: [],
        });
        result.current.addToCart({
          id: "test2",
          name: "테스트 상품 2",
          price: 20000,
          stock: 5,
          discounts: [],
        });
      });

      const { totalBeforeDiscount, totalAfterDiscount } =
        result.current.calculateTotal();
      expect(totalBeforeDiscount).toBe(30000);
      expect(totalAfterDiscount).toBe(30000);
    });

    test("최대 할인을 적용할 수 있다", () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart({
          id: "test1",
          name: "테스트 상품",
          price: 10000,
          stock: 10,
          discounts: [
            { quantity: 1, rate: 0.1 },
            { quantity: 5, rate: 0.2 },
          ],
        });
      });

      act(() => {
        result.current.updateQuantity("test1", 5);
      });

      const appliedDiscount = result.current.getAppliedDiscount(
        result.current.cart[0]
      );
      expect(appliedDiscount).toBe(0.2);
    });
  });
  describe("useCoupons hook", () => {
    test("초기 쿠폰을 설정하고 새 쿠폰을 추가할 수 있다", () => {
      const initialCoupons: Coupon[] = [
        {
          name: "초기 쿠폰",
          code: "INITIAL",
          discountType: "percentage",
          discountValue: 10,
        },
      ];

      const { result } = renderHook(() => useCoupons(initialCoupons));

      expect(result.current.coupons).toHaveLength(1);
      expect(result.current.coupons[0].name).toBe("초기 쿠폰");

      act(() => {
        result.current.addCoupon({
          name: "새 쿠폰",
          code: "NEW",
          discountType: "amount",
          discountValue: 5000,
        });
      });

      expect(result.current.coupons).toHaveLength(2);
      expect(result.current.coupons[1].name).toBe("새 쿠폰");
      expect(result.current.coupons[1].discountType).toBe("amount");
      expect(result.current.coupons[1].discountValue).toBe(5000);
    });
  });

  describe("useProducts hook", () => {
    test("초기 상품을 설정하고 새 상품을 추가할 수 있다", () => {
      const initialProducts: Product[] = [
        {
          id: "initial",
          name: "초기 상품",
          price: 10000,
          stock: 10,
          discounts: [],
        },
      ];

      const { result } = renderHook(() => useProducts(initialProducts));

      expect(result.current.products).toHaveLength(1);
      expect(result.current.products[0].name).toBe("초기 상품");

      act(() => {
        result.current.addProduct({
          id: "new",
          name: "새 상품",
          price: 20000,
          stock: 5,
          discounts: [],
        });
      });

      expect(result.current.products).toHaveLength(2);
      expect(result.current.products[1].name).toBe("새 상품");
    });

    test("상품을 업데이트할 수 있다", () => {
      const initialProducts: Product[] = [
        {
          id: "test",
          name: "테스트 상품",
          price: 10000,
          stock: 10,
          discounts: [],
        },
      ];

      const { result } = renderHook(() => useProducts(initialProducts));

      act(() => {
        result.current.updateProduct({
          id: "test",
          name: "업데이트된 상품",
          price: 15000,
          stock: 5,
          discounts: [],
        });
      });

      expect(result.current.products[0].name).toBe("업데이트된 상품");
      expect(result.current.products[0].price).toBe(15000);
      expect(result.current.products[0].stock).toBe(5);
    });
  });

  describe("useProductAccordion hook", () => {
    test("제품 아코디언을 열고 닫을 수 있다", () => {
      const { result } = renderHook(() => useProductAccordion());

      // 초기 상태 확인
      expect(result.current.openProductIds.size).toBe(0);

      // 제품 ID "p1"을 열기
      act(() => {
        result.current.toggleProductAccordion("p1");
      });
      expect(result.current.openProductIds.has("p1")).toBe(true);

      // 제품 ID "p1"을 닫기
      act(() => {
        result.current.toggleProductAccordion("p1");
      });
      expect(result.current.openProductIds.has("p1")).toBe(false);

      // 여러 제품 ID 열기
      act(() => {
        result.current.toggleProductAccordion("p1");
        result.current.toggleProductAccordion("p2");
      });
      expect(result.current.openProductIds.has("p1")).toBe(true);
      expect(result.current.openProductIds.has("p2")).toBe(true);
    });
  });
});
