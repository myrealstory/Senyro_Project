import React from "react";

import { AddOnType } from "@/types/pageTypes";
import { AddOnContent } from "@/components/product/AddOnContent";
import { AddOnListType } from "@/types/addOnTypes";

import { getAddOnListApi } from "../../api/getAddOnListApi";

export default async function Addon({ params: {lang} }: { params: AddOnType }) {
  const addOnListResponse = await getAddOnListApi({ lang });
  const addOnList: AddOnListType = addOnListResponse.status === 200 ? addOnListResponse.data: {
    promotionMessage: "",
    addonProducts: [],
  };
  return <AddOnContent addOnList={addOnList} lang={lang} />;
}
