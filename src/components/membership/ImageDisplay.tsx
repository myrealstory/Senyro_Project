import Image from "next/image";
import { StaticImageData } from "next/dist/shared/lib/get-img-props";

interface ImageDisplayProps {
  imageSrc: StaticImageData;
  width?: number | `${number}`;
  height?: number | `${number}`;
  alt: string;
  style?: string;
}

export const ImageDisplay = ({ imageSrc, alt, width, height, style }: ImageDisplayProps) => {
  return (
    <figure>
      <Image src={imageSrc} width={width} height={height} className={style} alt={alt} />
    </figure>
  );
};
