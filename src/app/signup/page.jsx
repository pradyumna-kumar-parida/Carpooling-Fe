import Signup from "@/pages/auth/signup/Signup";
import { getRolesApi } from "@/services/server/authService";
import React from "react";

const page = async () => {
  const { data: roles } = await getRolesApi();
  return <Signup roles={roles} />;
};

export default page;
