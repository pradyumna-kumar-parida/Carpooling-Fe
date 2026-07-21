import Signup from "@/features/auth/signup/Signup";
import { getRolesApi } from "@/services/server/authService";

const Page = async () => {
  let roles = [];

  try {
    const { data } = await getRolesApi();
    roles = data ?? [];
  } catch (error) {
    console.error("Failed to fetch roles:", error.message);
  }

  return <Signup roles={roles} />;
};

export default Page;
