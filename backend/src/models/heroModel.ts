import mongoose, { Schema, Document } from "mongoose";

export interface IHero extends Document {
  name: string;
  slug?: string;
  powerstats: {
    intelligence?: number;
    strength?: number;
    speed?: number;
    durability?: number;
    power?: number;
    combat?: number;
  };
  biography: any;
  appearance: any;
  work: any;
  connections: any;

  // 🆕 Champ images complet
  images?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
  };

  // Champ fallback
  image?: string;
}

const HeroSchema = new Schema<IHero>(
  {
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
  },
  { timestamps: true }
);

export default mongoose.model<IHero>("Hero", HeroSchema);
