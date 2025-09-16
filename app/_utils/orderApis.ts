import axiosClient from "./axiosClient";

const createOrder = (data: unknown) => axiosClient.post("/orders", data);

export default {
  createOrder,
};

