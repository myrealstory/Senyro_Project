import Image from "next/image";
import { StaticImageData } from "next/image";

interface ImagProps {
  img: StaticImageData;
  divClass: string;
  imgClass: string;
  alt: string;
  width: number;
  height: number;
  placeholder?: "blur" | "empty" | undefined;
  loading?: "lazy" | "eager" | undefined;
  url?: string;
}

export const PromotionImage = ({
  img,
  divClass,
  imgClass,
  alt,
  width,
  height,
  placeholder,
  loading,
  url,
}: ImagProps) => {
  return (
    <div
      role="button"
      className={divClass}
      onClick={() => {
        if (url?.length) {
          window.location.href = url;
        }
      }}
    >
      <Image
        src={img}
        width={width}
        height={height}
        alt={alt}
        placeholder={placeholder}
        loading={loading}
        className={imgClass}
      />
    </div>
  );
};
