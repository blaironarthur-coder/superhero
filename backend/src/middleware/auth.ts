import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";

export interface JwtPayload {
  id: string;
  username: string;
  role: "editor" | "admin";
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = header.split(" ")[1];
  const decoded = verifyJwt(token) as JwtPayload | null;

  if (!decoded) {
    return res.status(401).json({ error: "Invalid token" });
  }

  // @ts-ignore
  req.user = decoded;
  next();
}

export function roleMiddleware(roles: ("admin" | "editor")[] | "admin" | "editor") {
  const allowed = Array.isArray(roles) ? roles : [roles];

  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const user = req.user as JwtPayload | undefined;
    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!allowed.includes(user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
}
