import axiosClient from "./axiosClient";

const createOrder = (data: unknown) => axiosClient.post("/orders", data);
const createOrderLine = (data: unknown) =>
  axiosClient.post("/order-lines", data);
const getOrdersByUser = (userId: string) => axiosClient.get(`/orders?filters[userId][$eq]=${userId}&sort=createdAt:desc&pagination[page]=1&pagination[pageSize]=25`);
const getOrderByStripeSession = (stripeSessionId: string) => 
  axiosClient.get(`/orders?filters[stripeSessionId][$eq]=${stripeSessionId}&populate=*`);

export default {
  createOrder,
  createOrderLine,
  getOrdersByUser,
  getOrderByStripeSession,
};

