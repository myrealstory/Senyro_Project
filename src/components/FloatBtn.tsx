import React from "react";

interface FloatBtnProps {
  fixed?: boolean;
  bottom?: number;
  whiteBG?: boolean;
  selected?: number;
  mandatory?: number;
  amount?: number;
  addCart?: boolean;
  addOn?: boolean;
  finishCart?: boolean;
  id: number;
}

function FloatBtn({ fixed, bottom, whiteBG, addCart, }: FloatBtnProps) {

  const toogleCart = () => {
    //Todo
  };
  return (
    <div
      className={`${whiteBG ? "bg-white" : "bg-transparent"} ${
        fixed ? "fixed" : ""
      } bottom-[${bottom}] left-0 rounded-tl-3xl rounded-tr-3xl p-4`}
    >
      {addCart && (
        <button
          className={"w-full rounded-full bg-primaryGold text-xl font-bold text-white"}
          onClick={toogleCart}
        ></button>
      )}
    </div>
  );
}

export default FloatBtn;
