"use client";
// components/search/DateField.jsx

import { useRef, type ChangeEvent } from "react";
import { SlCalender } from "react-icons/sl";

type DateFieldProps = {
  name: string;
  value: string;
  onChangeAction: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function DateField({ name, value, onChangeAction }: DateFieldProps) {
  const pickerRef = useRef<HTMLInputElement | null>(null);
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fr-field" onClick={() => pickerRef.current?.showPicker?.()}>
      <span className="fr-field-icon">
        <SlCalender />
      </span>
      <input
        type="text"
        placeholder="yyyy-mm-dd"
        name={name}
        className="fr-field-input fr-date-input"
        value={value || ""}
        readOnly
      />
      <input
        ref={pickerRef}
        type="date"
        value={value || ""}
        min={today}
        onChange={onChangeAction}
        className="date-picker-format"
      />
    </div>
  );
}