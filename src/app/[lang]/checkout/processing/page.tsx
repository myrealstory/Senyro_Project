"use client";
import { LocaleKeysType } from "@/app/i18n";
import { FullScreenCheckoutLoader } from "@/components/checkout/FullScreenCheckoutLoader";
import { setTopBarErrorMessage } from "@/redux/slice/generalStateSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function CheckoutProcessing({ params }: { params: { lang: LocaleKeysType } }) {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setTopBarErrorMessage([]))
    }, [])

    return (
        <FullScreenCheckoutLoader needEnquirePaymentStatus={true} isLoading={true} lang={params.lang}/>
    )
}