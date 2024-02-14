interface PromotionMessageProps {
  getMessage: { message: string[] };
  center?: boolean;
}

export const PromotionMessage = ({ getMessage, center }: PromotionMessageProps) => {
  return (
    <div className="wrapper">
      {getMessage.message.length > 0 && (
        <div
          className={`yellowContent ${center ? "text-center" : "text-left"}`}
          dangerouslySetInnerHTML={{ __html: getMessage.message.join("") as string }}
        ></div>
      )}
    </div>
  );
};
