import axiosClient from "./axiosClient";

const getPromotionById = (code: string) => {
  const params = new URLSearchParams({
    "filters[code][$eq]": code,
  });

  return axiosClient.get(`/promotions?${params.toString()}`);
};

const promotionApi = {
  getPromotionById,
};

export default promotionApi;
