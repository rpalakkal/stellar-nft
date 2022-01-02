//from https://www.creative-tim.com/learning-lab/tailwind-starter-kit/documentation/react/dropdown
import React, { useState, createRef } from "react";
import Popper from "popper.js";
import useClickOutside from "../hooks/useClickOutside";
import ChevronDown from "./icons/ChevronDown"
const classNames = require("classnames");

const Dropdown = (props) => {
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const btnDropdownRef = createRef();
  const popoverDropdownRef = createRef();
  const openDropdownPopover = () => {
    new Popper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-end",
    });
    setDropdownPopoverShow(true);
  };

  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  useClickOutside(popoverDropdownRef, closeDropdownPopover);

  const dropdownClass = classNames(
    "flex flex-col text-base z-50 rounded-xl mt-2 border bg-gray-50 border-gray-300 shadow-xl text-center",
    {
      block: dropdownPopoverShow,
      hidden: !dropdownPopoverShow,
    }
  );

  const chevronClass = classNames(
    "h-4 w-4 fill-current transform transition duration-300", {
        "rotate-180": dropdownPopoverShow
    }
  )

  return (
    <div className="relative inline-flex align-middle w-full">
      <button
        className="text-sm flex items-center p-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 outline-none focus:outline-none border border-gray-300"
        type="button"
        ref={btnDropdownRef}
        onClick={() => {
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        {props.text} <ChevronDown className={chevronClass}/>
      </button>
      <div ref={popoverDropdownRef} className={dropdownClass}>
        {props.options.map((option, idx) => {
          return (
            <a
              className={classNames(
                "text-sm py-2 px-1.5 font-normal block w-full whitespace-no-wrap text-gray-800 border-b",
                {
                  "opacity-40": !option.enabled,
                  "cursor-pointer": option.enabled,
                }
              )}
              onClick={(e) => {
                e.preventDefault();
                if(option.enabled) option.onClick();
                closeDropdownPopover();
              }}
              key={idx}
            >
              {option.name}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default Dropdown;
