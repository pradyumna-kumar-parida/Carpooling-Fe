"use client";

import { useEffect, useState } from "react";
import top from "@/assets/images/backtop.png";
import Image from "next/image";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > window.innerHeight);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollTop}
      className={`back-to-top ${show ? "show" : ""}`}
      aria-label="Back to top"
    >
      {/* <FaArrowUp /> */}
      <Image
        src={top}
        alt="Top Image"
        style={{
          width: "60%",
          height: "auto",
        }}
      />
    </button>
  );
}
