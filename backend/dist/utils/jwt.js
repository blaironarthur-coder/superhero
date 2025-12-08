import jwt from "jsonwebtoken";
export function signJwt(payload, expiresIn = "7d") {
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new Error("JWT_SECRET missing in .env");
    // cast nécessaire pour que TS accepte les valeurs string/number
    const options = { expiresIn: expiresIn };
    return jwt.sign(payload, secret, options);
}
export function verifyJwt(token) {
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new Error("JWT_SECRET missing in .env");
    return jwt.verify(token, secret);
}
