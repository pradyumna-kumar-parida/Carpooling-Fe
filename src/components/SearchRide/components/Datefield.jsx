"use client";
// components/search/DateField.jsx

import { useRef } from "react";
import { SlCalender } from "react-icons/sl";

export default function DateField({ name, value, onChange }) {
  const pickerRef = useRef(null);
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
        onChange={onChange}
        className="date-picker-format"
      />
    </div>
  );
}