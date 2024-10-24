import { useState } from "react";
import { Product } from "../../types";

export const useProductEdit = (
  initialProduct: Product,
  onUpdate: (product: Product) => void
) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newDiscount, setNewDiscount] = useState({ quantity: 0, rate: 0 });

  const handleEditProduct = () => {
    setEditingProduct(initialProduct);
  };

  const handleEditComplete = () => {
    if (editingProduct) {
      onUpdate(editingProduct);
      setEditingProduct(null);
    }
  };

  const handleProductNameUpdate = (newName: string) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, name: newName });
    }
  };

  const handlePriceUpdate = (newPrice: number) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, price: newPrice });
    }
  };

  const handleStockUpdate = (newStock: number) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, stock: newStock });
    }
  };

  const handleAddDiscount = () => {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        discounts: [...editingProduct.discounts, newDiscount],
      });
      setNewDiscount({ quantity: 0, rate: 0 });
    }
  };

  const handleRemoveDiscount = (index: number) => {
    if (editingProduct) {
      const newDiscounts = editingProduct.discounts.filter(
        (_, i) => i !== index
      );
      setEditingProduct({ ...editingProduct, discounts: newDiscounts });
    }
  };

  return {
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
  };
};
