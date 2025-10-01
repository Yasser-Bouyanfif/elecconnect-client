import axiosClient from "./axiosClient";

const createOrder = (data: unknown) => axiosClient.post("/orders", data);
const createOrderLine = (data: unknown) =>
  axiosClient.post("/order-lines", data);
const getOrdersByUser = (userId: string) => {
  const params = new URLSearchParams({
    "filters[userId][$eq]": userId,
    "populate[shippingAddress]": "true",
    "populate[billingAddress]": "true",
    "populate[shipping]": "true",
    sort: "createdAt:desc",
    "populate[order_lines][fields][0]": "quantity",
    "populate[order_lines][fields][1]": "unitPrice",
    "populate[order_lines][populate][product][fields][0]": "title",
  });

  return axiosClient.get(`/orders?${params.toString()}`);
};
const getOrderByStripeSession = (stripeSessionId: string) => {
  const params = new URLSearchParams({
    "filters[stripeSessionId][$eq]": stripeSessionId,
    "populate[shippingAddress]": "true",
    "populate[billingAddress]": "true",
    "populate[shipping]": "true",
    "populate[order_lines][fields][0]": "quantity",
    "populate[order_lines][fields][1]": "unitPrice",
    "populate[order_lines][populate][product][fields][0]": "title",
  });

  return axiosClient.get(`/orders?${params.toString()}`);
};

const orderApis = {
  createOrder,
  createOrderLine,
  getOrdersByUser,
  getOrderByStripeSession,
};

export default orderApis;

