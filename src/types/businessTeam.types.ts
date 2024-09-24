import { IAssetData } from "./asset.types";
import { IProductPublicData } from "./product.types";
import { IBusinessTeamPublicThemeData } from "./businessTeamPublicTheme.types";
import { IProductPriceData } from "./product.types";
import {
  IProductVariantCategoryData,
  IProductVariantOptionData,
  IProductVariantSettingsData,
} from "./productVariant.types";

export type IBusinessTeamMemberPublicData = {
  _id: string;
  name: string;
  lastName: string;
  displayName: string;
  slug: string;
  published: boolean;
  businessTeam?: Omit<IBusinessTeamPublicData, "members">;
  image?: IAssetData;
  description?: string;
  theme?: IBusinessTeamPublicThemeData;
  // products: IProductPublicData[];
  products?: IProductWithVariantsAndPublicSettings[];
};

export type IBusinessTeamPublicData = {
  _id: string;
  name: string;
  shortDescription?: string;
  description?: string;
  logo?: IAssetData;
  connectedStripeAccount?: boolean;
  slug: string;
  published: boolean;
  showOpinions?: boolean;
  theme?: IBusinessTeamPublicThemeData;
  privacyPolicy?: {
    privacyType?: "empty" | "link" | "content";
    privacyLink?: string;
    privacyContent?: string;
  };
  termsAndConditions?: {
    //regulamin
    termsAndConditionsType?: "empty" | "link" | "content";
    termsAndConditionsLink?: string;
    termsAndConditionsContent?: string;
  };
  members?: IBusinessTeamMemberPublicData[];
  products?: IProductWithVariantsAndPublicSettings[];
};

export type IProductWithVariantsAndPublicSettings = {
  prices: IProductPriceData[];
  publicSettings?: {
    slug: string;
    published: boolean;
  };
  variants: ({
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
} & IProductPublicData;
