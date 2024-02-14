"use client";

import { Faqs } from "@/constants/faq/questions";
import { Panel } from "./Panel";
import { useEffect } from "react";
import "@/style/general-information/general-information.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setActiveIndexFaq } from "@/redux/slice/generalStateSlice";
interface FaqsProps {
  faqs: Faqs[];
  id: string;
}

export const Accordion = ({ faqs, id }: FaqsProps) => {
  const dispatch = useDispatch();
  const activeIndexFaq = useSelector((state: RootState) => state.generalState.activeIndexFaq);
  const questions = faqs.flatMap(question => question.questions);

  useEffect(() => {
    console.log(activeIndexFaq, "activeIndex");
  }, [activeIndexFaq]);

  return (
    <>
      <div id={`${id}`} className="FAQAccordionContainer">
        {questions.map((question, index) => (
          <Panel
            key={index}
            title={question.question}
            isActive={activeIndexFaq === index}
            onShow={() => dispatch(setActiveIndexFaq(index))}
            activeIndx={activeIndexFaq}
            listNumber={index + 1}
            anwser={question.answer}
          />
        ))}
      </div>
    </>
  );
};
