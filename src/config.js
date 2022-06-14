import path from "path";
require("dotenv").config({ path: process.env.DOTENV_CONFIG_PATH });

export const PATH_DB = path.join(__dirname, "../files/database.sqlite");
export const TOKEN_BOT = process.env.TOKEN_BOT;
export const ENDPOINT = process.env.ENDPOINT;
export const SECRET = process.env.SECRET;
