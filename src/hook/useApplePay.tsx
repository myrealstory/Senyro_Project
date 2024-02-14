import { PAYMENT_METHOD } from "@/constants/checkout/payment";
import { useValidateApplepaySessionMutation } from "@/redux/api/orderCheckoutApi";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const paymentMethodSupportedNetworksMap: { [key: string]: string[] } = {
  [PAYMENT_METHOD.APPLE_PAY]: ["visa", "masterCard", "amex"],
  [PAYMENT_METHOD.APPLE_PAY_VM]: ["visa", "masterCard"],
  [PAYMENT_METHOD.APPLE_PAY_AMEX]: ["amex"],
};

export default function useApplePay() {
  const [validateApplepaySession] = useValidateApplepaySessionMutation();
  const { apiData } = useSelector((state: RootState) => state.cart);
  const { merchantName, merchantId, selectedPaymentMethodId } = useSelector((state: RootState) => state.orderCheckout);

  useEffect(() => {
    if (!(window.ApplePaySession && window.ApplePaySession.canMakePayments)) {
      // Check if the user has configured Apple Pay on their device
      return;
    }
    const applepayscript = document.createElement("script");
    applepayscript.src = "https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js";
    document.body.appendChild(applepayscript);

    return () => {
      document.body.removeChild(applepayscript);
    };
  }, []);

  function createRequest(merchantId: string, selectedPaymentMethod: string, payAmount: number) {
    return {
      countryCode: "HK",
      currencyCode: "HKD",
      supportedNetworks: paymentMethodSupportedNetworksMap[selectedPaymentMethod],
      merchantCapabilities: ["supports3DS"],
      total: {
        label: merchantId,
        amount: payAmount,
      },
    };
  }

  async function pay(
    processPayment: (token: string) => Promise<any>,
    merchantName: string,
    merchantId: string,
    selectedPaymentMethod: string,
    payAmount: number
  ) {
    if (!merchantName || !merchantId || !selectedPaymentMethod || !payAmount) return;

    const ApplePaySession = (window as any).ApplePaySession;

    if (!ApplePaySession) return;
    const request = createRequest(merchantId, selectedPaymentMethod, payAmount);
    const session = new ApplePaySession(3, request);

    session.onvalidatemerchant = async (event: any) => {
      const merchantSessionResponse = await validateApplepaySession({
        paymentMethodId: selectedPaymentMethod,
        merchantIdentifier: merchantId,
        appleUrl: event.validationURL,
        displayName: merchantName,
        domainName: (window as any).location.hostname,
      }).unwrap();
      session.completeMerchantValidation(merchantSessionResponse.data);
    };

    session.onpaymentauthorized = async (event: any) => {
      const token = event.payment;
      await processPayment(token.token);
      session.completePayment(ApplePaySession.STATUS_SUCCESS);
    };

    // start popup
    session.begin();
  }

  const applepay = useCallback(
    async (processPayment: (token: string) => Promise<any>) => {
      if (!merchantName || !merchantId || !selectedPaymentMethodId || !apiData.cart?.summary?.totalAmount) return;
      await pay(processPayment, merchantName, merchantId, selectedPaymentMethodId, +apiData.cart?.summary?.totalAmount);
    },
    [merchantName, merchantId, selectedPaymentMethodId, apiData]
  );

  return {
    applepay,
  };
}
