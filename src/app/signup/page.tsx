import Signup from "@/pages/auth/signup/Signup";
import { getRolesApi } from "@/services/server/authService";

export default async function Page() {
  const { data: roles } = await getRolesApi();

  return <Signup roles={roles} />;
}
