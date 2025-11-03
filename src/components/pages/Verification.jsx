import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { FileUpload } from "primereact/fileupload";
import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";

const Verification = () => {
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    verified: false,
  });

  const [vehicle, setVehicle] = useState({
    type: "",
    number: "",
    color: "",
  });

  const [docs, setDocs] = useState([]);

  // Simulate API fetch delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setProfile({
        name: "Priyanshu Ranjan",
        email: "you@example.com",
        phone: "+91 98xxxxxx12",
        verified: true,
      });
      setVehicle({
        type: "Sedan",
        number: "BR06 AB 1234",
        color: "White",
      });
      setDocs([
        { name: "Driver’s License", status: "Verified" },
        { name: "Vehicle RC", status: "Pending" },
        { name: "Insurance", status: "Verified" },
        { name: "ID Proof", status: "Pending" },
      ]);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const completedDocs = docs.filter((d) => d.status === "Verified").length;
  const progress = (completedDocs / docs.length) * 100;

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white px-6 py-10">
      <h1 className="text-3xl font-bold text-yellow-400 mb-8">Driver Profile</h1>

      {/* Profile Card */}
      <Card className="mb-8 bg-[#121212] border border-[#2a2a2a] shadow-md">
        {loading ? (
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Skeleton shape="circle" size="6rem" className="mb-2" />
            <div className="flex-1 w-full">
              <Skeleton width="60%" height="1.5rem" className="mb-2" />
              <Skeleton width="40%" height="1rem" className="mb-1" />
              <Skeleton width="30%" height="1rem" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
              alt="Driver Avatar"
              className="w-28 h-28 rounded-full border-2 border-yellow-400"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold">{profile.name}</h2>
                {profile.verified ? (
                  <Tag value="Verified" className="!bg-blue-500 !text-white" />
                ) : (
                  <Tag value="Pending" severity="warning" />
                )}
              </div>
              <p className="text-gray-400 mt-1">{profile.email}</p>
              <p className="text-gray-400">{profile.phone}</p>
            </div>
            <Button
              label="Edit Profile"
              icon="pi pi-user-edit"
              className="p-button-outlined p-button-warning"
            />
          </div>
        )}
      </Card>

      {/* Vehicle Details */}
      <Card className="mb-8 bg-[#121212] border border-[#2a2a2a] shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-yellow-400">
            Vehicle Details
          </h2>
          {!loading && (
            <Button
              label="Edit Vehicle"
              icon="pi pi-pencil"
              className="p-button-text p-button-warning"
            />
          )}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-4 text-gray-300">
            <Skeleton width="80%" height="1rem" />
            <Skeleton width="80%" height="1rem" />
            <Skeleton width="80%" height="1rem" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4 text-gray-300">
            <div>
              <p className="text-sm text-gray-500">Vehicle Type</p>
              <p className="font-medium">{vehicle.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vehicle Number</p>
              <p className="font-medium">{vehicle.number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Color</p>
              <p className="font-medium">{vehicle.color}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Document Uploads */}
      <Card className="mb-8 bg-[#121212] border border-[#2a2a2a] shadow-md">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">
          Document Verification
        </h2>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} height="6rem" borderRadius="0.75rem" />
              ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {docs.map((doc, i) => (
              <div
                key={i}
                className="p-4 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium">{doc.name}</span>
                  <Tag
                    value={doc.status}
                    severity={
                      doc.status === "Verified"
                        ? "success"
                        : doc.status === "Pending"
                        ? "warning"
                        : "danger"
                    }
                  />
                </div>
                <FileUpload
                  mode="basic"
                  chooseLabel="Upload"
                  className="p-button-sm p-button-warning"
                  auto
                  disabled={doc.status === "Verified"}
                />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Verification Progress */}
      <Card className="bg-[#121212] border border-[#2a2a2a] shadow-md">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">
          Verification Progress
        </h2>

        {loading ? (
          <>
            <Skeleton height="1rem" width="100%" className="mb-4" />
            <Skeleton width="40%" height="1rem" />
          </>
        ) : (
          <>
            <ProgressBar
              value={progress}
              showValue={false}
              className="h-3 mb-3"
              color="#facc15"
            />
            <p className="text-gray-400 mb-6">
              {completedDocs}/{docs.length} documents verified
            </p>
            <div className="flex gap-4">
              <Button
                label="Save Changes"
                icon="pi pi-check"
                className="p-button-warning"
              />
              <Button
                label="Request Reverification"
                icon="pi pi-refresh"
                className="p-button-outlined p-button-warning"
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default Verification;
