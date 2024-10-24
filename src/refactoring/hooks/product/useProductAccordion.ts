import { useState } from "react";

export const useProductAccordion = () => {
  const [openProductIds, setOpenProductIds] = useState(new Set<string>());

  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prevIds) => {
      const newIds = new Set(prevIds);
      if (newIds.has(productId)) {
        newIds.delete(productId);
      } else {
        newIds.add(productId);
      }
      return newIds;
    });
  };

  return {
    openProductIds,
    toggleProductAccordion,
  };
};
