import { Telegraf } from "telegraf";
import { TOKEN_BOT } from "./config";

const options = {};
const bot = new Telegraf(TOKEN_BOT, options);

export default bot;
