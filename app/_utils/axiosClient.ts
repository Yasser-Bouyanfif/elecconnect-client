import axios from "axios";

const apiKey = process.env.REST_API_KEY;
const apiUrl = process.env.REST_API_URL;

const axiosClient = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
  },
});

export default axiosClient;
