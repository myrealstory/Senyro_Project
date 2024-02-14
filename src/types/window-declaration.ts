declare global {
  interface Window {
    ApplePaySession: Record<string, any>;
    GooglePaySession: Record<string, any>;
  }
}

export {};