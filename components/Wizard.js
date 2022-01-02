import React from "react";
import Stepper from "./Stepper";
import FileDrop from "./FileDrop";
import NFTInfo from "./NFTInfo";
import Transaction from "./Transaction";
import Success from './Success'
import { useRecoilValue } from "recoil";
import { currentStepState, isTransactingState } from "../recoil/atoms";
const classNames = require("classnames");

const Wizard = (props) => {
  const currentStep = useRecoilValue(currentStepState);
  const isTransacting = useRecoilValue(isTransactingState);
  const steps = [<FileDrop />, <NFTInfo />, null, <Transaction />, <Success/>];
  const cardClass = classNames(
    "bg-white",
    "h-4/5 sm:h-4/5 md:h-3/5 lg:h-3/5 xl:h-1/2",
    "flex flex-col flex-shrink",
    "rounded-2xl",
    "border border-gray-300",
    "w-11/12 sm:w-3/4 md:w-2/3 lg:w-3/5 xl:w-3/5",
    {
        "animate-pulse": isTransacting
    }
  );

  return (
    <div className={cardClass}>
      <div className="p-10 s:p-2 m:p-4 lg:p-10 xl:p-10 flex-initial">
        <Stepper
          steps={[
            "Upload image",
            "NFT Info",
            "Create Transaction",
            "Submit Transaction",
            "Success!",
          ]}
        ></Stepper>
      </div>
      <div className="flex-auto">{steps[currentStep]}</div>
    </div>
  );
};

export default Wizard;
