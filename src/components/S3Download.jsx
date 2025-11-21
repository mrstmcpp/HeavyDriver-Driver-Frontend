import React, { useState } from "react";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "axios";

const S3Download = ({ fileName, apiEndpoint }) => {
  const [loading, setLoading] = useState(false);

  const handleViewDocument = async () => {
    if (!fileName) return;
    setLoading(true);

    try {
      const { data: presignedUrl } = await axios.get(apiEndpoint, {
        params: { filename: fileName },
      });

      if (typeof presignedUrl === "string" && presignedUrl.startsWith("http")) {
        window.open(presignedUrl, "_blank", "noopener,noreferrer");
      } else {
        console.error("Unexpected response from backend:", presignedUrl);
        alert("Could not open document. Invalid URL received.");
      }
    } catch (error) {
      console.error("Error fetching document URL:", error);
      alert("Unable to view this document right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <Button
        label={loading ? "Opening..." : "View Uploaded Document"}
        icon={loading ? null : "pi pi-eye"}
        className="p-button-text text-yellow-400 hover:text-yellow-300 font-medium"
        onClick={handleViewDocument}
        disabled={loading}
      >
        {loading && (
          <ProgressSpinner
            style={{ width: "1rem", height: "1rem" }}
            strokeWidth="8"
            className="ml-2"
          />
        )}
      </Button>
    </div>
  );
};

export default S3Download;
