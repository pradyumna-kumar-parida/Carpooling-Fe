// src/pages/Auth/signup/components/FieldSelect.jsx

export default function FieldSelect({
  id,
  label,
  value,
  onChange,
  options,
  icon,
  required = true,
}) {
  const Icon = icon;
  return (
    <div className="field-wrapper">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="field-input-box">
        <span className="field-icon">{Icon && <Icon />}</span>
        <select
          id={id}
          className="field-select"
          required={required}
          value={value}
          onChange={onChange}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
