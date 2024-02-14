"use client";


import { useEffect, useRef } from "react";


export const useSlidePanel = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isClicked = useRef<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let buttonName = "";

  const coords = useRef<{
    startY: number;
    lastY: number;
  }>({
    startY: 0,
    lastY: 0,
  });
  useEffect(() => {
    if (window.innerWidth < 768) {
      if (!boxRef.current || !containerRef.current) return;

      const box = boxRef.current;
      const container = containerRef.current;

      const onTouchDown = (e: TouchEvent | MouseEvent) => {
        isClicked.current = true;
        coords.current.startY = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;
      };
      const onTouchUp = () => {
        isClicked.current = false;
        coords.current.lastY = box.offsetTop;

        if (coords.current.lastY > screen.height * 0.5) {
          box.style.top = "unset";
          box.style.bottom = "-86%";
          buttonName = "Next";
        } else {
          box.style.top = "0";
          box.style.bottom = "unset";
          buttonName = "Confirm & Pay";
        }
      };
      const onTouchMove = (e: TouchEvent | MouseEvent) => {
        if (!isClicked.current) return;

        const nextY = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;

        box.style.top = `${nextY}px`;
      };

      box.addEventListener("touchstart", onTouchDown);
      box.addEventListener("touchend", onTouchUp);
      container.addEventListener("touchmove", onTouchMove);
      box.addEventListener("mousedown", onTouchDown);
      box.addEventListener("mouseup", onTouchUp);
      container.addEventListener("mousemove", onTouchMove);

      const cleanup = () => {
        box.removeEventListener("touchstart", onTouchDown);
        box.removeEventListener("touchend", onTouchUp);
        container.removeEventListener("touchmove", onTouchMove);
        box.removeEventListener("mousedown", onTouchDown);
        box.removeEventListener("mouseup", onTouchUp);
        container.removeEventListener("mousemove", onTouchMove);
      };

      return cleanup;
    }
  }, []);
};
