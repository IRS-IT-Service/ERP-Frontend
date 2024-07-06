import React, { useEffect, useState, useCallback } from "react";

const CountDown = ({ targetDate, refetch ,historyRefetch }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(targetDate) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [hasRefetched, setHasRefetched] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span key={interval}>
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  useEffect(() => {

    if (!timerComponents.length) {
    
        refetch();
      historyRefetch()
    }
  }, [timeLeft, timerComponents.length, hasRefetched]);

  return (
    <div style={{ fontSize: "12px", fontWeight: "bold", color: "red" }}>
      {timerComponents.length ? (
        timerComponents
      ) : (
        <span style={{ fontSize: "12px", fontWeight: "bold", color: "green" }}>
          Send!
        </span>
      )}
    </div>
  );
};

export default CountDown;
