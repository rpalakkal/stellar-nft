var StellarSdk = require("stellar-sdk");

export const useTransactionStream = (publicKey, stellarInfo, callback) => {
  stellarInfo.server
    .transactions()
    .forAccount(publicKey)
    .cursor("now")
    .stream({ onmessage: callback });
};
