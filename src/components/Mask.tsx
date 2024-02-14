import React from "react";
import "@/style/popup/popup.scss";

type MaskType = {
  children: JSX.Element;
  closeAnimation?: boolean;
};
export default function Mask({ children, closeAnimation }: MaskType) {
  return <div id="popupMask" className={`${closeAnimation ? "fadeOut" : ""} popupMask `}>{children}</div>;
}
