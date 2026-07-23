import Footer from "@/components/Footer";
import Header from "@/components/Header";
import RatingModal from "@/components/Rating";
import Landingpage from "@/features/home/home";
import React from "react";

const Home = () => {
  // console.log("HOME RENDER");
  return (
    <>
      <Header />
      <Landingpage />
      {/* <RatingModal/> */}
      <Footer />
    </>
  );
};

export default Home;
