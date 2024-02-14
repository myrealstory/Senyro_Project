"use client";

import { useMemo } from "react";

export const AmountBox = ({ amount, containerStyle }: { amount: number | undefined; containerStyle: string }) => {
  const totalItemCount = useMemo(() => {
    if (!amount) {
      return "0";
    }

    if (amount && amount > 99) {
      return "99+";
    }

    return amount;
  }, [amount]);

  return <span className={`amountBox ${containerStyle}`}>{totalItemCount}</span>;
};
