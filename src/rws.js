import { encodeAddress } from "@polkadot/util-crypto";
import init from "./robonomics";

export async function add(address) {
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

function removeItem(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

export async function update(old, address) {
  const robonomics = await init();

  const result = await robonomics.rws.getDevices(
    robonomics.accountManager.account.address
  );
  let devices = result.map((item) => {
    return encodeAddress(item.toHuman(), 32);
  });

  const newAddress = encodeAddress(address, 32);
  if (!devices.includes(newAddress)) {
    devices = removeItem(devices, old);
    devices.push(newAddress);

    const tx = await robonomics.rws.setDevices(devices);
    const resultTx = await robonomics.accountManager.signAndSend(tx);
    return resultTx;
  }
  throw new Error("You already have a subscription");
}
