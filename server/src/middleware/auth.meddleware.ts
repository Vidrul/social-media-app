import tokenService, { IToken } from "../service/token.service";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user: IToken | null;
    }
  }
}

const authMeddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    // Bearer
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = tokenService.validateAccess(token);

    
    req.user = data;
    next();
  } catch (e) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMeddleware;
