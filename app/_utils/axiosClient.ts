import axios from "axios";

const serverUrl = (process.env.NEXT_PUBLIC_SERVER_URL ?? "").replace(
  /^http:/,
  "https:"
);
const apiKey = process.env.REST_API_KEY;

const axiosClient = axios.create({
  baseURL: serverUrl ? `${serverUrl}/api` : undefined,
  headers: {
    "Content-Type": "application/json",
    ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
  },
});

export default axiosClient;
