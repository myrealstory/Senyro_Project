import { ROUTES } from "@/constants";
import { CheckboxInterface } from "@/types/form/formTypes";

export const Checkbox = ({
  labelFor,
  labelText,
  labelButton,
  labelButton2,
  labelButton3,
  name,
  id,
  type,
  required,
  checked,
  lang,
  onChange,
  onClick,
  onClickMembership,
  onClickPrivacy,
  containerClass,
  path,
}: CheckboxInterface) => {
  return (
    <div
      className={` flex items-start gap-1  ${
        id === "receiveSMS" || id === "receiveEmail" ? "mt-[-26px] pl-[22px]" : "mt-0 "
      } ${containerClass}`}
    >
      <input
        className={`checkboxInput ${
          id === "terms"
            ? "mt-[-2px] h-[16px] w-[16px] rounded-[4px] border-primaryDark text-primaryDark checked:bg-primaryDark lg:border-primaryGold lg:text-primaryGold lg:checked:bg-primaryGold"
            : "mt-[3px] rounded-[4px] border-[1.65px] border-primaryGold text-primaryGold checked:bg-primaryGold"
        }`}
        type={type}
        name={name}
        id={id}
        required={required}
        checked={checked}
        onChange={onChange}
      />
      <label
        className={`checkboxLabel ${checked === true ? "font-semibold" : "font-normal"} ${
          id === "terms" ? "checkboxTermsLabel" : "text-primaryGold"
        }`}
        id={id}
        htmlFor={labelFor}
      >
        {labelText}
        <span role="button" onClick={onClick} className="checkboxBtn pr-1">
          {labelButton}
        </span>
        {path !== `${ROUTES.CHECKOUT}` && (
          <>
            {/* {id === "receiveSMS" || id === "receiveEmail" || (lang === "en" && id === "terms") ? <span>、</span> : null} */}
            <span role="button" onClick={onClickMembership} className="checkboxBtn font-semibold underline">
              {labelButton2}
            </span>
            <span role="button" onClick={onClickPrivacy} className="checkboxBtn font-semibold underline">
              {labelButton3}
            </span>
          </>
        )}
      </label>
    </div>
  );
};
