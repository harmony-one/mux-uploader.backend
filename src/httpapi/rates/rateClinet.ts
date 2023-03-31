import axios from "axios";
import { config } from "../../config/config";

const axiosInstance = axios.create({
  baseURL: config.coinmarketcap.host,
  headers: {
    "X-CMC_PRO_API_KEY": config.coinmarketcap.key,
  },
});

export const rateClient = {
  loadONE: async () => {
    const response = await axiosInstance.get(
      "/v1/cryptocurrency/quotes/latest?symbol=ONE"
    );
    return response.data.data.ONE.quote.USD.price;
  },
};
