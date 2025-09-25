import axiosClient from "./axiosClient";

const createOrder = (data: unknown) => axiosClient.post("/orders", data);
const createOrderLine = (data: unknown) =>
  axiosClient.post("/order-lines", data);
const getOrdersByUser = (userId: string) => axiosClient.get(`/orders?filters[userId][$eq]=${userId}&populate[shippingAddress]=true&populate[billingAddress]=true&populate[shipping]=true&populate[order_lines][fields][0]=quantity&populate[order_lines][fields][1]=unitPrice&populate[order_lines][populate][product][fields][0]=title`);
const getOrderByStripeSession = (stripeSessionId: string) => 
  axiosClient.get(`/orders?filters[stripeSessionId][$eq]=${stripeSessionId}&populate=*`);

export default {
  createOrder,
  createOrderLine,
  getOrdersByUser,
  getOrderByStripeSession,
};

