import axiosClient from "./axiosClient";


const getPromotionById = (id: string) =>
    axiosClient.get(
      `/promotions?filters[id][$eq]=${id}`
    );
    
  export default {
    getPromotionById
  };