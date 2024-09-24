import React, { useEffect, useState } from "react";

import {
  ICurrentProductVariantCategory,
  renderProductVariantsCategories,
} from "./helpers/renderProductVariantCategories";
import { IProductWithVariantsAndPublicSettings } from "../../../types/businessTeam.types";
import {
  IProductVariantCategoryData,
  IProductVariantOptionData,
} from "../../../types/productVariant.types";
import { twMerge } from "tailwind-merge";
import { IProductActiveVariant } from "../../../AppointmentContent";

type ISelectedVariantCategory = {
  option: Omit<IProductVariantOptionData, "variantCategory">;
} & IProductVariantCategoryData;

const ProductItemVariants = ({
  variants,
  activeVariant,
  setActiveVariant,
  variantPageSlug,
}: {
  variants: IProductWithVariantsAndPublicSettings["variants"];
  activeVariant: IProductActiveVariant | null;
  setActiveVariant: React.Dispatch<
    React.SetStateAction<IProductActiveVariant | null>
  >;
  variantPageSlug?: string;
}) => {
  const productVariantsCategories = renderProductVariantsCategories({
    variants,
  });
  const [selectedVariantCategories, setSelectedVariantCategories] =
    useState<ISelectedVariantCategory[]>();

  useEffect(() => {
    if (variantPageSlug && typeof variantPageSlug === "string") {
      //znajdz wariant

      const activeVariant = variants.find(
        (variant) => variant.product.publicSettings.slug === variantPageSlug
      );

      if (activeVariant) {
        //change selected variant categories

        const newSelectedVariantCategories: ISelectedVariantCategory[] =
          activeVariant.variantOptions.map((option) => ({
            _id: option.variantCategory._id,
            name: option.variantCategory.name,
            order: option.variantCategory.order,
            createdAt: option.variantCategory.createdAt,
            updatedAt: option.variantCategory.updatedAt,
            type: option.variantCategory.type,
            product: option.variantCategory.product,
            option: {
              _id: option._id,
              name: option.name,
              order: option.order,
              businessTeamMember: option.businessTeamMember,
              createdAt: option.createdAt,
              updatedAt: option.updatedAt,
            },
          }));

        return setSelectedVariantCategories(newSelectedVariantCategories);

        // return setCurrentVariant(activeVariant);
      }
    }

    // //ustaw domyślny wariant
    // const defaultVariant = sortedVariants[0];
    // const defaultVariantCategories =
    //   defaultVariant.fields.variantCategories.map((variantCategory) => ({
    //     order: variantCategory.fields.order,
    //     option: {
    //       sys: {
    //         id: variantCategory.sys.id,
    //       },
    //       fields: {
    //         order: variantCategory.fields.order,
    //         name: variantCategory.fields.name,
    //       },
    //     },
    //   }));
    // return setSelectedVariantCategories(defaultVariantCategories);
  }, [variantPageSlug]);

  useEffect(() => {
    if (selectedVariantCategories && selectedVariantCategories.length > 0) {
      // znajdź wariant według kategorii
      const newActiveVariant = variants.find((variant) => {
        //każda z opcji wariantu musi się znajdować w selectedVariantCategory
        const allVariantCategoriesSelected = variant.variantOptions.every(
          (variantOption) => {
            const variantOptionInSelectedCategories =
              selectedVariantCategories.find(
                (selectedVariantCategory) =>
                  selectedVariantCategory.option._id === variantOption._id
              );

            if (variantOptionInSelectedCategories) return true;

            return false;
          }
        );

        return allVariantCategoriesSelected;
      });

      // jeśli znaleziono -> zmien active wariant
      if (newActiveVariant) {
        return setActiveVariant(newActiveVariant);
      }

      // jeśli nie znaleziono i jest już dodany active variant -> zmień na null
      if (!newActiveVariant && activeVariant) {
        return setActiveVariant(null);
      }
    }
  }, [selectedVariantCategories]);

  const activeOption = (
    categoryRowOption: ISelectedVariantCategory["option"]
  ) => {
    const active = selectedVariantCategories?.some(
      (variantCategory) => variantCategory.option._id === categoryRowOption._id
    );

    return active;
  };

  const disabledVariantOption = (
    option: ISelectedVariantCategory["option"],
    categoryOrder: number
  ) => {
    if (categoryOrder === 1) return false; //opcje z 1 rzędu są dostępne

    //jeśli selected options nie zawierają opcji z mniejszym orderem które są wymagane w wariancie zwróć true
    const variantAvailable = variants.every((variant) => {
      //znajdź wszytskie które zawierają tą opcje np. standard

      const correctVariantOptions = variant.variantOptions.filter(
        (variantOption) => variantOption._id === option._id
      );

      if (!correctVariantOptions || correctVariantOptions.length < 1) {
        return true; //niedostępne
      }

      //sprawdź czy w tym wariancie znajdują się mniejsze ordery
      const variantBeforeOrders = variant.variantOptions.filter(
        (option) => option.variantCategory.order < categoryOrder
      );

      if (!variantBeforeOrders || variantBeforeOrders.length < 1) return false; //dostępne

      //dla każdego mniejszego orderu sprawdź czy jego name znajduje się w selected options -> jesli nie zwróc disabled

      const available = variantBeforeOrders.every((variantOption) => {
        const isSame = selectedVariantCategories?.find(
          (selectedCategory) =>
            selectedCategory.option._id === variantOption._id
        );

        return isSame;
      });

      // console.log({ option: categoryRowOption.fields.name, available });

      if (!available) return true;
    });

    return variantAvailable;
  };

  const disabledAllVariantOptions = ({
    options,
    categoryOrder,
  }: {
    options: ISelectedVariantCategory["option"][];
    categoryOrder: number;
  }) => {
    const disabledAll = options.every((option) =>
      disabledVariantOption(option, categoryOrder)
    );

    return disabledAll;
  }; //correct

  const changeCategories = ({
    option,
    category,
  }: {
    option: ISelectedVariantCategory["option"];
    category: ICurrentProductVariantCategory;
  }) => {
    if (selectedVariantCategories && selectedVariantCategories.length > 0) {
      const newCategories = selectedVariantCategories?.filter(
        (selectedVariantCategory) =>
          selectedVariantCategory.order !== category.order
      );

      setSelectedVariantCategories([...newCategories, { ...category, option }]);
    }

    if (!selectedVariantCategories || selectedVariantCategories.length < 1) {
      //jeśli nie zaznaczono dodaj selected variant category dla danego rzędu: np. rząd 1 - Natalia
      setSelectedVariantCategories([{ ...category, option }]);
    }
  };

  return (
    <div className="w-full flex items-start justify-start flex-col gap-2">
      {/* wyświetlić kategorie */}
      {productVariantsCategories?.map((variantCategory) => (
        <div
          key={variantCategory._id}
          className="w-full flex items-start justify-start flex-col gap-1"
        >
          {!disabledAllVariantOptions({
            options: variantCategory.options,
            categoryOrder: variantCategory.order,
          }) && (
            <p className="text-xs font-normal text-slate-500">
              {variantCategory.name}
            </p>
          )}

          <div className="flex items-start justify-start w-full gap-1 flex-wrap">
            {variantCategory.options.map((option) => (
              <div
                className={twMerge(
                  `flex items-center justify-start gap-2 p-2 border border-slate-200 bg-slate-50 rounded-md text-blue-950 text-sm cursor-pointer hover:opacity-70 ${
                    activeOption(option) &&
                    "bg-lime-50/50 text-lime-600 border-lime-200"
                  } ${
                    disabledVariantOption(option, variantCategory.order) &&
                    "hidden"
                  }`
                )}
                key={option._id}
                onClick={() =>
                  changeCategories({
                    option,
                    category: variantCategory,
                  })
                }
              >
                {option?.businessTeamMember?.publicSettings?.image && (
                  <img
                    width={50}
                    height={50}
                    src={option.businessTeamMember.publicSettings.image.url}
                    alt={option.name}
                    className="w-5 h-5 rounded-full aspect-square object-cover bg-white"
                  />
                )}
                {option.name}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductItemVariants;
