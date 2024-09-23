import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

interface RequestOptions extends AxiosRequestConfig {
  // You can extend this interface with additional properties if needed
}

const request = async function (options: RequestOptions): Promise<any> {
  const onSuccess = function (response: AxiosResponse<any>): any {
    return response.data;
  };

  const onError = function (err: any): Promise<any> {
    if (err.response) {
      if (
        err.response.status === 401 ||
        err.response.status === 431 ||
        err.response.status === 500
      ) {
        console.error("Data:", err);
      }
      // Request was made but server responded with something other than 2xx
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
      console.error("Headers:", err.response.headers);
    } else {
      // Something else happened while setting up the request triggered the error
      console.error("Error Message:", err.message);
    }
    return Promise.reject(err.response?.data || err.message);
  };

  // Get the token from Zustand store

  const client = axios.create({
    headers: {
      pragma: "no-cache",
    },
  });

  return client(options).then(onSuccess).catch(onError);
};

export default request;
