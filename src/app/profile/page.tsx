"use client";

import * as React from 'react';
import axios from 'axios';
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

export default function Profile() {
  const router = useRouter();
  const [profileData, setProfileData] = React.useState({
    username: "",
    email: "",
  });

  const handleLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }
  };

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/users/profile");
        console.log("Profile data:", response);
        const data = response?.data?.data;
        if (data) {
          setProfileData(data);
        } else {
          toast.error("Failed to fetch profile.");
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load profile.");
        console.log("Profile fetch error:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h1>Profile</h1>

      {profileData ? (
        <>
          <h1>
            Hello <span className="bg-amber-200 ml-1">{profileData.username}</span>
          </h1>
          <p>Email: {profileData.email}</p>
        </>
      ) : (
        <p>Loading profile...</p>
      )}

      <button
        onClick={handleLogout}
        className="bg-amber-200 px-4 py-2 text-black hover:bg-amber-300 mt-4"
      >
        Logout
      </button>
    </div>
  );
}
