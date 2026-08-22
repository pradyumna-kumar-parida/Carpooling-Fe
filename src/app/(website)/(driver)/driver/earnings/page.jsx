import EarningsPage from "@/features/earning/Earning";
import {
  getDriverEarningsApi,
  getDriverTrips,
} from "@/services/server/earningService";

const Page = async () => {
  const [earnings, recentTrips] = await Promise.all([
    getDriverEarningsApi(),
    getDriverTrips(),
  ]);

  console.log("earnings:", earnings);
  console.log("recent trips:", recentTrips);

  return <EarningsPage DriverEarnings={earnings} DriverRecentTrips={recentTrips} />;
};

export default Page;
