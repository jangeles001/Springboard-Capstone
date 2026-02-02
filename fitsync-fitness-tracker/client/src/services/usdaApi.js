// services/usdaApi.js
import axios from "axios";

export const usdaApi = axios.create({
  baseURL: "https://api.nal.usda.gov",
  headers: {
    "Content-Type": "application/json",
  },
});