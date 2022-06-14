import { Robonomics, AccountManager } from "robonomics-interface";
import { Keyring } from "@polkadot/keyring";
import { ENDPOINT, SECRET } from "./config";
import logger from "./logger";

let robonomics;

export default async function () {
  if (robonomics) {
    return robonomics;
  }

  robonomics = new Robonomics({
    endpoint: ENDPOINT,
  });
  robonomics.setAccountManager(
    new AccountManager(new Keyring({ type: "sr25519" }))
  );

  await robonomics.run();
  logger.info("Robonomics started");

  robonomics.accountManager.keyring.addFromUri(SECRET);
  AccountManager.setReady(true);
  const accounts = robonomics.accountManager.getAccounts();
  robonomics.accountManager.selectAccountByAddress(accounts[0].address);

  return robonomics;
}
