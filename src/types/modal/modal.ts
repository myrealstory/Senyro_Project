import { LocaleKeysType } from "@/app/i18n";

export interface ModalProps {
  id?: string;
  title: string;
  content: string;
  shown: boolean;
  lang?: LocaleKeysType;
  delete?: () => void;
  cancel?: () => void;
  close?: () => void;
  confirm?: () => void;
}

export interface WarningPopupProps extends ModalProps {
  btnText1?: string;
  btnText2?: string;
}
