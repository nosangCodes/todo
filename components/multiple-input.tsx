"use client";
import React, { useState } from "react";
type Props = {
  values?: string[];
  onChange: (value: string, clearValue?: () => void) => void;
};

export default function MultipleInput({ values, onChange }: Props) {
  const [singleValue, setSingleValue] = useState<string>();

  const handleClearValue = () => {
    setSingleValue("");
  };

  return (
    <div className="!mt-0">
      {values && values?.length > 0 && (
        <div className="mb-2 flex flex-row flex-wrap gap-1">
          {values?.map((value) => (
            <p className="px-2 py-1 rounded-md bg-slate-900 text-sm font-semibold">
              {value}
            </p>
          ))}
        </div>
      )}
      <input
        className="w-full p-2 rounded-sm"
        value={singleValue}
        onChange={(e) => setSingleValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Tab" || e.key === "Enter") {
            e.preventDefault();
            if (singleValue) {
              onChange(singleValue, handleClearValue);
            }
          }
        }}
      />
    </div>
  );
}
