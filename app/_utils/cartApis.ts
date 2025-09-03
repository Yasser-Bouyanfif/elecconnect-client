import axiosClient from "./axiosClient";

type CartData = Record<string, unknown>;

const addToCart = (data: CartData) => axiosClient.post("/carts", { data });
const getCart = (email: string) =>
  axiosClient.get(`/carts?filters[email][$eq]=${email}&populate[products][populate]=banner`);

const cartApis = {
  addToCart,
  getCart,
};

export default cartApis;
