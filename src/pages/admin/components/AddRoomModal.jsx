import React, { useContext, useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { AuthContext } from "../../../context/AuthProvider";
import { baseurl } from "../../../services/Baseurl";
import toast from "react-hot-toast";

const AddRoomModal = ({ isOpen, onClose }) => {
  const { accessToken } = useContext(AuthContext);
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomStatus, setRoomStatus] = useState([]);
  const [category_id, setCategory_id] = useState(null);
  const [room_number, setroom_number] = useState(null);
  const [floor, setFloor] = useState(null);
  const [status, setStatus] = useState(null);
  const [is_active, setIs_active] = useState(true);

  const fetchRoomType = async () => {
    try {
      const res = await fetch(`${baseurl}/all-category`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.detail);
        return;
      }
      setRoomTypes(data);
    } catch (error) {
      toast.error("Failed to fetch room details");
    }
  };

  const fetchAllStatus = async () => {
    try {
      const res = await fetch(`${baseurl}/admin/room-status`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.detail);
        return;
      }
      setRoomStatus(data);
    } catch (error) {
      toast.error("Failed to fetch room details");
    }
  };

  useEffect(() => {
    fetchRoomType();
    fetchAllStatus();
  }, []);

  const handleAddingRoom = async()=>
  {
    const newroom = {
        category_id,room_number,floor,status,is_active
    }
    try{
        const res = await fetch(`${baseurl}/admin/create-room`,{
        method:"POST",
        headers:{
            Authorization:`Bearer ${accessToken}`,
            'Content-Type':'application/json'
        },
        body:JSON.stringify(newroom)
    });
    const data = await res.json();
    if(!res.ok)
    {
        toast.error(data.detail);
        return;
    }
    toast.success(data.message);

    }catch(error)
    {
        toast.error("Faild to add the Room");
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Add Room</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX size={20} />
          </button>
        </div>

        <form className="px-6 py-5 space-y-5" onSubmit={handleAddingRoom}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Room Number */}
            <div>
              <label
                htmlFor="room_number"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Room Number
              </label>
              <input
                id="room_number"
                onChange={(e) => setroom_number(e.target.value)}
                type="text"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Floor */}
            <div>
              <label
                htmlFor="floor"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Floor
              </label>
              <input
                id="floor"
                onChange={(e) => setFloor(e.target.value)}
                type="number"
                min="0"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category_id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Room Category
              </label>
              <select
                id="category_id"
                onChange={(e) => setCategory_id(e.target.value)}
                defaultValue=""
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="" disabled>
                  Select category
                </option>
                {roomTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Room Status
              </label>
              <select
                id="status"
                onChange={(e) => setStatus(e.target.value)}
                defaultValue=""
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="" disabled>
                  Select status
                </option>
                {roomStatus.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active toggle */}
          <label
            htmlFor="is_active"
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 cursor-pointer"
          >
            <div>
              <p className="text-sm font-medium text-gray-800">Active</p>
              <p className="text-xs text-gray-500">
                Inactive rooms won't be available for booking
              </p>
            </div>
            <input
              id="is_active"
              onChange={(e) => setIs_active(e.target.checked)}
              type="checkbox"
              checked={is_active}
              className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomModal;
