import axios from "axios";
import { API_KEY, API_URL } from "../lib/constants";

const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
    },
});

export default axiosClient