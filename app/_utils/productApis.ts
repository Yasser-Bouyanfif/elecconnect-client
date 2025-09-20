import axiosClient from "./axiosClient";

// Accept optional pagination and sorting, with sane defaults to preserve existing behavior
const getLatestProducts = (page?: number, pageSize?: number) => {
  const params = new URLSearchParams();
  params.set("populate", "*");
  // Strapi pagination
  if (page) params.set("pagination[page]", String(page));
  if (pageSize) params.set("pagination[pageSize]", String(pageSize));
  // Show latest first by default
  params.set("sort", "createdAt:desc");
  return axiosClient.get(`/products?${params.toString()}`);
};

const getProductById = (id: string) =>
  axiosClient.get(
    `/products?filters[id][$eq]=${id}&pagination[pageSize]=1&populate=*`
  );

export default {
  getLatestProducts,
  getProductById,
};
