import axiosClient from "./axiosClient";

const createOrder = (data: unknown) => axiosClient.post("/orders", data);
const createOrderLine = (data: unknown) =>
  axiosClient.post("/order-lines", data);
const deleteOrder = (documentId: string) =>
  axiosClient.delete(`/orders/${encodeURIComponent(documentId)}`);

export default {
  createOrder,
  createOrderLine,
  deleteOrder,
};

