import axiosInstance from "./axiosInstance";

export const swrPublicFetcher = async (
  url: string,
  headers = {},
  withCredentials = false
) => {
  const res = await axiosInstance.get(url, {
    headers,
    withCredentials,
  });
  return res.data;
};
