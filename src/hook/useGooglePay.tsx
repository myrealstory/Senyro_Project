import { PAYMENT_METHOD } from "@/constants/checkout/payment";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const baseRequest = {
  environment: "PRODUCTION",
  apiVersion: 2,
  apiVersionMinor: 0,
};

const paymentMethodSupportedNetworksMap: { [key: string]: string[] } = {
  [PAYMENT_METHOD.GOOGLE_PAY]: ["VISA", "MASTERCARD", "AMEX"],
  [PAYMENT_METHOD.GOOGLE_PAY_VM]: ["VISA", "MASTERCARD"],
  [PAYMENT_METHOD.GOOGLE_PAY_AMEX]: ["AMEX"],
};

export default function useGooglePay() {
  const { apiData } = useSelector((state: RootState) => state.cart);
  const { merchantName, merchantId, gateway, gatewayMerchantId, selectedPaymentMethodId } = useSelector(
    (state: RootState) => state.orderCheckout
  );

  useEffect(() => {
    const googlepayscript = document.createElement("script");
    googlepayscript.src = "https://pay.google.com/gp/p/js/pay.js";
    document.body.appendChild(googlepayscript);

    (async () => {
      await Promise.all([new Promise(reslove => googlepayscript.addEventListener("load", () => reslove(0)))]);
      onGooglePayLoaded();
    })();

    return () => {
      document.body.removeChild(googlepayscript);
    };
  }, []);

  async function onGooglePayLoaded() {
    const client = new (window as any).google.payments.api.PaymentsClient({
      environment: "PRODUCTION",
      merchantInfo: {
        merchantId: merchantId,
        merchantName: merchantName,
      },
    });

    const readyToPayOptions = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: "CARD",
          parameters: {
            allowedAuthMethods: ["CRYPTOGRAM_3DS"],
            allowedCardNetworks: ["AMEX", "MASTERCARD", "VISA"],
          },
          tokenizationSpecification: {
            type: "PAYMENT_GATEWAY"
          },
        },
      ],
    };

    (window as any).GooglePayClient = client;
    (window as any).GooglePaySession = (await client.isReadyToPay(readyToPayOptions)).result;
  }

  function createRequest(
    merchantName: string,
    merchantId: string,
    gateway: string,
    gatewayMerchantId: string,
    selectedPaymentMethod: string,
    payAmount: number
  ) {
    const returnPayload = {
      ...baseRequest,
      allowedPaymentMethods: [
        {
          type: "CARD",
          parameters: {
            allowedAuthMethods: ["CRYPTOGRAM_3DS"],
            allowedCardNetworks: paymentMethodSupportedNetworksMap[selectedPaymentMethod],
          },
          tokenizationSpecification: {
            type: "PAYMENT_GATEWAY",
            parameters: {
              gateway,
              gatewayMerchantId,
            },
          },
        },
      ],
      transactionInfo: {
        countryCode: "HK",
        currencyCode: "HKD",
        totalPriceStatus: "FINAL",
        // set to cart total
        totalPrice: payAmount.toString(),
      },
      merchantInfo: {
        merchantId,
        merchantName,
      },
    };
    return returnPayload;
  }

  async function pay(
    processPayment: (token: string) => Promise<any>,
    merchantName: string,
    merchantId: string,
    gateway: string,
    gatewayMerchantId: string,
    selectedPaymentMethod: string,
    payAmount: number
  ) {
    const client = new (window as any).google.payments.api.PaymentsClient({
      environment: "PRODUCTION",
      merchantInfo: {
        merchantId,
        merchantName,
      },
    });

    const paymentDataRequest = createRequest(
      merchantName,
      merchantId,
      gateway,
      gatewayMerchantId,
      selectedPaymentMethod,
      payAmount
    );

    client.loadPaymentData(paymentDataRequest).then(async (paymentData: any) => {
      await processPayment(paymentData);
    });
  }

  const googlepay = useCallback(
    async (processPayment: (token: string) => Promise<any>) => {
      if ( !merchantName || !merchantId || !gateway || !gatewayMerchantId || !selectedPaymentMethodId || !apiData.cart?.summary?.totalAmount) return

      await pay(
        processPayment,
        merchantName,
        merchantId,
        gateway,
        gatewayMerchantId,
        selectedPaymentMethodId,
        +apiData.cart!.summary.totalAmount!
      );
    },
    [merchantName, merchantId, gateway, gatewayMerchantId, selectedPaymentMethodId, apiData]
  );

  return {
    googlepay,
  };
}
