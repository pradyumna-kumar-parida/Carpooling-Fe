import { cookies } from "next/headers";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PublishRide from "@/features/rides/offer-ride/PublishRide";
import { getOnlyVehicleList } from "@/services/server/vehicleService";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let vehicles = [];

  if (token) {
    const { data } = await getOnlyVehicleList();
    vehicles = data;
  }

  return <PublishRide vehiclesFetch={vehicles} />;
}
