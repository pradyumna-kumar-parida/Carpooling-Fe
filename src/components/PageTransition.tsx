"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import "../styles/index.css";

type PageTransitionProps = {
  children: ReactNode;
};

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
