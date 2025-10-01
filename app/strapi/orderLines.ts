import axiosClient from "./axiosClient";

const getOrderLines = (orderNumber: string) => {
  const params = new URLSearchParams({
    "filters[order][orderNumber][$eq]": orderNumber,
    populate: "*",
  });

  return axiosClient.get(`/order-lines?${params.toString()}`);
};

const orderLinesApi = {
  getOrderLines,
};

export default orderLinesApi;
