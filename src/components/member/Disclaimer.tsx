import "@/style/member/member.scss";

interface DisclaimersProp {
  title: string;
  remarks: string[];
}

export const Disclaimer = ({ title, remarks }: DisclaimersProp) => {
  return (
    <div className="couponDisclaimerContainer">
      <h3>{title}</h3>
      <ol start={1} className="lg:leading-5">
        {remarks.map((remark, index) => (
          <li key={index} className="text-12 lg:leading-5">
            {remark}
          </li>
        ))}
      </ol>
    </div>
  );
};
