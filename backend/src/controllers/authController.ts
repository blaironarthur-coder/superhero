import { Request, Response } from "express";
import User from "../models/userModel";
import { signJwt } from "../utils/jwt";

export async function register(req: Request, res: Response) {
  const { username, password, role } = req.body ?? {};
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "username and password are required" });
  }

  const exists = await User.findOne({ username });
  if (exists) {
    return res.status(409).json({ error: "Username already exists" });
  }

  const user = await User.create({
    username,
    password,
    role: role === "admin" ? "admin" : "editor"
  });

  return res.status(201).json({
    id: user._id,
    username: user.username,
    role: user.role
  });
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body ?? {};
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "username and password are required" });
  }

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signJwt({
    id: user._id.toString(),
    username: user.username,
    role: user.role
  });

  return res.json({
    token,
    user: { id: user._id, username: user.username, role: user.role }
  });
}

export async function me(req: Request, res: Response) {
  // @ts-ignore
  return res.json({ user: req.user });
}
