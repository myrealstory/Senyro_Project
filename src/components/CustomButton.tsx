"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";

export interface CustomButtonType {
  containerClass?: string;
  textClass?: string;
  iconClass?: string;
  disabled?: boolean;
  onClick: () => void;
  // goldIcon?:string;
  // darkIcon?:string;
  inactive?: boolean;
  title?: string;
  textOnly?: boolean;
  secondary?: boolean;
  noBorder?: boolean;
  leftIcon?:StaticImageData;
  rightIcon?:StaticImageData;
  noHover?:boolean;
  form?:string;
}

function CustomButton({
  containerClass,
  textClass,
  iconClass,
  disabled,
  onClick,
  inactive,
  title,
  textOnly,
  secondary,
  noBorder,
  leftIcon,
  rightIcon,
  noHover,
  form,
}: CustomButtonType) {
  const [isHover, setIsHover] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };
  return (
    <button
      className={` mainButton
        ${
          secondary === undefined || secondary === false
            ? `mainStyle ${noHover? "noHover":""}` 
            : "secondaryStyle"
        }
        ${
          inactive ?
          "inactive" : ""
        }
        ${noBorder ? "noBorder" : ""}
        ${
          disabled ?
          "disable" : ""
        }
        ${textClass ? textClass : ""}
        ${containerClass}
         `}
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={!disabled ? handleMouseEnter : undefined}
      onMouseLeave={!disabled ? handleMouseLeave : undefined}
      onMouseDown={!disabled ? handleMouseLeave : undefined}
      onMouseUp={!disabled ? handleMouseEnter : undefined}
      disabled={disabled}
      type={form === undefined ? "button" : "submit"}
      form={form ?? undefined}
    >
      {leftIcon && (
        <Image
          src={leftIcon}
          alt="close"
          width={0}
          height={0}
          sizes="100vw"
          className={`object-cover ${iconClass} ${!leftIcon ? "h-0 w-0" : ""} ${isHover ? "invert " : ""} ${
            disabled && "saturate-[1000%] sepia "
          }`}
        />
      )}
      {(textOnly || title) && (
          title
      )}
      {rightIcon && (
        <Image
          src={rightIcon}
          alt="close"
          width={0}
          height={0}
          sizes="100vw"
          className={`object-contain ${iconClass} ${!rightIcon ? "h-0 w-0" : ""} ${isHover ? "invert " : ""} ${
            disabled && "saturate-[1000%] sepia "
          }`}
        />
      )}
    </button>
  );
}

export default CustomButton;
