"use client";

import * as React from 'react';
import axios from 'axios';
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


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

  // return (
  //   <div>
  //     <h1>Profile</h1>

  //     {profileData ? (
  //       <>
  //         <h1>
  //           Hello <span className="bg-amber-200 ml-1">{profileData.username}</span>
  //         </h1>
  //         <p>Email: {profileData.email}</p>
  //       </>
  //     ) : (
  //       <p>Loading profile...</p>
  //     )}

  //     <button
  //       onClick={handleLogout}
  //       className="bg-amber-200 px-4 py-2 text-black hover:bg-amber-300 mt-4"
  //     >
  //       Logout
  //     </button>
  //   </div>
  // );

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-10">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar */}
        <div className="flex flex-col items-center md:items-start md:w-1/4">
          <div className="relative">
            <Avatar className="w-28 h-28">
              <AvatarImage
                src="https://static.vecteezy.com/system/resources/previews/027/395/067/non_2x/cute-ghost-playing-game-is-waiting-for-you-vector.jpg"
                alt="Nora Tsunoda"
              />
              <AvatarFallback>NT</AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 bg-pink-500 text-white rounded-full w-8 h-8 text-xl font-bold shadow-md hover:bg-pink-600">
              +
            </button>
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-50">{profileData.username}</h2>
          <p className="text-gray-200 text-sm">{profileData.email}</p>

          <ul className="mt-6 space-y-2 text-gray-400">
            <li className="font-medium text-gray-300">Profile</li>
            <li>Tasks</li>
            <li>Calendar</li>
            <li>Files</li>
            <li><button
              onClick={handleLogout}
              className="bg-amber-200 px-4 py-1 text-black hover:bg-amber-300 mt-4 rounded"
            >
              Logout
            </button></li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 ">
          <Card className="p-6 bg-gray-800">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">
              {profileData.username} spends most of their time on...
            </h3>
            <div className="space-y-3">
              {[
                { name: "Product Infrastructure", icon: "💻" },
                { name: "Network Security", icon: "🔐" },
                { name: "Security Testing", icon: "🧪" },
                { name: "Security Audit Outsourcing", icon: "🌐" },
                { name: "Bugs", icon: "🐞" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-gray-400 p-2 rounded-md shadow-sm"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
