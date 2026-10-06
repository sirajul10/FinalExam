import React, { useContext, useState } from "react";
import { FiX } from "react-icons/fi";
import { AuthContext } from "../../../context/AuthProvider";
import { baseurl } from "../../../services/Baseurl";
import toast from "react-hot-toast";

const getErrorMessage = (detail) => {
  if (!detail) return "Something went wrong";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join(", ");
  return "Something went wrong";
};

const AddRoomStatusModal = ({ isOpen, onClose, onSuccess }) => {
  const { accessToken } = useContext(AuthContext);
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const resetForm = () => {
    setStatus("");
    setDescription("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseurl}/admin/create-room-status`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, description }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(getErrorMessage(data.detail));
        return;
      }
      toast.success(data.message ?? "Status added");
      resetForm();
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Failed to add room status");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            Add room status
          </h2>
          <button
            onClick={handleClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Status
            </label>
            <input
              id="status"
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Add status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomStatusModal;