import axios from "axios";

const apiKey = process.env.NEXT_PUBLIC_REST_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_REST_API_URL;

const axiosClient = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
    },
});

export default axiosClient
