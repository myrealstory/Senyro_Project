import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CountdownTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(3600);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds - 1);

      if (seconds === 0) {
        clearInterval(interval);
        () => router.push("/en/checkout");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="text-[#626262]">
      <span className="text-xl md:text-h3">剩餘時間：</span>
      <span className="text-h3 font-semibold md:text-h2">{formatTime(seconds)}</span>
    </div>
  );
};

export default CountdownTimer;
