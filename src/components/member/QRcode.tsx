"use client";

import { useQRCode } from "next-qrcode";

export const QRcode = ({
  qrCodeStr,
  qrSize,
  logoIcon,
  logoIconWidth,
  errorLevel,
  margin,
  scale,
}: {
  qrCodeStr?: string;
  qrSize?: number;
  logoIcon?: string;
  logoIconWidth?: number;
  errorLevel?: "L" | "M" | "Q" | "H";
  margin?: number;
  scale?: number;
}) => {
  const { Canvas } = useQRCode();
  const logo = logoIcon ? { src: logoIcon, options: { width: logoIconWidth } } : undefined;
  const options = {
    errorCorrectionLevel: errorLevel,
    margin: margin,
    scale: scale,
    width: qrSize,
  };
  return <>{qrCodeStr && qrCodeStr?.length > 0 && <Canvas text={qrCodeStr} logo={logo} options={options} />}</>;
};
