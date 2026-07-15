// src/pages/Auth/signup/components/StepDots.jsx

export default function StepDots({ total, current }) {
  return (
    <div className="step-dotts">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width:        i === current ? "24px" : "8px",
            height:       "8px",
            borderRadius: "4px",
            background:   i === current ? "var(--primary-color, #4f46e5)"
                        : i < current  ? "var(--primary-light, #8395f3)"
                        :                "var(--border-color, #ddd)",
            transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      ))}
    </div>
  );
}