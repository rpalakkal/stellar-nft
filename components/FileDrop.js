import React, { useRef } from "react";
import { useFileDrop } from "../hooks/useFileDrop";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import {
  isDraggingState,
  currentStepState,
  modalState,
  nftInfoState,
} from "../recoil/atoms";

const FileDrop = (props) => {
  const inputFile = useRef(null);
  const isDragging = useRecoilValue(isDraggingState);
  const modalIsOpen = useRecoilValue(modalState);
  const setCurrentStep = useSetRecoilState(currentStepState);
  const [nftInfo, setNftInfo] = useRecoilState(nftInfoState);
  const onDrop = (event) => {
    if (modalIsOpen) return;
    setNftInfo({ ...nftInfo, file: event.dataTransfer.files[0] });
    setCurrentStep(1);
  };

  const onClick = () => {
    if (modalIsOpen) return;
    inputFile.current.click();
  };

  useFileDrop({ onDrop });

  return (
    <div
      className="flex justify-center h-full p-5 sm:p-2 text-center"
      onClick={onClick}
    >
      <input
        type="file"
        id="file"
        ref={inputFile}
        className="hidden"
        onChange={(event) => {
          setNftInfo({ ...nftInfo, file: event.target.files[0] });
          setCurrentStep(1);
        }}
      />
      <div className="cursor-default z-50">
        {isDragging && !modalIsOpen
          ? "Drop file anywhere!"
          : "Drag a file anywhere on the page or click here!"}
      </div>
      {isDragging && !modalIsOpen && (
        <div className="absolute z-40 inset-0 pointer-events-none opacity-40 bg-purple-400" />
      )}
    </div>
  );
};

export default FileDrop;
