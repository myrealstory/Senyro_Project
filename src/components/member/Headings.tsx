export const Headings = ({ title, subheading }: { title: string; subheading?: string }) => {
  return (
    <div className="mb-[6px] flex flex-col">
      <label htmlFor={title} className="block pb-[4px] text-16 font-semibold leading-5 lg:text-primaryGold xl:text-17">
        {title}
      </label>
      {subheading ? <span className="lg:text-primaryGold">{subheading}</span> : null}
    </div>
  );
};
