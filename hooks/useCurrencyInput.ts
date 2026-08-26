"use client";

import { useState, useCallback } from "react";

function formatNumberWithCommas(value: number): string {
  if (Number.isNaN(value)) return "";
  return value.toLocaleString("en-US");
}

export function useCurrencyInput(initialValue: number) {
  const [displayValue, setDisplayValue] = useState(() => formatNumberWithCommas(initialValue));
  const [numericValue, setNumericValue] = useState(initialValue);

  const handleChange = useCallback((value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    if (cleaned === "") {
      setDisplayValue("");
      setNumericValue(NaN);
      return;
    }
    const parsed = parseInt(cleaned, 10);
    setDisplayValue(formatNumberWithCommas(parsed));
    setNumericValue(parsed);
  }, []);

  const reset = useCallback((value: number) => {
    setDisplayValue(formatNumberWithCommas(value));
    setNumericValue(value);
  }, []);

  return {
    displayValue,
    numericValue,
    handleChange,
    reset,
  };
}