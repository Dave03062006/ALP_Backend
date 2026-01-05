import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY ?? "changeme";
export const GACHA_COST = process.env.GACHA_COST ? Number(process.env.GACHA_COST) : 10;

export default { PORT, JWT_SECRET_KEY, GACHA_COST };
