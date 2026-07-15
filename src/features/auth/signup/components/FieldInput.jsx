// FieldInput.jsx
export default function FieldInput({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = true,
  icon,
  maxLength,
  suffix,
  autoComplete, // add this
}) {
  const Icon = icon;
  return (
    <div className="field-wrapper">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="field-input-box" style={{ position: "relative" }}>
        <span className="field-icon">{Icon && <Icon />}</span>
        <input
          type={type}
          id={id}
          name={id} // add — browsers key off name
          className="field-input"
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          autoComplete={autoComplete} // add
          style={suffix ? { paddingRight: "80px" } : undefined}
        />
        {suffix && <span className="fields-input-suffix">{suffix}</span>}
      </div>
    </div>
  );
}
