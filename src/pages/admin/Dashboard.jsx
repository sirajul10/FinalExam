import React, { useContext, useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { baseurl } from "../../services/Baseurl";
import { AuthContext } from "../../context/AuthProvider";
import toast from "react-hot-toast";
import { Link } from "react-router";
import AddRoomModal from "./components/AddRoomModal";


const STATUS_STYLES = {
  Available: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Occupied: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Maintenance: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
      STATUS_STYLES[status] || "bg-slate-50 text-slate-700 ring-slate-600/20"
    }`}
  >
    {status || "Unknown"}
  </span>
);

const Dashboard = () => {
  const { accessToken } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [roomType, setRoomType] = useState({});
  const [status, setStatus] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchrooms = async () => {
    try {
      const res = await fetch(`${baseurl}/all-rooms`);
      const data = await res.json();

      if (!res.ok) {
        console.error(data.detail);
        return;
      }

      setRooms(data);
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
      toast.error("Failed to fetch rooms");
    }
  };

  const fetchRoomType = async () => {
    try {
      const res = await fetch(`${baseurl}/all-category`);
      const data = await res.json();

      if (!res.ok) {
        console.error(data.detail);
        return;
      }

      const categories = data.reduce((acc, category) => {
        acc[category.id] = {
          name: category.name,
          description: category.description,
          price_per_night: category.price_per_night,
          max_occupancy: category.max_occupancy,
        };

        return acc;
      }, {});

      setRoomType(categories);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      toast.error("Failed to fetch categories");
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await fetch(`${baseurl}/admin/room-status`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.detail);
        return;
      }

      const statusNames = data.reduce((result, stname) => {
        result[stname.id] = {
          name: stname.status,
        };

        return result;
      }, {});

      setStatus(statusNames);
    } catch (err) {
      console.error("Failed to fetch statuses:", err);
      toast.error("Failed to fetch statuses");
    }
  };

  const handleDelete = async (room) => {
    const confirmed = window.confirm(
      `Delete room ${room.room_number}? This can't be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(`${baseurl}/admin/delete-room/${room.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      let data = {};

      try {
        data = await res.json();
      } catch {
        // Response doesn't contain JSON
      }

      if (!res.ok) {
        toast.error(data.detail || data.message || "Failed to delete room.");
        return;
      }

      toast.success(data.message || "Room deleted successfully.");

      // Update the room immediately in the UI
      setRooms((prevRooms) =>
        prevRooms.map((item) =>
          item.id === room.id ? { ...item, is_active: false } : item,
        ),
      );
    } catch (err) {
      console.error("Failed to delete room:", err);
      toast.error("Something went wrong while deleting the room.");
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchrooms();
      fetchStatuses();
      fetchRoomType();
    }
  }, [accessToken]);

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
            <h1 className="text-xl font-semibold text-slate-900">Rooms</h1>
            <p className="text-sm text-slate-500">
              Manage room inventory, pricing and status.
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          >
            <FiPlus size={16} />
            Add room
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "Room",
                  "Floor",
                  "Category",
                  "Price / night",
                  "Status",
                  "Active",
                  "",
                ].map((h) => (
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
              {rooms.map((room) => {
                const category = roomType[room.category_id];
                const roomStatus = status[room.status];
                const price = category
                  ? Number(category.price_per_night)
                  : null;

                return (
                  <tr
                    key={room.id}
                    className={`hover:bg-slate-50 ${
                      !room.is_active
                        ? "font-bold text-red-600"
                        : "text-slate-900"
                    }`}
                  >
                    <td className="px-4 py-3 text-sm">{room.room_number}</td>

                    <td className="px-4 py-3 text-sm">{room.floor}</td>

                    <td className="px-4 py-3 text-sm">
                      {category?.name || "—"}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {price !== null ? `$${price.toFixed(2)}` : "—"}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <StatusBadge status={roomStatus?.name} />
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {room.is_active ? "Yes" : "No"}
                    </td>

                    <td className="px-4 py-3 text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/edit-room/${room.id}`}
                          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        >
                          <FiEdit2 size={16} />
                        </Link>

                        <button
                          onClick={() => handleDelete(room)}
                          disabled={!room.is_active}
                          className="rounded-md p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-500"
                          aria-label={`Delete room ${room.room_number}`}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {rooms.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm text-slate-400"
                  >
                    No rooms yet. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddRoomModal isOpen={isAddModalOpen} onClose={handleCloseAddModal}/>
    </div>
  );
};

export default Dashboard;