import React, { useState, useEffect } from 'react';
import { formatCredits } from '@/utils/formatting';

export default function CreditCounter({ value, duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <div className="text-4xl font-light tracking-tight">
      {formatCredits(count)}
    </div>
  );
}

