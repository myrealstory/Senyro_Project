import React from "react";
import EDM from "./component/EDM";
import { ServerSidePageType } from "@/types/pageTypes";

function page({ params: { lang } }: ServerSidePageType) {
  return (
    <div className="w-full bg-grey">
      <EDM lang={lang} />
    </div>
  );
}

export default page;
