import React, { useRef, useState } from "react";
import "@/style/scrollBar/scrollBar.css";

export interface CustomVerticalScrollBarType {
  width?: number;
  height?: number;
  maxHeight: number;
  children: React.ReactNode;
  showScrollBar?: boolean;
  containerStlye?: string;
  scrollBarColor?: string;
  scrollContainerStyle?: string;
}

export const CustomVerticalScrollBar = ({
  width,
  height,
  maxHeight,
  children,
  showScrollBar,
  containerStlye,
  scrollBarColor,
  scrollContainerStyle,
}: CustomVerticalScrollBarType) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseDrag = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const container = containerRef.current;
      if (container) {
        const clientY = event.clientY;
        const containerTop = container.getBoundingClientRect().top;
        const deltaY = clientY - containerTop + scrollY;
        const maxScroll = container.scrollHeight - container.clientHeight;
        const newY = Math.min(maxScroll, Math.max(0, deltaY));
        container.scrollTop = (newY / container.clientHeight) * maxScroll;
        setScrollY(newY);
      }
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${containerStlye}`}>
      <div
        className={`custom-scrollbar relative w-full ${scrollContainerStyle}`}
        style={{ maxHeight: `${maxHeight}px`, overflowY: showScrollBar ? "auto" : "hidden" }}
        ref={containerRef}
        onWheel={handleMouseDrag}
      >
        <div className=" h-full w-full">{children}</div>
        {showScrollBar && (
          <button
            className={`absolute right-0 rounded-full w-[${width ? width : 0}px] h-[${height ? height : 0}px] bg-${
              scrollBarColor ? scrollBarColor : "primaryGold"
            }`}
            style={{ top: `${scrollY}px` }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          ></button>
        )}
      </div>
    </div>
  );
};
