import jwt from "jsonwebtoken";
import { Token } from "../entities/Token";
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";

export interface IToken {
  _id: number;
  iat: number;
}

class TokenService {
  private accessTokenKey: string = "SUPRE_SECRET";
  private refreshTokenKey: string = "SUPRE_SECRET_2";
  private tokenRepository: Repository<Token> =
    AppDataSource.getRepository(Token);

  generate(payload: { _id: number | undefined }) {
    const accessToken = jwt.sign(payload, this.accessTokenKey, {
      expiresIn: "31d",
    });

    const refreshToken = jwt.sign(payload, this.refreshTokenKey);

    return { accessToken, refreshToken, expiresIn: 3600 };
  }

  async save(userId: number, refreshToken: string) {
    try {
      const data = await this.tokenRepository.findOne({
        relations: ["user"],
        where: {
          userId: userId,
        },
      });

      if (data) {
        data.refreshToken = refreshToken;
        return await this.tokenRepository.save(data);
      }

      const token = this.tokenRepository.create({
        userId,
        refreshToken,
      });

      this.tokenRepository.save(token);

      return token;
    } catch (error) {
      return null;
    }
  }

  validateRefresh(refreshToken: string) {
    try {
      const data = jwt.verify(refreshToken, this.refreshTokenKey) as IToken;
      return data;
    } catch (e) {
      return null;
    }
  }

  validateAccess(accessToken: string) {
    try {
      const data = jwt.verify(accessToken, this.accessTokenKey) as IToken;
      return data;
    } catch (e) {
      return null;
    }
  }

  async findToken(refreshToken: string) {
    try {
      return await AppDataSource.getRepository(Token).findOneBy({
        refreshToken,
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  isTokenInvalid(data: any, dbToken: any) {
    return !data || !dbToken || data._id !== dbToken?.userId;
  }
}

export default new TokenService();
