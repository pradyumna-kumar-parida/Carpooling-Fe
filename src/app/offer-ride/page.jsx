import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PublishRide from "@/pages/rides/offer-ride/PublishRide";
import { getVehicleListApi } from "@/services/server/vehicleService";
import React from "react";

const page = async () => {
  const { data: vehicles } = await getVehicleListApi();
  return (
    <>
      <Header />
      <PublishRide vehicles={vehicles} />
      <Footer />
    </>
  );
};

export default page;
