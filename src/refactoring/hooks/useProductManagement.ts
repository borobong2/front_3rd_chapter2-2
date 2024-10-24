import { useState } from "react";
import { Product } from "../../types";

export const useProductManagement = (
  onProductAdd: (product: Product) => void
) => {
  const [newProduct, setNewProduct] = useState<Product>({
    id: "",
    name: "",
    price: 0,
    stock: 0,
    discounts: [],
  });

  const handleAddNewProduct = () => {
    onProductAdd({ ...newProduct, id: Date.now().toString() });
    setNewProduct({ id: "", name: "", price: 0, stock: 0, discounts: [] });
  };

  return {
    newProduct,
    setNewProduct,
    handleAddNewProduct,
  };
};
