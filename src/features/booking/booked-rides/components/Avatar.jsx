import Image from "next/image";
import { avatarColor, getInitials } from "../utils/bookingHelpers";

export default function Avatar({
  src,
  name,
  className,
  style = {},
}) {
  const [bg, text] = avatarColor(name);

  if (src) {
    return (
      <Image
        src={src}
        alt={name || "avatar"}
        className={className}
        loading="lazy"
        width={50}
        height={50}
        style={style}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        background: bg,
        color: text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: "16px",
        ...style,
      }}
    >
      {getInitials(name)}
    </div>
  );
}