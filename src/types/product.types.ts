import { IAssetData } from "./asset.types";
import {
  IBusinessTeamMemberPublicData,
  IBusinessTeamPublicData,
} from "./businessTeam.types";
import { IBusinessTeamPublicThemeData } from "./businessTeamPublicTheme.types";

import {
  IProductVariantCategoryData,
  IProductVariantData,
  IProductVariantOptionData,
  IProductVariantSettingsData,
} from "./productVariant.types";

export type IProductPriceData = {
  amount: number;
  saleAmount?: number;
  currency: "PLN" | "EUR" | "USD" | "GBP";
  promotionsCanBeCombined: boolean;
};

export type IProductPublicData = {
  _id: string;
  name: string;
  shortDescription?: string;
  description?: string; //markdown
  image?: IAssetData;
  type: "appointment" | "product" | "online_product";
  suggestedProducts?: {
    _id: string;
    name: string;
    type: "appointment" | "product" | "online_product";
    image?: IAssetData;
  }[];

  businessTeamMember?: {
    publicSettingsId: string;
  } & Omit<
    IBusinessTeamMemberPublicData,
    "products" | "businessTeam" | "theme"
  >;
  businessTeam?: Omit<IBusinessTeamPublicData, "members" | "theme">;
  price: IProductPriceData;

  appointmentSettings: {
    duration: number;
    prepareHours?: number;
  };

  publicSettings: {
    slug: string;
    published: boolean;
    theme: IBusinessTeamPublicThemeData;
    displayAllVariants?: boolean;
  };

  variant?: IProductVariant;
};

type IProductVariant = {
  isVariant: boolean;
  settings: IProductVariantData;
  parentProduct: {
    _id: string;
    name: string;
    shortDescription?: string;
    description?: string; //markdown
    image?: IAssetData;
    type: "appointment" | "product" | "online_product";
  };
  // parentProductAllVariants?: Omit<IProductPublicData, "variant">[]; //dodać kategorie i opcje
  parentProductAllVariants?: ({
    product: {
      businessTeamMember?: string;
      publicSettings: {
        slug: string;
        published: boolean;
      };
    } & Omit<IProductPublicData, "businessTeamMember">;
    variantOptions: ({
      variantCategory: IProductVariantCategoryData;
    } & Omit<IProductVariantOptionData, "variantCategory">)[];
  } & Omit<IProductVariantSettingsData, "variantOptions" | "product">)[];
};
