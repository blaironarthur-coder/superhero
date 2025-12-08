import { Request, Response } from "express";
import Hero from "../models/heroModel";

export async function listHeroes(req: Request, res: Response) {
  const {
    q,
    publisher,
    page = "1",
    limit = "12",
    sort = "name",
    min_intelligence,
    min_strength,
    min_speed,
    min_durability,
    min_power,
    min_combat
  } = req.query as Record<string, string>;

  const where: any = {};

  if (q) {
    where.$or = [
      { name: { $regex: q, $options: "i" } },
      { "biography.fullName": { $regex: q, $options: "i" } }
    ];
  }

  if (publisher) where["biography.publisher"] = publisher;

  const statsMap: Record<string, string> = {
    min_intelligence: "powerstats.intelligence",
    min_strength: "powerstats.strength",
    min_speed: "powerstats.speed",
    min_durability: "powerstats.durability",
    min_power: "powerstats.power",
    min_combat: "powerstats.combat"
  };

  for (const [key, path] of Object.entries(statsMap)) {
    const val = (req.query as any)[key];
    if (val) {
      where[path] = { $gte: Number(val) };
    }
  }

  const pageNum = Math.max(1, Number(page));
  const lim = Math.min(100, Math.max(1, Number(limit)));

  const cursor = Hero.find(where)
    .sort(sort as any)
    .skip((pageNum - 1) * lim)
    .limit(lim);

  const [items, total] = await Promise.all([
    cursor,
    Hero.countDocuments(where)
  ]);

  res.json({ items, total, page: pageNum, pages: Math.ceil(total / lim) });
}

export async function getHero(req: Request, res: Response) {
  const hero = await Hero.findById(req.params.id);
  if (!hero) return res.status(404).json({ error: "Hero not found" });
  res.json(hero);
}

export async function createHero(req: Request, res: Response) {
  try {
    const hero = await Hero.create(req.body);
    res.status(201).json(hero);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateHero(req: Request, res: Response) {
  const hero = await Hero.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  if (!hero) return res.status(404).json({ error: "Hero not found" });
  res.json(hero);
}

export async function deleteHero(req: Request, res: Response) {
  const hero = await Hero.findByIdAndDelete(req.params.id);
  if (!hero) return res.status(404).json({ error: "Hero not found" });
  res.json({ message: "Hero deleted successfully" });
}
