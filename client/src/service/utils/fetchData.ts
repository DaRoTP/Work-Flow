import axios, { Method, AxiosResponse } from "axios";

export interface callAPIParams {
  url: string;
  method: Method;
  token?: boolean;
  payload?: any;
  setLoading: ((state: boolean) => void) | undefined;
}

export interface serviceParams {
  setLoading?: (state: boolean) => void;
}

function responseHandler<T>(response: AxiosResponse<T>) {
  return {
    data: response.data,
    error: null,
    status: response.status,
  };
}

const errorHandler = (error: any) => {
  return {
    data: null,
    error: error.response?.data,
    status: error.response?.status,
  };
};

const callAPI = async ({ url, method, token, payload, setLoading }: callAPIParams) => {
  let headers = {};
  if (!!token) headers = { Authorization: localStorage.getItem("token") };
  !!setLoading && setLoading(true);
  try {
    const res = await axios({ method, url: `/api${url}`, data: payload, headers });
    !!setLoading && setLoading(false);
    return responseHandler(res);
  } catch (error) {
    !!setLoading && setLoading(false);
    return errorHandler(error);
  }
};

async function callAPI2<T>({ url, method, token, payload, setLoading }: callAPIParams) {
  let headers = {};
  if (!!token) headers = { Authorization: localStorage.getItem("token") };
  !!setLoading && setLoading(true);
  try {
    const res = await axios({ method, url: `/api${url}`, data: payload, headers });
    !!setLoading && setLoading(false);
    return responseHandler<T>(res);
  } catch (error) {
    !!setLoading && setLoading(false);
    return errorHandler(error);
  }
}

export { callAPI2 };

export default callAPI;
