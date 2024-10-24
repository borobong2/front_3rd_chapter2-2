import React from "react";
import { Product } from "../../../../types.ts";
import { ProductDiscountList } from "./ProductDiscountList.tsx";

interface ProductEditFormProps {
  editingProduct: Product;
  newDiscount: { quantity: number; rate: number };
  setNewDiscount: React.Dispatch<
    React.SetStateAction<{ quantity: number; rate: number }>
  >;
  onProductNameUpdate: (name: string) => void;
  onPriceUpdate: (price: number) => void;
  onStockUpdate: (stock: number) => void;
  onAddDiscount: () => void;
  onRemoveDiscount: (index: number) => void;
  onEditComplete: () => void;
}

export const ProductEditForm: React.FC<ProductEditFormProps> = ({
  editingProduct,
  newDiscount,
  setNewDiscount,
  onProductNameUpdate,
  onPriceUpdate,
  onStockUpdate,
  onAddDiscount,
  onRemoveDiscount,
  onEditComplete,
}) => (
  <div>
    <div className="mb-4">
      <label className="block mb-1">상품명: </label>
      <input
        type="text"
        value={editingProduct.name}
        onChange={(e) => onProductNameUpdate(e.target.value)}
        className="w-full p-2 border rounded"
      />
    </div>
    <div className="mb-4">
      <label className="block mb-1">가격: </label>
      <input
        type="number"
        value={editingProduct.price}
        onChange={(e) => onPriceUpdate(parseInt(e.target.value))}
        className="w-full p-2 border rounded"
      />
    </div>
    <div className="mb-4">
      <label className="block mb-1">재고: </label>
      <input
        type="number"
        value={editingProduct.stock}
        onChange={(e) => onStockUpdate(parseInt(e.target.value))}
        className="w-full p-2 border rounded"
      />
    </div>
    <ProductDiscountList
      discounts={editingProduct.discounts}
      newDiscount={newDiscount}
      setNewDiscount={setNewDiscount}
      onAddDiscount={onAddDiscount}
      onRemoveDiscount={onRemoveDiscount}
    />
    <button
      onClick={onEditComplete}
      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
    >
      수정 완료
    </button>
  </div>
);
