import mongoose, { Schema } from "mongoose";
const HeroSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String },
    powerstats: {
        intelligence: Number,
        strength: Number,
        speed: Number,
        durability: Number,
        power: Number,
        combat: Number,
    },
    biography: {
        fullName: String,
        alterEgos: String,
        aliases: [String],
        placeOfBirth: String,
        firstAppearance: String,
        publisher: String,
        alignment: String,
    },
    appearance: {
        gender: String,
        race: String,
        height: [String],
        weight: [String],
        eyeColor: String,
        hairColor: String,
    },
    work: {
        occupation: String,
        base: String,
    },
    connections: {
        groupAffiliation: String,
        relatives: String,
    },
    // 🆕 GRAND MANQUANT DU PROJET :
    images: {
        xs: String,
        sm: String,
        md: String,
        lg: String,
    },
    // fallback legacy
    image: String,
}, { timestamps: true });
export default mongoose.model("Hero", HeroSchema);
