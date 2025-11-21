import React, { useState, useEffect } from "react";
import axios from "axios";
import CarLoader from "../reusables/CarLoader";
import { Button } from "primereact/button";
import defaultDP from "../../assets/user.png";
import PageMeta from "../common/PageMeta";
import InfoCard from "../reusables/InfoCard";


const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_AUTH_BACKEND_URL}/details`,
          {
            withCredentials: true,
          }
        );
        setDriver(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <CarLoader message="Loading your profile..." />;
  }

  if (!driver) {
    return (
      <div className="p-6 text-center text-gray-700 dark:text-yellow-400">
        Failed to load profile. Please try again later.
      </div>
    );
  }

  return (
    <>
      <PageMeta page={"profile"} />
      

      <div className="px-6 flex justify-center items-center py-10 text-gray-100">
        <div className="relative w-full bg-gray-900 rounded-2xl shadow-2xl border border-yellow-500/20 p-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-yellow-500/10 blur-3xl pointer-events-none"></div>

          {/* Header */}
          <div className="relative flex flex-col items-center text-center mb-8">
            <div className="relative group">
              <img
                src={driver.profileImage || defaultDP}
                alt="Profile"
                className="h-28 w-28 rounded-full object-cover border-4 border-yellow-400 shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
              <button
                className="absolute bottom-0 right-0 bg-yellow-400 text-gray-900 p-1.5 rounded-full shadow-md text-xs font-semibold hover:bg-yellow-300 transition"
                title="Change photo"
              >
                <i className="pi pi-camera"></i>
              </button>
            </div>

            <h1 className="mt-4 text-3xl font-bold text-yellow-400">
              {driver.name}
            </h1>
            <p className="text-gray-400">{driver.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              {driver.activeCity || "No city selected"}
            </p>
          </div>

          {/* Info grid */}
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <InfoCard label="Role" value={driver.role} icon="pi pi-user" />
            <InfoCard
              label="Phone"
              value={driver.phoneNumber}
              icon="pi pi-phone"
            />
            <InfoCard
              label="License No"
              value={driver.licenseNumber}
              icon="pi pi-id-card"
            />
            <InfoCard
              label="Aadhar No"
              value={driver.aadharCardNumber}
              icon="pi pi-credit-card"
            />
            <InfoCard
              label="Approval"
              value={driver.driverApprovalStatus}
              red={true}
              icon="pi pi-check-circle"
            />
            <InfoCard
              label="Rating"
              value={`${driver.rating} ★`}
              icon="pi pi-star"
            />
            <InfoCard
              label="Active Booking"
              value={driver.activeBooking}
              icon="pi pi-car"
            />
            <InfoCard
              label="City"
              value={driver.activeCity || "N/A"}
              icon="pi pi-map-marker"
            />
          </div>

          {/* Buttons */}
          <div className="relative flex flex-wrap justify-center gap-4 mt-6">
            <Button
              label="Edit Profile"
              icon="pi pi-user-edit"
              className="bg-yellow-400 text-gray-900 font-semibold border-none px-4 py-2 rounded-lg hover:bg-yellow-300 transition-all shadow-md"
            />
            <Button
              label="Change Password"
              icon="pi pi-lock"
              className="bg-gray-800 text-yellow-400 border border-yellow-400 font-semibold px-4 py-2 rounded-lg hover:bg-gray-700 transition-all shadow-md"
            />
          </div>
        </div>
      </div>
    </>
  );
};



export default Profile;
