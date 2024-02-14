import { useEffect, useLayoutEffect, useRef, useState } from "react";

interface ProgressType {
  Ref: React.MutableRefObject<HTMLDivElement | null>;
  activeWheel?: boolean;
}

export function useProgressCalculate({ Ref, activeWheel }: ProgressType) {
  const [currentX, setCurrentX] = useState(0);
  const [maxWidth, setMaxWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const isHovering = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const div = Ref.current;
      if (div) {
        const { scrollLeft, scrollWidth, clientWidth } = div;
        setCurrentX(scrollLeft);
        setMaxWidth(scrollWidth);
        setContainerWidth(clientWidth);
      }
    };

    const div = Ref.current;
    if (div && !isHovering.current) {
      div.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (div && !isHovering.current) {
        div.removeEventListener("scroll", handleScroll);
      }
    };
  }, [Ref, isHovering]);

  useLayoutEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      const div = Ref.current;

      if (event.deltaY !== 0) {
        div!.scrollLeft += event.deltaY;
        event.preventDefault();
      }
    };
    const handleWindowScroll = () => {
      const div = Ref.current;
      if (!isHovering.current && div && activeWheel === true) div.scrollLeft = window.scrollY;
    };

    const div = Ref.current;
    if (activeWheel === true) {
      if (div && isHovering.current === false) {
        div.addEventListener("wheel", handleScroll, { passive: false });
      } else {
        window.addEventListener("scroll", handleWindowScroll);
      }
    }

    return () => {
      if (div) {
        div.removeEventListener("wheel", handleScroll);
      }
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, [Ref, isHovering]);

  const progress = maxWidth === 0 ? 0 : (currentX / (maxWidth - containerWidth)) * 100;

  return { progress, isHovering };
}
