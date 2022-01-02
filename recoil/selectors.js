import { selector } from "recoil";
import { stellarNetworkNameState } from "./atoms";
const StellarSdk = require("stellar-sdk");

export const stellarNetworkState = selector({
  key: "stellarNetworkState",
  get: ({ get }) => {
    const network = get(stellarNetworkNameState);
    if (network === "public") {
      return {
        server: new StellarSdk.Server("https://horizon.stellar.org"),
        passphrase: StellarSdk.Networks.PUBLIC,
      };
    } else {
      return {
        server: new StellarSdk.Server("https://horizon-testnet.stellar.org"),
        passphrase: StellarSdk.Networks.TESTNET,
      };
    }
  },
});
