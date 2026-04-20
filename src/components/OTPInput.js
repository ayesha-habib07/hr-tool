"use client";
import { useState, useRef } from "react";

export default function OTPInput({ onComplete }) {
  const [vals, setVals] = useState(Array(6).fill(""));
  const refs = useRef([]);

  const handleChange = (i, v) => {
    if (!/^\d?$/.test(v)) return; // allow only single digits
    const next = [...vals];
    next[i] = v;
    setVals(next);

    // move to next input automatically
    if (v && i < 5) refs.current[i + 1].focus();

    // when all 6 digits filled, call parent function
    const joined = next.join("");
    if (joined.length === 6 && !next.includes("")) onComplete(joined);

  };

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        backgroundColor: "white",
        padding: 16,
        borderRadius: 2,
        justifyContent: "center",
      }}
    >
      {vals.map((v, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={v}
          onChange={(e) => handleChange(i, e.target.value)}
          maxLength={1}
          inputMode="numeric"
          className={`
    w-12 h-12 text-center text-lg font-semibold
    text-[var(--color-grey-700)]
    bg-[var(--color-grey-100)]
    border border-[var(--color-grey-300)]
    rounded outline-none
    transition-all duration-200 ease-in-out
    focus:border-[var(--color-primary-dark600)]
    focus:ring focus:ring-[var(--color-primary-dark600)]
    focus:bg-[var(--color-grey-50)]
    focus:scale-105
  `}
        />

      ))}
    </div>
  );
}
