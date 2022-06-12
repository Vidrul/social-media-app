import axios from "axios";
import { IPayloadLogin, IPayloadSignUp, ITokens } from "../types/types";

const httpAuth = axios.create({
  baseURL: "http://localhost:8080/api/auth/",
});

const authService = {
  signUp: async (payload: IPayloadSignUp): Promise<ITokens> => {
    try {
      const { data } = await httpAuth.post("signUp", payload);
      return data as ITokens;
    } catch (error: any) {
      throw error.response.data.error;
    }
  },
  login: async (payload: IPayloadLogin): Promise<ITokens> => {
    try {
      const { data } = await httpAuth.post("signInWithPassword", payload);
      return data as ITokens;
    } catch (error: any) {
      throw error.response.data.error;
    }
  },
  tokens: async (payload: string) => {},
};

export default authService;
