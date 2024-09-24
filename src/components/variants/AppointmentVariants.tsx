import React from "react";
import { IProductPublicData } from "../../types/product.types";
import { IProductActiveVariant } from "../../AppointmentContent";
import ProductItemVariants from "../productItem/variants/ProductVariantWithCategories";

const AppointmentVariants = ({
  product,
  activeVariant,
  setActiveVariant,
}: {
  product: IProductPublicData;
  activeVariant: IProductActiveVariant | null;
  setActiveVariant: React.Dispatch<
    React.SetStateAction<IProductActiveVariant | null>
  >;
}) => {
  if (
    !product.publicSettings.displayAllVariants ||
    !product.variant?.parentProductAllVariants ||
    product.variant.parentProductAllVariants.length < 1
  )
    return null;
  return (
    <div
      className="flex items-start justify-start flex-col gap-2 border-2 p-4 rounded-lg w-full md:max-w-60"
      style={{
        backgroundColor:
          product.publicSettings.theme?.backgroundColor || "#fafafa",
        borderColor: product.publicSettings.theme?.borderColor || "#f1f5f9",
      }}
    >
      <h2 className="text-lg font-bold text-blue-950 mb-3">
        Dostępne Warianty
      </h2>
      <ProductItemVariants
        variants={product.variant.parentProductAllVariants}
        activeVariant={activeVariant}
        setActiveVariant={setActiveVariant}
        variantPageSlug={product.publicSettings.slug}
      />
    </div>
  );
};

export default AppointmentVariants;
