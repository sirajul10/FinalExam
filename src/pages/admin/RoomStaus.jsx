import React, { useContext, useEffect, useState } from "react";
import { FiPlus, FiEdit2 } from "react-icons/fi";
import { AuthContext } from "../../context/AuthProvider";
import { baseurl } from "../../services/Baseurl";
import toast from "react-hot-toast";
import { Link } from "react-router";
import AddRoomStatusModal from "./components/AddRoomStatusModal";

const getErrorMessage = (detail) => {
  if (!detail) return "Something went wrong";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join(", ");
  return "Something went wrong";
};

const RoomStatus = () => {
  const { accessToken } = useContext(AuthContext);
  const [roomStatus, setRoomStatus] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchRoomStatus = async () => {
    try {
      const res = await fetch(`${baseurl}/admin/room-status`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(getErrorMessage(data.detail));
        return;
      }
      setRoomStatus(data);
    } catch (error) {
      toast.error("Failed to fetch room status");
    }
  };

  useEffect(() => {
    fetchRoomStatus();
  }, []);

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Room Status
            </h1>
            <p className="text-sm text-slate-500">
              Manage the statuses rooms can be assigned.
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          >
            <FiPlus size={16} />
            Add status
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {["Status", "Description", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {roomStatus.map((status) => (
                <tr key={status.id} className="hover:bg-slate-50 text-slate-900">
                  <td className="px-4 py-3 text-sm font-medium">
                    {status.status}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate">
                    {status.description || "—"}
                  </td>

                  <td className="px-4 py-3 text-right text-sm">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/edit-status/${status.id}`}
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <FiEdit2 size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {roomStatus.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-10 text-center text-sm text-slate-400"
                  >
                    No statuses yet. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddRoomStatusModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSuccess={fetchRoomStatus}
      />
    </div>
  );
};

export default RoomStatus;