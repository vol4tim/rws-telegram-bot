import { encodeAddress } from "@polkadot/util-crypto";
import init from "./robonomics";

export default async function (address) {
  const robonomics = await init();

  const result = await robonomics.rws.getDevices(
    robonomics.accountManager.account.address
  );
  const devices = result.map((item) => {
    return encodeAddress(item.toHuman(), 32);
  });

  const newAddress = encodeAddress(address, 32);
  if (!devices.includes(newAddress)) {
    devices.push(newAddress);

    const tx = await robonomics.rws.setDevices(devices);
    const resultTx = await robonomics.accountManager.signAndSend(tx);
    return resultTx;
  }
  throw new Error("You already have a subscription");
}
