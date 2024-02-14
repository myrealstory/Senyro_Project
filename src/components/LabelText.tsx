export const LabelText = ({ labelTitle, labelClass }: { labelTitle: string; labelClass: string }) => {
  return (
    <label htmlFor={labelTitle} className={labelClass}>
      {labelTitle}
    </label>
  );
};
