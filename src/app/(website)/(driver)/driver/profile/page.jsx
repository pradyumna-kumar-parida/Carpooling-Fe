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
      profileCompleted: profile?.profileCompleted || "",
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
    return (
      <div className="fail-profile">
        <div className="fail-profile-icon">!</div>

        <h3>Failed to Load Profile</h3>

        <p>
          We couldn't load your profile information. Please try again later.
        </p>

        <a href="" className="fail-profile-retry">
          Try Again
        </a>
      </div>
    );
  }
};

export default Page;
