import React, { useState } from "react";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";
import { currentStepState, nftInfoState, publicKeyState} from "../recoil/atoms";
var classNames = require("classnames");

const NFTInfo = (props) => {
  const [name, setName] = useState("");
  const setStepState = useSetRecoilState(currentStepState);
  const [nftInfo, setNftInfo] = useRecoilState(nftInfoState);
  const publicKey = useRecoilState(publicKeyState)

  const onClick = async () => {
    setNftInfo({
        ... nftInfo,
        name: name
    })
    if(publicKey) setStepState(3);
    else setStepState(2);
  };

  const onChange = (event) => {
    setName(event.target.value);
  };

  const checkErrors = (name) => {
    if (name.length == 0) return false;
    if (name.length > 12) return true;
    if (!name.match(/^[0-9a-zA-Z]+$/)) return true;
    return false;
  };

  const getHelperText = () => {
    let errors = [];
    if (name.length == 0) return null;
    if (name.length > 12) errors.push("less than 12 characters");
    if (!name.match(/^[0-9a-zA-Z]+$/)) errors.push("alphanumeric");
    if (errors.length == 0) return null;
    return "Asset code must be " + errors.join(" and ");
  };

  const readyForNextStep = name.length != 0 && !checkErrors(name);

  const buttonClass = classNames("bg-gray-300", "rounded", "p-1", {
    "hover:bg-gray-400": readyForNextStep,
    "opacity-40": !readyForNextStep,
  });

  const inputClass = classNames(
    "flex-auto",
    "rounded-lg",
    "p-1",
    "border-2",
    "focus:outline-none",
    {
      "border-gray-200 focus:border-blue-600":
        readyForNextStep || name.length === 0,
      "border-red-700 focus:border-red-700":
        !readyForNextStep && name.length !== 0,
    }
  );

  return (
    <div className="flex flex-col justify-center px-20">
      <div className="font-bold py-3">Token Name</div>
      <div className="flex justify-end items-center space-x-3">
        <input className={inputClass} value={name} onChange={onChange} />
        <button
          className={buttonClass}
          onClick={onClick}
          disabled={!readyForNextStep}
        >
          Next
        </button>
      </div>
      <div className="py-2 text-red-700">{getHelperText()}</div>
    </div>
  );
};

export default NFTInfo;
