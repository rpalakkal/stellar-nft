import React from "react";
import { useRecoilValue } from "recoil";
import { nftInfoState, stellarNetworkNameState } from "../recoil/atoms";
import { getIpfsURL } from "../utils/ipfs";
import { getSubmittedTxURL, getAssetURL } from "../utils/stellar";

const Success = (props) => {
  const nftInfo = useRecoilValue(nftInfoState);
  const network = useRecoilValue(stellarNetworkNameState);
  const txURL = getSubmittedTxURL(nftInfo.txId, network);
  const ipfsURL = getIpfsURL(nftInfo.ipfsHash);
  const assetURL = getAssetURL(
    nftInfo.account.publicKey(),
    nftInfo.name,
    network
  );

  return (
    <div className="flex flex-col justify-center text-center p-4">
      <div className="font-bold pb-4">
        Congratulations! You now have a newly-minted{" "}
        <a href={assetURL} target="_blank" className="p-1 border border-gray-400 bg-purple-300 hover:bg-purple-400 rounded">
          ${nftInfo.name}
        </a>{" "}
        NFT in your Stellar wallet!
      </div>

      <div className="p-2">
        Successful Transaction:{" "}
        <a href={txURL} target="_blank" className="underline">
          stellar.expert
        </a>
      </div>
      <div className="p-2">
        Your hosted file:{" "}
        <a href={ipfsURL} target="_blank" className="underline">
          IPFS
        </a>
      </div>
    </div>
  );
};

export default Success;
