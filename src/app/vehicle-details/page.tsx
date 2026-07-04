import Footer from "@/components/Footer";
import Header from "@/components/Header";
import VehicleDetails from "@/pages/vehicle/vehicle-details/VehicleDetails";
import { getVehicleListApi } from "@/services/server/vehicleService";

export default async function Page() {
  const { data: vehicles } = await getVehicleListApi();

  return (
    <>
      <Header />
      <VehicleDetails vehiclesFetch={vehicles} />
      <Footer />
    </>
  );
}
