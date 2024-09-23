import { BASE_URL, URL_METHODS } from "./constant";
import request from "./request";

const getCurrencies = async () => {
  try {
    const response = await request({
      url: `${BASE_URL}currencies`,
      method: URL_METHODS.GET,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const postCurrency = async (data: {
  from: string;
  to: string;
  amount: number;
}) => {
  try {
    const response = await request({
      url: `${BASE_URL}convert`,
      method: URL_METHODS.POST,
      data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
const CurrencyConverterApi = {
  getCurrencies,
  postCurrency,
};
export default CurrencyConverterApi;
