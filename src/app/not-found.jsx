"use client";
import React from "react";
import notFoundImg from "../assets/images/404.jpg";
import { useRouter } from "next/navigation";
import Image from "next/image";

const NotFound = () => {
  const router = useRouter();
  setTimeout(() => {
    router.push("/");
  }, 3000);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <Image
        src={notFoundImg}
        alt="404 Not Found"
        style={{ maxWidth: "600px", width: "100%", height: "auto" }}
      />
      <h1>Oops! Page Not Found</h1>
    </div>
  );
};

export default NotFound;
