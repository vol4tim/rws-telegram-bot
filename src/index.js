import bot from "./bot";
import { validateAddress } from "@polkadot/util-crypto";
import rws from "./rws";
import User from "./models/user";
import db from "./models/db";

async function runApp() {
  bot.start((ctx) => {
    return ctx.reply(
      "Hello. For subscription send your address of Robonomics."
    );
  });
  bot.on("text", async (ctx) => {
    const user = await User.findOne({ where: { userId: ctx.from.id } });
    if (user) {
      return ctx.reply(`You already have a subscription`);
    }

    const address = ctx.message.text.trim();
    try {
      validateAddress(address);
    } catch (error) {
      console.log(error);
      return ctx.reply(error.message);
    }

    const isAddress = await User.findOne({ where: { address: address } });
    if (isAddress) {
      return ctx.reply(`You already have a subscription`);
    }

    try {
      const result = await rws(address);
      console.log(result);

      User.create({
        userId: ctx.from.id,
        username: ctx.from.username,
        address: address,
        block: result.blockNumber,
      });

      ctx.reply(`Ok`);
    } catch (error) {
      console.log(error);
      return ctx.reply(error.message);
    }
  });

  bot.launch();
}

db.sequelize.sync().then(() => {
  runApp();
});
