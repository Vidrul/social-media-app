import { ITokens } from "../types/types";

const REFRESH_TOKEN = "REFRESH_TOKEN";
const ACCESS_TOKEN = "ACCESS_TOKEN";
const USER_ID = "USER_ID";
const EXPIRE_DATE = "EXPIRE_DATE";

function setTokens(payload: ITokens) {
  const isExpired = Date.now() + payload.expiresIn * 1000;

  localStorage.setItem(REFRESH_TOKEN, payload.refreshToken);
  localStorage.setItem(ACCESS_TOKEN, payload.accessToken);
  localStorage.setItem(USER_ID, payload.userId.toString());
  localStorage.setItem(EXPIRE_DATE, isExpired.toString());
}

function removeTokens() {
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(USER_ID);
  localStorage.removeItem(EXPIRE_DATE);
}

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN);
}
function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN);
}
function getUserId() {
  return localStorage.getItem(USER_ID);
}
function getExpireDate() {
  return localStorage.getItem(EXPIRE_DATE);
}

const localStorageService = {
  setTokens,
  removeTokens,
  getAccessToken,
  getRefreshToken,
  getUserId,
  getExpireDate,
};

export default localStorageService;
