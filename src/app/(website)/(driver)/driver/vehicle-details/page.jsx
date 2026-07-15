
import VehicleDetails from "@/features/vehicle/vehicle-details/VehicleDetails";
import { getVehicleListApi } from "@/services/server/vehicleService";

import React from "react";

const page = async () => {
  const { data: vehicles } = await getVehicleListApi();
  return <VehicleDetails vehiclesFetch={vehicles} />;
};

export default page;
