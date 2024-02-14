"use client";
import { LocaleKeysType } from "@/app/i18n";
import { FullScreenSaveCardLoader } from "@/components/member/FullScreenSaveCardLoader";

export default function AddCardProcessing({params}:{params:{siteOrderRefNo:string,lang: LocaleKeysType }}) {
    return (
        <FullScreenSaveCardLoader needEnquirePaymentStatus={true} isLoading={true} siteOrderRefNo={params.siteOrderRefNo} lang={params.lang}/>
    )
}