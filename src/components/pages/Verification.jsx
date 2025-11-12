import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import axios from "axios";
import S3Uploader from "../S3Uploader";

const Verification = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [docs, setDocs] = useState([]);

  const allowedTypes = ["DRIVING_LICENSE", "VEHICLE_RC", "INSURANCE", "PAN"];

  const DRIVER_API = import.meta.env.VITE_DRIVER_BACKEND_URL;
  const AUTH_API = import.meta.env.VITE_AUTH_BACKEND_URL;
  const FILE_API = import.meta.env.VITE_FILE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, docsRes] = await Promise.allSettled([
          axios.get(`${DRIVER_API}/details`),
          axios.get(`${DRIVER_API}/documents/verification`),
        ]);

        if (profileRes.status === "fulfilled") {
          setProfile(profileRes.value.data);
        }

        if (docsRes.status === "fulfilled") {
          const responseData = docsRes.value.data || {};
          const docsData = responseData.documentList || [];

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

  const handleUploadSuccess = async (fileUrl, documentType) => {
    try {
      const res = await axios.post(`${DRIVER_API}/documents/add`, {
        documentType,
        fileUrl,
      });

      console.log("Document saved:", res.data);

      setDocs((prevDocs) =>
        prevDocs.map((doc) =>
          doc.documentType === documentType
            ? { ...doc, verificationStatus: "PENDING" }
            : doc
        )
      );
    } catch (err) {
      console.error("Error saving document:", err);
    }
  };

  const completedDocs = docs.filter((d) => d.verificationStatus === "VERIFIED").length;
  const progress = docs.length ? (completedDocs / docs.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white px-6 py-10">
      <h1 className="text-3xl font-bold text-yellow-400 mb-8">Driver Profile</h1>

      <Card className="mb-8 bg-[#121212] border border-[#2a2a2a] shadow-md">
        {loading ? (
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Skeleton shape="circle" size="6rem" />
            <div className="flex-1">
              <Skeleton width="60%" height="1.5rem" className="mb-2" />
              <Skeleton width="40%" height="1rem" className="mb-1" />
              <Skeleton width="30%" height="1rem" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={
                profile.photoUrl ||
                "https://cdn-icons-png.flaticon.com/512/147/147144.png"
              }
              alt="Driver Avatar"
              className="w-28 h-28 rounded-full border-2 border-yellow-400"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold">
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
              className="p-button-outlined p-button-warning"
            />
          </div>
        )}
      </Card>

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
            {docs.map((doc) => (
              <div
                key={doc.documentType}
                className="p-4 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium">
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
                  />
                </div>

                <S3Uploader
                  label="Upload"
                  disabled={doc.verificationStatus === "VERIFIED"}
                  presignApi={`http://localhost:3006/api/v1/driver/files/pre-signed-url`}
                  onUploadSuccess={(fileUrl) =>
                    handleUploadSuccess(fileUrl, doc.documentType)
                  }
                />

                {doc.documentUrl && (
                  <a
                    href={doc.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-400 text-sm mt-2 block"
                  >
                    View Uploaded Document
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

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
