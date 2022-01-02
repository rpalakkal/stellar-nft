import React from "react";
import Check from "./icons/Check";
import { useRecoilState } from "recoil";
import { currentStepState } from "../recoil/atoms";
var classNames = require("classnames");

export const Step = (props) => {
  const stepClass = classNames(
    "flex",
    "items-center justify-center",
    "text-white text-sm font-bold",
    "rounded-full",
    "w-6 h-6",
    {
      "bg-gray-400": props.idx > props.active,
      "bg-purple-500": props.idx <= props.active,
    }
  );
  const stepContainerClass = classNames(
    "flex-1 items-center justify-center flex flex-col",
    {
      "cursor-pointer":
        props.idx <= props.active && props.active + 1 !== props.totalLength,
      "cursor-default": !(
        props.idx <= props.active && props.active + 1 !== props.totalLength
      ),
    }
  );
  const onClick = () => {
    if (props.idx <= props.active && props.active + 1 !== props.totalLength)
      props.onClick();
  };
  return (
    <div className={stepContainerClass} onClick={onClick}>
      <div className={stepClass}>
        {props.idx < props.active || props.active + 1 === props.totalLength ? (
          <Check className="fill-current text-white h-5 w-5" />
        ) : (
          props.idx + 1
        )}
      </div>
      <div className="p-1.5 text-xs text-center">{props.text}</div>
    </div>
  );
};

const Stepper = (props) => {
  const [currentStep, setCurrentStep] = useRecoilState(currentStepState);

  return (
    <div className="flex items-start w-full overflow-x-auto">
      {props.steps.map((step, idx) => {
        return (
          <React.Fragment key={idx}>
            <Step
              active={currentStep}
              idx={idx}
              text={step}
              onClick={() => setCurrentStep(idx)}
              totalLength={props.steps.length}
              key={idx}
            />
            {props.steps.length !== idx + 1 && (
              <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300 mt-3" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
