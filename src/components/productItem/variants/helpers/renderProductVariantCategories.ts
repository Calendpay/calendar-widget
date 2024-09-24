import { IProductWithVariantsAndPublicSettings } from "../../../../types/businessTeam.types";
import {
  IProductVariantCategoryData,
  IProductVariantOptionData,
} from "../../../../types/productVariant.types";

export type ICurrentProductVariantCategory = {
  options: Omit<IProductVariantOptionData, "variantCategory">[];
} & IProductVariantCategoryData;

export const renderProductVariantsCategories = ({
  variants,
}: {
  variants: IProductWithVariantsAndPublicSettings["variants"];
}) => {
  const currentProductVariantCategories: ICurrentProductVariantCategory[] = []; //np. [{order:1, options:[{order:1, name: "Natalia"}, order:1, name: "Michalina"]}]

  variants.map((variant) => {
    variant.variantOptions?.map((variantOption) => {
      const currentProductCategory = currentProductVariantCategories.find(
        (productCategory) =>
          productCategory.order === variantOption.variantCategory.order
      );

      //jeśli nie znaleziono kategorii -> dodaj kategorie z opcją
      //jeśli znaleziono kategorie -> dodaj opcje do tej kategorii jeśli nie jest jeszcze dodana

      if (currentProductCategory) {
        const currentOptionInCategory = currentProductCategory.options.find(
          (option) => option._id === variantOption._id
        );

        if (!currentOptionInCategory) {
          //dodaj opcje do tej kategorii
          currentProductCategory.options.push({
            _id: variantOption._id,
            name: variantOption.name,
            order: variantOption.order,
            businessTeamMember: variantOption.businessTeamMember,
            createdAt: variantOption.createdAt,
            updatedAt: variantOption.updatedAt,
          });
        }
      } else {
        //dodaj rząd z tą opcją
        currentProductVariantCategories.push({
          ...variantOption.variantCategory,
          options: [
            {
              _id: variantOption._id,
              name: variantOption.name,
              order: variantOption.order,
              businessTeamMember: variantOption.businessTeamMember,
              createdAt: variantOption.createdAt,
              updatedAt: variantOption.updatedAt,
            },
          ],
        });
      }
    });
  });

  return currentProductVariantCategories;
};
