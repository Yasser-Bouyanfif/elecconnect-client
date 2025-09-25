import axiosClient from "./axiosClient";

const getOrderLines = (orderNumber: string) => 
    axiosClient.get(`/order-lines?filters[order][orderNumber][$eq]=${orderNumber}&populate=*`);