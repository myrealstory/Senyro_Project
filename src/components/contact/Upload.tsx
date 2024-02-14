"use client";

import UploadFile from "@/images/icons/Icon_upload.png";
import Delete from "@/images/icons/Icon_delete.png";
import Image from "next/image";
import { ChangeEvent, useState, MouseEvent } from "react";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";

interface ImageProps {
  onImageUpload: (files: File) => void;
  lang?: LocaleKeysType;
}

export const Upload = ({ onImageUpload, lang }: ImageProps) => {
  const { translate } = useTranslation(lang as LocaleKeysType);
  const [imageTitle, setImageTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const maxSizeOfImage = 400 * 1024 * 1024;
    const allowFormatOfImage = ["image/jpg", "image/jpeg", "image/png"];

    if (file !== undefined) {
      if (!allowFormatOfImage.includes(file.type)) {
        setErrorMsg(`${translate("contactUs.fileRemarks")}`);
      } else if (file.size > maxSizeOfImage) {
        setErrorMsg(`${translate("contactUs.error.fileExceedMsg")}`);
      } else {
        const imageFormat = file.name.split(".").pop();
        // const imageTitle = file.name.slice(0, 3);
        const imageTitle = file.name;
        // const title = `${imageTitle}...${imageFormat}`;
        const title = `${imageTitle}.${imageFormat}`;
        onImageUpload(file);
        setFile(file);
        setImageTitle(title);
        setErrorMsg("");
      }
    }
  };

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFile(null);
  };

  return (
    <div className="flex flex-col gap-1 md:pb-4">
      <div>
        <h3 className="text-[12px] font-semibold leading-4 xl:text-primaryGold 2xl:text-[16px]">
          {translate("contactUs.attachment")}
        </h3>
        <span className="text-[12px] leading-4 text-primaryMine">{translate("contactUs.fileRemarks")}</span>
      </div>
      <div className={`${file && imageTitle !== "" && "flex"}`}>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleImageUpload}
          name="imageUrl"
          accept="image/png, image/jpg, image/jpeg"
        />
        <label
          htmlFor="file-upload"
          className="text-slate-500  bg-pink-50 text-pink-700 hover:bg-pink-100 mr-4 flex h-[50px] w-full   cursor-pointer  items-center justify-center gap-3 rounded-full
            border-[1px] border-primaryGold px-4 py-3
            text-center text-[16px] font-medium leading-4 text-primaryGold"
        >
          {file && imageTitle !== "" ? (
            <Image
              src={UploadFile}
              width={30}
              height={30}
              alt="Your file has been uploaded"
              className="h-auto w-[20px] self-center"
            />
          ) : null}
          <span>{file && imageTitle !== "" ? imageTitle : `${translate("contactUs.upload")}`}</span>
        </label>
        {file && imageTitle !== "" && (
          <button onClick={handleDelete}>
            <Image
              src={Delete}
              width={30}
              height={30}
              alt="Click here to delete image"
              className="h-auto w-[30px] self-center"
            />
          </button>
        )}
      </div>
      {errorMsg && (
        <span className="text-primary text-[12px] font-semibold leading-5 text-primaryPurple">{errorMsg}</span>
      )}
    </div>
  );
};
