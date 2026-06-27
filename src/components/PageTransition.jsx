"use client";

import { usePathname } from "next/navigation";
import "../styles/index.css";
export default function PageTransition({ children }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
