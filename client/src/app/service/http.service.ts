import axios from "axios";
import authService from "./auth.service";
import localStorageService from "./localStorage.service";

const http = axios.create({
  baseURL: "http://localhost:8080/api/",
});

http.interceptors.request.use(
  async (config) => {
    const accessToken = localStorageService.getAccessToken();
    const expireDate = localStorageService.getExpireDate();
    const refreshToken = localStorageService.getRefreshToken();
    const isExpired = refreshToken && Number(expireDate) < Date.now();

    if (isExpired) {
      const data = await authService.tokens();
      localStorageService.setTokens(data);
    }

    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

const httpService = {
  get: http.get,
  post: http.post,
  update: http.put,
  remove: http.delete,
};

export default httpService;
