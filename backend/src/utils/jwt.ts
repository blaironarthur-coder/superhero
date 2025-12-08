import jwt, { SignOptions, Secret } from "jsonwebtoken";

export function signJwt(payload: object, expiresIn: string | number = "7d") {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing in .env");

  // cast nécessaire pour que TS accepte les valeurs string/number
  const options: SignOptions = { expiresIn: expiresIn as any };

  return jwt.sign(payload, secret as Secret, options);
}

export function verifyJwt<T = any>(token: string): T {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing in .env");
  return jwt.verify(token, secret as Secret) as T;
}
