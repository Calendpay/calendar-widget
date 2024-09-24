import useSWR from "swr";
import { swrPublicFetcher } from "../utils/swrFetcher";
import { IProductPublicData } from "../types/product.types";

const businessTeamApiUrl = "api/v2/business-team-public";

export const getProduct = (businessTeamSlug: string, productSlug: string) => {
  const { data, isLoading, error } = useSWR<IProductPublicData>(
    `${businessTeamApiUrl}/${businessTeamSlug}/product/${productSlug}`,
    swrPublicFetcher
  );

  return {
    product: data,
    productLoading: isLoading,
    productError: error,
  };
};
