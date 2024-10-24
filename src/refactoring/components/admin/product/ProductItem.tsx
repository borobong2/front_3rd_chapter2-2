import React from "react";
import { Product } from "../../../../types.ts";
import { useProductEdit } from "../../../hooks/product/useProductEdit.ts";
import { ProductHeader } from "./ProductHeader.tsx";
import { ProductEditForm } from "./ProductEditForm.tsx";
import { ProductCardList } from "./ProductCardList.tsx";

interface ProductItemProps {
  product: Product;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  onUpdate: (product: Product) => void;
}

export const ProductItem: React.FC<ProductItemProps> = ({
  product,
  index,
  isOpen,
  onToggle,
  onUpdate,
}) => {
  const {
    editingProduct,
    newDiscount,
    setNewDiscount,
    handleEditProduct,
    handleEditComplete,
    handleProductNameUpdate,
    handlePriceUpdate,
    handleStockUpdate,
    handleAddDiscount,
    handleRemoveDiscount,
  } = useProductEdit(product, onUpdate);

  return (
    <div
      data-testid={`product-${index + 1}`}
      className="bg-white p-4 rounded shadow"
    >
      <ProductHeader product={product} onToggle={onToggle} />
      {isOpen && (
        <div className="mt-2">
          {editingProduct ? (
            <ProductEditForm
              editingProduct={editingProduct}
              newDiscount={newDiscount}
              setNewDiscount={setNewDiscount}
              onProductNameUpdate={handleProductNameUpdate}
              onPriceUpdate={handlePriceUpdate}
              onStockUpdate={handleStockUpdate}
              onAddDiscount={handleAddDiscount}
              onRemoveDiscount={handleRemoveDiscount}
              onEditComplete={handleEditComplete}
            />
          ) : (
            <ProductCardList
              product={product}
              onEditClick={handleEditProduct}
            />
          )}
        </div>
      )}
    </div>
  );
};
