import { IAssetData } from "./asset.types";
import { IProductPublicData } from "./product.types";

export type IProductVariantSettingsData = {
  _id: string;
  product: IProductPublicData["_id"]; //_id produktu który jest wariantem
  variantParentProduct: IProductPublicData["_id"]; //variantParent
  variantOptions: IProductVariantOptionData["_id"]; //nie można dublować opcji z danej kategorii w 1 produkcie
  createdAt: Date;
  updatedAt: Date;
};

export type IProductVariantCategoryData = {
  _id: string;
  name: string; //np.kolor
  type: "businessTeamMember" | "time" | "color" | "size" | "package" | "other";
  product: IProductPublicData["_id"];
  order: number; //kolejność wyświetlania kategorii
  createdAt: Date;
  updatedAt: Date;
};

export type IProductVariantOptionData = {
  _id: string;
  name: string; //np.biały
  order: number; //kolejność wyświetlania opcji w danej kategorii
  variantCategory: IProductVariantCategoryData["_id"];
  businessTeamMember?: {
    _id: string;
    name: string;
    lastName: string;
    publicSettings?: {
      _id: string;
      image?: IAssetData;
    };
  };
  createdAt: Date;
  updatedAt: Date;
};

//variant settings
export type IProductVariantData = {
  variantOptions: ({
    variantCategory: IProductVariantCategoryData;
  } & Omit<IProductVariantOptionData, "variantCategory">)[];
} & Omit<IProductVariantSettingsData, "variantOptions">;
