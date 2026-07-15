import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Landingpage from "@/features/home/home";
import React from "react";

const Home = () => {
  // console.log("HOME RENDER");
  return (
    <>
      <Header />
      <Landingpage />
      <Footer />
    </>
  );
};

export default Home;
