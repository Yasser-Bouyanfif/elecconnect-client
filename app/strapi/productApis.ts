import axiosClient from "./axiosClient";

type PaginationOptions = {
  page?: number;
  pageSize?: number;
};

const MAX_PAGE_SIZE = 6;

const getProductsPagination = (
  { page = 1, pageSize = MAX_PAGE_SIZE }: PaginationOptions = {}
) => {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const boundedPageSize = Number.isFinite(pageSize) && pageSize > 0
    ? Math.min(Math.floor(pageSize), MAX_PAGE_SIZE)
    : MAX_PAGE_SIZE;

  const params = new URLSearchParams({
    "pagination[page]": String(safePage),
    "pagination[pageSize]": String(boundedPageSize),
    "sort[0]": "id:desc",
    populate: "*",
  });

  return axiosClient.get(`/products?${params.toString()}`);
};

const getProductById = (id: string) =>
  axiosClient.get(
    `/products?filters[id][$eq]=${id}&pagination[pageSize]=1&populate=*`
  );

const getProducts = () => 
  axiosClient.get(`/products?populate=*&sort[0]=id:desc`);

export default {
  getProductsPagination,
  getProductById,
  getProducts
};
