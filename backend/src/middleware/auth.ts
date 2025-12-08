import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  username: string;
  role: "user" | "editor" | "admin";
}

/**
 * Middleware d'authentification JWT
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    console.warn("🚫 Accès refusé : aucun token fourni");
    return res.status(401).json({ error: "No token provided" });
  }

  const token = header.split(" ")[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("❌ Missing JWT_SECRET");

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // @ts-ignore
    req.user = decoded;

    // 🧠 Log utile : on sait qui fait la requête
    console.log(
      `✅ Authentifié : ${decoded.username} (${decoded.role}) — ${req.method} ${req.originalUrl}`
    );

    next();
  } catch (err: any) {
    console.error("❌ Token invalide :", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
}

/**
 * Middleware de rôle : vérifie si l'utilisateur a les bons droits
 */
export function roleMiddleware(roles: ("admin" | "editor")[] | "admin" | "editor") {
  const allowed = Array.isArray(roles) ? roles : [roles];

  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const user = req.user;

    if (!user) {
      console.warn("⚠️ Tentative d'accès sans user (mauvais JWT ?)");
      return res.status(401).json({ error: "User not authenticated" });
    }

    // 🧠 Log du rôle et de la route
    console.log(
      `🔐 Vérification des droits : ${user.username} (${user.role}) → route ${req.originalUrl}`
    );

    if (!allowed.includes(user.role)) {
      console.warn(`🚫 Accès refusé à ${user.username} (rôle ${user.role})`);
      return res.status(403).json({ error: "Forbidden" });
    }

    console.log(`✅ Accès autorisé à ${user.username} (rôle ${user.role})`);
    next();
  };
}
