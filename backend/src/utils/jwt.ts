import jwt from "jsonwebtoken";

const SECRET: string = process.env.JWT_SECRET || "SUPER_SECRET_KEY";

export function signJwt(payload: object, expiresIn: string = "7d"): string {
  return (jwt as any).sign(payload, SECRET, { expiresIn });
}

export function verifyJwt(token: string): any | null {
  try {
    return (jwt as any).verify(token, SECRET);
  } catch {
    return null;
  }
}
