import bot from "./bot";
import { validateAddress } from "@polkadot/util-crypto";
import * as rws from "./rws";
import User from "./models/user";
import db from "./models/db";
import logger from "./logger";

async function runApp() {
  bot.start((ctx) => {
    return ctx.replyWithHTML(
      "Welcome to Robonomics Workshop! Please insert your Robonomics Parachain address, you can find correct address format <a href='https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frobonomics.api.onfinality.io%2Fpublic-ws#/accounts'>on substrate portal connected to Robonomics parachain public node</a>."
    );
  });
  bot.on("text", async (ctx) => {
    const address = ctx.message.text.trim();
    try {
      validateAddress(address);
    } catch (error) {
      logger.error("validateAddress", error);
      return ctx.replyWithHTML(
        "Wrong address format. Please find your correct parachain address <a href='https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frobonomics.api.onfinality.io%2Fpublic-ws#/accounts'>on substrate portal connected to Robonomics parachain public node</a>"
      );
    }

    const isAddress = await User.findOne({ where: { address: address } });
    if (isAddress) {
      return ctx.reply(`You already have a subscription`);
    }

    const user = await User.findOne({ where: { userId: ctx.from.id } });
    if (user) {
      // return ctx.reply(`You already have a subscription`);

      try {
        const result = await rws.update(user.address, address);
        logger.info("result", result);

        user.update({
          address: address,
          block: result.blockNumber,
        });

        ctx.replyWithHTML(
          `Your current address ${address} was successfully added to subscription! Please <a href='https://dapp.robonomics.network/#/lights-up'>go to Lights up (d)app</a>`
        );
      } catch (error) {
        logger.error("save", error);
        return ctx.reply(error.message);
      }
    } else {
      try {
        const result = await rws.add(address);
        logger.info("result", result);

        User.create({
          userId: ctx.from.id,
          username: ctx.from.username,
          address: address,
          block: result.blockNumber,
        });

        ctx.replyWithHTML(
          `Address ${address} was successfully added to subscription! Please <a href='https://dapp.robonomics.network/#/lights-up'>go to Lights up (d)app</a>`
        );
      } catch (error) {
        logger.error("save", error);
        return ctx.reply(error.message);
      }
    }
  });

  bot.launch();
}

db.sequelize.sync().then(() => {
  runApp();
});
