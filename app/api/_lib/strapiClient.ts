import axios from "axios";
import { API_KEY, API_URL } from "@/app/lib/constants";

const strapiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: API_KEY ? `Bearer ${API_KEY}` : undefined,
  },
});

export default strapiClient;
