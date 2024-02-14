"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Close from "@/images/icons/Icon_page-close@3x.png";
import "@/style/auth/auth.scss";

import Mask from "../Mask";
import { ModalProps } from "@/types/modal/modal";

export const TermsAndConditionPopup = ({
  terms,
  onClose,
  showModal,
}: {
  terms: ModalProps;
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showModal: boolean;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerEleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (showModal) {
      const popup = modalRef.current;
      const firstFocusableEle = popup?.querySelector("button");
      document.body.style.overflow = "hidden";

      firstFocusableEle?.focus();
    } else {
      triggerEleRef.current?.focus();
      document.body.style.overflow = "visible";
    }

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [showModal]);

  if (!showModal) {
    return null;
  }

  return (
    <>
      <Mask>
        <div className="fixed bottom-0 left-0 right-0 top-16 z-10 flex items-center justify-center bg-[#4141414d] md:top-10 xl:top-0">
          <div
            ref={modalRef}
            className=" flex h-[75%] w-[90%] flex-col rounded-[24px] bg-primaryGold15 px-4 pb-12 sm:h-[60%] sm:w-[70%] lg:h-[70%] lg:w-[40%] lg:px-7"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} className="self-end pt-[20px] md:pt-[48px]">
              <Image src={Close} width={40} height={40} alt="close modal" className="h-auto w-[30px]" />
            </button>
            <div className="mb-[20px] mt-[6px] leading-5 xl:mb-[39px]  xl:text-[18px]">
              <h2 className="pl-3 text-left text-[20px] font-semibold text-primaryDark">{terms.title}</h2>
            </div>
            <article className=" popup-scrollbar flex flex-col gap-5 break-words pl-4 pr-5 text-left">
              <p className="text-[14px] leading-5 text-primaryDark lg:text-[16px]">
                Korem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis
                tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
                elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu
                ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim
                egestas, ac scelerisque ante pulvinar.
              </p>
              <p className="text-[14px] leading-5 text-primaryDark lg:text-[16px]">
                Korem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis
                tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
                elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu
                ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim
                egestas, ac scelerisque ante pulvinar.
              </p>
              <p className="text-[14px] leading-5 text-primaryDark lg:text-[16px]">
                Korem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis
                tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
                elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu
                ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim
                egestas, ac scelerisque ante pulvinar.
              </p>
              <p className="text-[14px] leading-5 text-primaryDark lg:text-[16px]">
                Korem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis
                tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
                elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu
                ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim
                egestas, ac scelerisque ante pulvinar.
              </p>
              <p className="text-[14px] leading-5 text-primaryDark lg:text-[16px]">
                Korem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis
                tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
                elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu
                ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim
                egestas, ac scelerisque ante pulvinar.
              </p>
              <p className="text-[14px] leading-5 text-primaryDark lg:text-[16px]">
                Korem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis
                tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
                elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu
                ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim
                egestas, ac scelerisque ante pulvinar.
              </p>
            </article>
          </div>
        </div>
      </Mask>
    </>
  );
};
