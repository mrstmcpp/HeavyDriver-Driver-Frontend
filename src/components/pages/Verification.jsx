import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import axios from "axios";
import S3Uploader from "../S3Uploader";
import S3Download from "../S3Download";

const Verification = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [docs, setDocs] = useState([]);

  const allowedTypes = ["DRIVING_LICENSE", "VEHICLE_RC", "INSURANCE", "PAN"];
  const DRIVER_API = import.meta.env.VITE_DRIVER_BACKEND_URL;
  const AUTH_API = import.meta.env.VITE_AUTH_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, docsRes] = await Promise.allSettled([
          axios.get(`${AUTH_API}/details`),
          axios.get(`${DRIVER_API}/documents/verification`),
        ] , {
          withCredentials: true,
          
        });

        if (profileRes.status === "fulfilled") {
          setProfile(profileRes.value.data);
        }

        if (docsRes.status === "fulfilled") {
          const docsData = docsRes.value.data?.documentList || [];
          const normalizedDocs = allowedTypes.map((type) => {
            const existing = docsData.find((d) => d.documentType === type);
            return (
              existing || {
                documentType: type,
                verificationStatus: "NOT_UPLOADED",
                documentUrl: null,
              }
            );
          });
          setDocs(normalizedDocs);
        } else {
          setDocs(
            allowedTypes.map((type) => ({
              documentType: type,
              verificationStatus: "NOT_UPLOADED",
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching driver data:", error);
        setDocs(
          allowedTypes.map((type) => ({
            documentType: type,
            verificationStatus: "NOT_UPLOADED",
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [DRIVER_API]);

  const handleUploadSuccess = async (fileUrl, fileName, documentType) => {
    try {
      await axios.post(`${DRIVER_API}/documents/add`, {
        documentType,
        fileUrl,
        fileName,
      });

      setDocs((prevDocs) =>
        prevDocs.map((doc) =>
          doc.documentType === documentType
            ? {
                ...doc,
                verificationStatus: "PENDING",
                fileName,
                documentUrl: fileUrl,
              }
            : doc
        )
      );
    } catch (err) {
      console.error("Error saving document:", err);
    }
  };

  const completedDocs = docs.filter(
    (d) => d.verificationStatus === "VERIFIED"
  ).length;
  const progress = docs.length ? (completedDocs / docs.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white px-4 sm:px-6 md:px-10 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-8 text-center md:text-left">
        Driver Profile
      </h1>

      {/* Profile Card */}
      <Card className="mb-8 bg-[#121212] border border-[#2a2a2a] shadow-md">
        {loading ? (
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Skeleton shape="circle" size="6rem" />
            <div className="flex-1 w-full">
              <Skeleton width="60%" height="1.5rem" className="mb-2" />
              <Skeleton width="40%" height="1rem" className="mb-1" />
              <Skeleton width="30%" height="1rem" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={
                profile.photoUrl ||
                "https://cdn-icons-png.flaticon.com/512/147/147144.png"
              }
              alt="Driver Avatar"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-yellow-400"
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  {profile.name || "Unnamed Driver"}
                </h2>
                {profile.verified ? (
                  <Tag value="Verified" className="!bg-blue-500 !text-white" />
                ) : (
                  <Tag value="Pending" severity="warning" />
                )}
              </div>
              <p className="text-gray-400 mt-1">{profile.email || "N/A"}</p>
              <p className="text-gray-400">{profile.phone || "N/A"}</p>
            </div>
            <Button
              label="Edit Profile"
              icon="pi pi-user-edit"
              className="p-button-outlined p-button-warning w-full sm:w-auto"
            />
          </div>
        )}
      </Card>

      {/* Documents Section */}
      <Card className="mb-8 bg-[#121212] border border-[#2a2a2a] shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold text-yellow-400 mb-4 text-center md:text-left">
          Document Verification
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} height="6rem" borderRadius="0.75rem" />
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {docs.map((doc) => (
              <div
                key={doc.documentType}
                className="p-4 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] flex flex-col justify-between"
              >
                <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                  <span className="font-medium text-sm sm:text-base">
                    {doc.documentType.replaceAll("_", " ")}
                  </span>
                  <Tag
                    value={
                      doc.verificationStatus === "NOT_UPLOADED"
                        ? "Not Uploaded"
                        : doc.verificationStatus
                    }
                    severity={
                      doc.verificationStatus === "VERIFIED"
                        ? "success"
                        : doc.verificationStatus === "PENDING"
                        ? "warning"
                        : "danger"
                    }
                    className="text-xs sm:text-sm"
                  />
                </div>

                <S3Uploader
                  label="Upload"
                  disabled={doc.verificationStatus === "VERIFIED"}
                  presignApi={`${DRIVER_API}/files/pre-signed-url`}
                  onUploadSuccess={(fileUrl, fileName) =>
                    handleUploadSuccess(fileUrl, fileName, doc.documentType)
                  }
                />

                <p className="text-gray-500 text-xs mt-1 italic">
                  Allowed formats:{" "}
                  <span className="text-gray-300">JPEG, PNG, PDF</span> — Max
                  size: <span className="text-gray-300">1 MB</span>
                </p>

                {doc.fileName && (
                  <div className="mt-3">
                    <S3Download
                      fileName={doc.fileName}
                      apiEndpoint={`${DRIVER_API}/files/download`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Verification Progress */}
      <Card className="bg-[#121212] border border-[#2a2a2a] shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold text-yellow-400 mb-4 text-center md:text-left">
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
              className="h-2 sm:h-3 mb-3"
              color="#facc15"
            />
            <p className="text-gray-400 mb-6 text-center sm:text-left text-sm sm:text-base">
              {completedDocs}/{docs.length} documents verified
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:justify-start">
              <Button
                label="Save Changes"
                icon="pi pi-check"
                className="p-button-warning w-full sm:w-auto"
              />
              <Button
                label="Request Reverification"
                icon="pi pi-refresh"
                className="p-button-outlined p-button-warning w-full sm:w-auto"
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default Verification;
