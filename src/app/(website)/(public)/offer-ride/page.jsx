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
    try {
      const { data } = await getOnlyVehicleList();
      vehicles = data;
    } catch (err) {
      // If the vehicle fetch fails (network/server error),
      // continue rendering the page with an empty vehicle list
      // instead of letting the server component throw.
      vehicles = [];
    }
  }

  return <PublishRide vehiclesFetch={vehicles} />;
}
