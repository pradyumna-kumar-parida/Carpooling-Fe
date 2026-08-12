import { cookies } from "next/headers";

import PublishRide from "@/features/rides/offer-ride/PublishRide";
import { getOnlyVehicleList } from "@/services/server/vehicleService";
import { CompleteProfileApi } from "@/services/server/authService";


export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let vehicles = [];
  let profileData = null;

  if (token) {
    try {
      const { data } = await getOnlyVehicleList();
      vehicles = data;
    } catch (err) {
      vehicles = [];
    }

    try {
      const { data } = await CompleteProfileApi();
      profileData = data;
    } catch (err) {
      profileData = null;
    }
  }

  return <PublishRide vehiclesFetch={vehicles} profileData={profileData} />;
}
