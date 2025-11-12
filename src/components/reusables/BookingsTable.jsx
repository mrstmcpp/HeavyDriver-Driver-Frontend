import React from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

const BookingsTable = ({ bookings = [], loading }) => {
  const navigate = useNavigate();

  // ✅ Format booking date
  const dateTemplate = (rowData) =>
    new Date(rowData.createdAt).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // ✅ Format fare
  const fareTemplate = (rowData) => {
    if (rowData.fare === null || rowData.fare === undefined) {
      return <span className="text-gray-500 italic">Not available</span>;
    }
    return <span className="text-yellow-400 font-semibold">₹{rowData.fare}</span>;
  };

  // ✅ Format status
  const statusTemplate = (rowData) => {
    let colorClass = "text-gray-400";
    if (rowData.status === "COMPLETED") colorClass = "text-green-400";
    else if (rowData.status === "CANCELLED") colorClass = "text-red-400";
    else if (rowData.status === "ONGOING") colorClass = "text-yellow-400";
    return (
      <span className={`font-semibold uppercase tracking-wide ${colorClass}`}>
        {rowData.status}
      </span>
    );
  };

  // ✅ View action button
  const actionTemplate = (rowData) => (
    <Button
      label="View"
      icon="pi pi-eye"
      className="!bg-transparent !border-yellow-400 !text-yellow-400 hover:!bg-yellow-400 hover:!text-black transition-all duration-300 text-sm px-3 py-2 rounded-full"
      onClick={() => navigate(`/rides/details/${rowData.id}`)}
    />
  );

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-lg bg-[#0F1523]">
      <DataTable
        value={bookings}
        loading={loading}
        stripedRows
        tableStyle={{ minWidth: "50rem" }}
        emptyMessage={
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <i className="pi pi-inbox text-3xl mb-3 text-yellow-400/60"></i>
            <p>No bookings found.</p>
          </div>
        }
        className="text-gray-300 text-sm"
      >
        <Column
          field="id"
          header="ID"
          sortable
          style={{ width: "10%" }}
          headerClassName="!bg-[#141922] text-yellow-400 uppercase tracking-wide"
        />
        <Column
          header="Date"
          body={dateTemplate}
          sortable
          style={{ width: "20%" }}
          headerClassName="!bg-[#141922] text-yellow-400 uppercase tracking-wide"
        />
        <Column
          header="Fare"
          body={fareTemplate}
          sortable
          style={{ width: "15%" }}
          headerClassName="!bg-[#141922] text-yellow-400 uppercase tracking-wide"
        />
        <Column
          field="status"
          header="Status"
          body={statusTemplate}
          sortable
          style={{ width: "15%" }}
          headerClassName="!bg-[#141922] text-yellow-400 uppercase tracking-wide"
        />
        <Column
          header="Action"
          body={actionTemplate}
          style={{ width: "15%" }}
          headerClassName="!bg-[#141922] text-yellow-400 uppercase tracking-wide"
        />
      </DataTable>
    </div>
  );
};

export default BookingsTable;
