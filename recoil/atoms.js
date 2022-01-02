import { atom } from "recoil";
const StellarSdk = require("stellar-sdk");

export const currentStepState = atom({
  key: "currentStep",
  default: 0,
});

export const isDraggingState = atom({
  key: "isDragging",
  default: false,
});

export const stellarNetworkNameState = atom({
  key: "stellar",
  default: "testnet"
});

export const nftInfoState = atom({
  key: "nftInfo",
  default: {
    account: StellarSdk.Keypair.random(),
    quantity: 1,
    name: "",
    file:null,
    ipfsHash:null,
    txId:null
  },
});

const localStorageEffect = (key) => ({ setSelf, onSet }) => {
  if (typeof window === "undefined") return;
  const savedValue = localStorage.getItem(key);
  if (savedValue != null) {
    setSelf(savedValue);
  }

  onSet((newValue) => {
    if (newValue === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, newValue);
    }
  });
};

export const publicKeyState = atom({
  key: "publicKey",
  default: null,
  effects_UNSTABLE: [localStorageEffect("stellarPublicKey")],
});

export const isTransactingState = atom({
  key: "isTransacting",
  default: false,
});

export const modalState = atom({
  key: "modalIsOpen",
  default: false,
});