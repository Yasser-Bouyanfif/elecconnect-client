import axiosClient from "./axiosClient";

const getLatestProducts = () => axiosClient.get("/products?populate=*")
const getProductById = (id: string) => axiosClient.get(`/products?filters[id][$eq]=${id}&pagination[pageSize]=1&populate=*`)

export default {
    getLatestProducts,
    getProductById
}
    