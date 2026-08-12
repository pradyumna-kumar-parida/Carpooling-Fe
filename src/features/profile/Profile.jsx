"use client";

import ProfilePage from "./components/ProfilePage";

export const metadata = {
  title: "Profile",
  description: "Manage your profile information",
};

export default function ProfileRoute({ profileData }) {
  return <ProfilePage profileData={profileData} />;
}
