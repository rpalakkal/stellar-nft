const StellarSdk = require("stellar-sdk");
import { TransactionStellarUri } from "@stellarguard/stellar-uri";
import {getIpfsHash} from './ipfs'

const getFee = async (server) => {
  let fee;
  try {
    fee = await server.fetchBaseFee();
  } catch (error) {
    console.log(error);
    fee = 200;
  }
  return fee;
};

const getAccountBalance = async (publicKey, stellarInfo) => {
  try {
    const server = stellarInfo.server;
    const account = await server.loadAccount(publicKey);
    const stellarBalance = account.balances.find(
      (balance) => balance.asset_type == "native"
    );
    // console.log(stellarBalance.balance);
    return stellarBalance.balance;
  } catch (error) {
    console.log(error);
  }
};

const generateTransactionXDR = async (nftInfo, stellarInfo, userPublicKey) => {
  const publicKey = nftInfo.account.publicKey();
  const userAccount = await stellarInfo.server.loadAccount(userPublicKey);

  const amount = nftInfo.quantity * 0.0000001;
  const asset = new StellarSdk.Asset(nftInfo.name, publicKey);

  const fee = await getFee(stellarInfo.server);
  // console.log(userPublicKey, publicKey, asset, amount, fee);
  const transaction = new StellarSdk.TransactionBuilder(userAccount, {
    fee,
    networkPassphrase: stellarInfo.passphrase,
  })
    .addOperation(
      StellarSdk.Operation.createAccount({
        destination: publicKey,
        startingBalance: "2",
      })
    )
    .addOperation(
      StellarSdk.Operation.changeTrust({
        asset: asset,
        limit: amount.toString(),
      })
    )
    .setTimeout(300)
    .build()
    
    
    const uri = TransactionStellarUri.forTransaction(transaction, "testnet");
    uri.addReplacement({
      id: "SRC",
      path: "sourceAccount",
      hint: "source account",
    });
    uri.addReplacement({ id: "SEQ", path: "seqNum", hint: "sequence number" });
    // console.log(uri.toString())
  return transaction.toXDR();
};

const generateNFT = async (nftInfo, stellarInfo, recipientKey) => {
  const nftAccount = await stellarInfo.server.loadAccount(
    nftInfo.account.publicKey() 
  );
  const fee = await getFee(stellarInfo.server);
  const amount = nftInfo.quantity * 0.0000001;

  const asset = new StellarSdk.Asset(nftInfo.name, nftInfo.account.publicKey());

  const ipfsHash = await getIpfsHash(nftInfo.file);
  console.log(ipfsHash, "hi")

  const transaction = new StellarSdk.TransactionBuilder(nftAccount, {
    fee,
    networkPassphrase: stellarInfo.passphrase,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: recipientKey,
        asset,
        amount: amount.toString(),
      })
    )
    .addOperation(
      StellarSdk.Operation.setOptions({
        masterWeight: 0,
      })
    )
    .setTimeout(60)
    .build();

  transaction.sign(nftInfo.account);
  const transactionOutput = await stellarInfo.server.submitTransaction(
    transaction,
    { skipMemoRequiredCheck: true }
  );
  return {transactionOutput, ipfsHash};
};

const transactionToURI = (xdr) => {
  const tx = new StellarSdk.Transaction(
    xdr,

  );
  const uri = TransactionStellarUri.forTransaction(tx);
  uri.addReplacement({
    id: "SRC",
    path: "sourceAccount",
    hint: "source account",
  });
  uri.addReplacement({ id: "SEQ", path: "seqNum", hint: "sequence number" });
  return uri.toString();
};

const stellarExpertURL = "https://stellar.expert/explorer"
const getSubmittedTxURL = (id, network) => {
  return `${stellarExpertURL}/${network}/tx/${id}`
}
const getAssetURL = (publicKey, name, network) => {
  return `${stellarExpertURL}/${network}/asset/${name}-${publicKey}`
}

export { generateTransactionXDR, getAccountBalance, generateNFT, getSubmittedTxURL, getAssetURL };
