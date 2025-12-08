import { signJwt } from "../utils/jwt.js";
import User from "../models/userModel.js";
export async function register(req, res) {
    const { username, password, role } = req.body ?? {};
    if (!username || !password)
        return res.status(400).json({ error: "username and password are required" });
    const exists = await User.findOne({ username });
    if (exists)
        return res.status(409).json({ error: "Username already exists" });
    const user = await User.create({
        username,
        password,
        role: role === "admin" ? "admin" : "editor",
    });
    return res.status(201).json({
        id: user._id,
        username: user.username,
        role: user.role,
    });
}
export async function login(req, res) {
    const { username, password } = req.body ?? {};
    if (!username || !password)
        return res.status(400).json({ error: "username and password are required" });
    const user = await User.findOne({ username });
    if (!user)
        return res.status(401).json({ error: "Invalid credentials" });
    const ok = await user.comparePassword(password);
    if (!ok)
        return res.status(401).json({ error: "Invalid credentials" });
    const token = signJwt({
        id: user._id.toString(),
        username: user.username,
        role: user.role,
    });
    return res.json({
        token,
        user: { id: user._id, username: user.username, role: user.role },
    });
}
export async function me(req, res) {
    // @ts-ignore (user injecté par middleware)
    return res.json({ user: req.user });
}
