import mongoose, { Schema, Document } from "mongoose";

export interface IHero extends Document {
  name: string;
  slug?: string;
  powerstats?: {
    intelligence?: number;
    strength?: number;
    speed?: number;
    durability?: number;
    power?: number;
    combat?: number;
  };
  biography?: {
    fullName?: string;
    alterEgos?: string;
    aliases?: string[];
    placeOfBirth?: string;
    firstAppearance?: string;
    publisher?: string;
    alignment?: string;
  };
  appearance?: {
    gender?: string;
    race?: string;
    height?: string[];
    weight?: string[];
    eyeColor?: string;
    hairColor?: string;
  };
  work?: {
    occupation?: string;
    base?: string;
  };
  connections?: {
    groupAffiliation?: string;
    relatives?: string;
  };
  images?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
  };
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
      combat: Number
    },
    biography: {
      fullName: String,
      alterEgos: String,
      aliases: [String],
      placeOfBirth: String,
      firstAppearance: String,
      publisher: String,
      alignment: String
    },
    appearance: {
      gender: String,
      race: String,
      height: [String],
      weight: [String],
      eyeColor: String,
      hairColor: String
    },
    work: {
      occupation: String,
      base: String
    },
    connections: {
      groupAffiliation: String,
      relatives: String
    },
    images: {
      xs: String,
      sm: String,
      md: String,
      lg: String
    },
    image: String
  },
  { timestamps: true }
);

const Hero = mongoose.model<IHero>("Hero", HeroSchema);
export default Hero;
