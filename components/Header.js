import React, { useEffect, useState, useRef } from "react";
import {
  publicKeyState,
  stellarNetworkNameState,
  isTransactingState,
} from "../recoil/atoms";
import { stellarNetworkState } from "../recoil/selectors";
import {getAccountBalance} from "../utils/stellar"
import { useRecoilState, useRecoilValue } from "recoil";
import Dropdown from "./Dropdown";
import albedo from "@albedo-link/intent";

const Header = () => {
  const [publicKey, setPublicKey] = useRecoilState(publicKeyState);
  const [stellarNetworkName, setStellarNetworkName] = useRecoilState(
    stellarNetworkNameState
  );
  const stellarNetworkInfo = useRecoilValue(stellarNetworkState);
  const isTransacting = useRecoilValue(isTransactingState);
  const [accountBalance, setAccountBalance] = useState(null);
  const connectAccount = async () => {
    try {
      const res = await albedo.publicKey({ network: "testnet" });
      setPublicKey(res.pubkey);
    } catch {
      console.log("error");
    }
  };

  useEffect(async () => {
    const balance = await getAccountBalance(publicKey, stellarNetworkInfo);
    setAccountBalance(balance ? balance : "0.000");
  }, [publicKey, isTransacting, stellarNetworkName]);

  const publicKeyShortenedString =
    publicKey &&
    publicKey.substring(0, 4) +
      "..." +
      publicKey.substring(publicKey.length - 4, publicKey.length);

  const dropdownProps = {
    options: [
      {
        name: "testnet",
        onClick: () => setStellarNetworkName("testnet"),
        enabled: true,
      },
      {
        name: "public",
        onClick: () => setStellarNetworkName("public"),
        enabled: false,
      },
    ],
    text: stellarNetworkName,
  };

  return (
    <div className="flex w-full flex-wrap justify-between">
      <div className="flex items-center justify-center text-xl font-semibold px-2 m-2 text-center">
        🧙 Stellar NFT Wizard
      </div>
      <div className="flex px-2 justify-center">
        <div className="flex items-center text-xs">
          <Dropdown {...dropdownProps} />
        </div>

        <div className="flex text-sm items-center m-2 rounded-xl bg-gray-300 max-h-14 cursor-default">
          {accountBalance && (
            <div className="flex items-center px-1 pr-2 truncate">
              {accountBalance.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0] +
                " XLM"}
            </div>
          )}
          <div className="flex items-center">
            <button
              className="rounded-xl text-white bg-gray-500 hover:bg-gray-400 px-1 py-2 outline-none focus:outline-none"
              onClick={connectAccount}
            >
              {publicKey ? publicKeyShortenedString : "Connect account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
