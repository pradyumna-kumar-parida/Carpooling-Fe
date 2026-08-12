import React from "react";
import ProfileRoute from "@/features/profile/Profile";
import { getProfile } from "@/services/server/authService";

const Page = async () => {


  try {
    const response = await getProfile();

    const profile = response?.data || response;

    const profileData = {
      fullname: profile?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      usertype: profile?.role || "",

      city: profile?.city || "",
      state: profile?.state || "",
      country: profile?.country || "",
      postalCode: profile?.postal_code || "",
      address: profile?.address || "",

      bankAccountHolder: profile?.bank_account_holder || "",
      bankAccountNumber: profile?.bank_account_number || "",
      bankIFSC: profile?.bank_account_ifsc || "",
      bankBranchName: profile?.bank_name || "",
      bankBranchCode: "",

      driverLicense: profile?.driver_license || null,
      aadhaarCard: profile?.adhhar_card || null,
      panCard: profile?.pan_card || null,
      bankAccountDetails: profile?.bank_account || null,

      profilePicture: profile?.profile_picture || "",

      password: "",
      confirmPassword: "",
      terms: false,
    };


    return <ProfileRoute profileData={profileData} />;

  } catch (error) {
    console.log(error);
    return (
      <div>
        Failed to load profile
      </div>
    );
  }
};

export default Page;