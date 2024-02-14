import { CheckboxInterface } from "@/types/form/formTypes";

export const SMSCheckbox: CheckboxInterface = {
  labelFor: "receiveSMS",
  labelText: "I do not wish to receive SMS from sen-ryo",
  type: "checkbox",
  name: "receiveSMS",
  id: "receiveSMS",
  checked: false,
  required: false,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    e;
  },
};

export const EmailCheckbox: CheckboxInterface = {
  labelFor: "receiveEmail",
  labelText: "I do not wish to receive email from sen-ryo",
  type: "checkbox",
  name: "receiveEmail",
  id: "receiveEmail",
  checked: false,
  required: false,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    e;
  },
};

export const TermsCheckbox: CheckboxInterface = {
  labelFor: "terms",
  labelText: "*I have read and agree to the",
  labelButton: "Terms and Conditions, Privacy Policy & Cookies Policy",
  type: "checkbox",
  name: "terms",
  id: "terms",
  checked: false,
  required: false,
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
    e;
  },
};
