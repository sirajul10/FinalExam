import React, { useContext, useState } from "react";
import { FiX } from "react-icons/fi";
import { AuthContext } from "../../../context/AuthProvider";
import { baseurl } from "../../../services/Baseurl";
import toast from "react-hot-toast";

const AddCategoryModal = ({ isOpen, onClose }) => {
  const { accessToken } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price_per_night, setPricePerNight] = useState(0);
  const [max_occupancy, setMaxOccupancy] = useState(0);

  const addCategory = async (e) => {
    e.preventDefault();
    const formdata = {
      name,
      description,
      price_per_night: parseFloat(price_per_night),
      max_occupancy: parseInt(max_occupancy, 10),
    };
    try {
      const res = await fetch(`${baseurl}/admin/create-room-category`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(
          typeof data.detail === "string" ? data.detail : "Invalid input",
        );
        return;
      }
      toast.success(data.message);
      onClose();
    } catch (error) {
      toast.error("Failed to add category");
    }
  };

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
          <h2 className="text-lg font-semibold text-gray-900">Add Category</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX size={20} />
          </button>
        </div>

        <form className="px-6 py-5 space-y-5" onSubmit={addCategory}>
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Price per night */}
            <div>
              <label
                htmlFor="price_per_night"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price / night
              </label>
              <input
                onChange={(e) => setPricePerNight(e.target.value)}
                type="number"
                min="0"
                step="0.01"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Max occupancy */}
            <div>
              <label
                htmlFor="max_occupancy"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Max Occupancy
              </label>
              <input
                onChange={(e) => setMaxOccupancy(e.target.value)}
                type="number"
                min="1"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

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
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
