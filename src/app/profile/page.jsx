import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProfileRoute from "@/pages/profile/Profile";
import React from "react";

const page = () => {
  return (
    <>
      <Header />
      <ProfileRoute />
      <Footer />
    </>
  );
};

export default page;
