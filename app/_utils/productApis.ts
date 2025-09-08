import axiosClient from "./axiosClient";

const getLatestProducts = () => axiosClient.get("/products?populate=*");

const getProductById = (id: string) =>
  axiosClient.get(
    `/products?filters[id][$eq]=${id}&pagination[pageSize]=1&populate=*`
  );

const getProductsByIds = (ids: (string | number)[]) =>
  axiosClient.get(
    `/products?filters[id][$in]=${ids.join(",")}&pagination[pageSize]=${ids.length}`
  );

export default {
  getLatestProducts,
  getProductById,
  getProductsByIds,
};
