import axiosClient from "./axiosClient";


const getPromotionById = (code: string) =>
    axiosClient.get(
      `/promotions?filters[code][$eq]=${code}`
    );
    
  export default {
    getPromotionById
  };