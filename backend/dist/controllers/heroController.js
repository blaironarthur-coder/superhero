import Hero from "../models/heroModel.js";
/**
 * Liste tous les héros (avec filtres avancés)
 */
export async function listHeroes(req, res) {
    const { q, publisher, page = "1", limit = "1000", sort = "name" } = req.query;
    // On construit un $and global pour pouvoir mixer texte + publisher + stats
    const and = [];
    // 🔎 Texte (nom ou nom complet)
    if (q) {
        and.push({
            $or: [
                { name: { $regex: q, $options: "i" } },
                { "biography.fullName": { $regex: q, $options: "i" } },
            ],
        });
    }
    // 🏢 Editeur
    if (publisher) {
        and.push({ "biography.publisher": publisher });
    }
    // 💪 Filtres par stats (robuste même si valeurs = "99" en string)
    const stats = ["strength", "speed", "intelligence", "durability", "power", "combat"];
    const exprAnd = [];
    for (const stat of stats) {
        const key = `min_${stat}`; // ex: min_intelligence
        const minVal = req.query[key];
        if (minVal !== undefined && minVal !== "") {
            exprAnd.push({
                $gte: [
                    // Convertit la valeur du doc en nombre; si null → -1
                    { $toDouble: { $ifNull: [`$powerstats.${stat}`, -1] } },
                    Number(minVal)
                ]
            });
        }
    }
    // Si on a des filtres de stats, on les ajoute via $expr
    if (exprAnd.length) {
        and.push({ $expr: { $and: exprAnd } });
    }
    // Si aucun critère n’a été ajouté, la requête = {} (tout)
    const where = and.length ? { $and: and } : {};
    // Pagination + tri
    const pageNum = Math.max(1, Number(page));
    const lim = Math.min(1000, Math.max(1, Number(limit)));
    // (optionnel) log de debug si besoin
    // console.log("REQ QUERY =", req.query);
    // console.log("WHERE =", JSON.stringify(where, null, 2));
    const cursor = Hero.find(where)
        .sort(sort)
        .skip((pageNum - 1) * lim)
        .limit(lim);
    const [items, total] = await Promise.all([cursor, Hero.countDocuments(where)]);
    res.json({ items, total, page: pageNum, pages: Math.ceil(total / lim) });
}
/**
 * Obtenir un héros par ID
 */
export async function getHero(req, res) {
    const hero = await Hero.findById(req.params.id);
    if (!hero)
        return res.status(404).json({ error: "Hero not found" });
    res.json(hero);
}
/**
 * Créer un nouveau héros (admin)
 */
export async function createHero(req, res) {
    try {
        const hero = await Hero.create(req.body);
        res.status(201).json(hero);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}
/**
 * Modifier un héros
 */
export async function updateHero(req, res) {
    const hero = await Hero.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (!hero)
        return res.status(404).json({ error: "Hero not found" });
    res.json(hero);
}
/**
 * Supprimer un héros
 */
export async function deleteHero(req, res) {
    const hero = await Hero.findByIdAndDelete(req.params.id);
    if (!hero)
        return res.status(404).json({ error: "Hero not found" });
    res.json({ message: "Hero deleted successfully" });
}
/**
 * Upload d'image locale
 */
export async function uploadHeroImage(req, res) {
    if (!req.file)
        return res.status(400).json({ error: "No file" });
    const hero = await Hero.findByIdAndUpdate(req.params.id, { $set: { "images.local": `/uploads/${req.file.filename}` } }, { new: true });
    if (!hero)
        return res.status(404).json({ error: "Not found" });
    res.json(hero);
}
