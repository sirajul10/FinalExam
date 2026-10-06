import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { AuthContext } from '../../context/AuthProvider';
import toast from 'react-hot-toast';
import { baseurl } from '../../services/Baseurl';
import Loading from '../../components/Loading';

const getErrorMessage = (detail) => {
  if (!detail) return "Something went wrong";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join(", ");
  return "Something went wrong";
};

const EditRoomstatus = () => {
  const { accessToken } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [roomStatus, setRoomStatus] = useState(null);

  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");

  const fetchRoomStatus = async () => {
    try {
      const res = await fetch(`${baseurl}/admin/specific-room-status/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(getErrorMessage(data.detail));
        return;
      }
      setRoomStatus(data);
      setStatus(data?.status ?? "");
      setDescription(data?.description ?? "");
    } catch (error) {
      toast.error("Failed To Edit Room Status");
    }
  };

  useEffect(() => {
    fetchRoomStatus();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const roomstatusdata = {
      status,
      description
    };
    try {
      const res = await fetch(`${baseurl}/admin/update-room-status/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(roomstatusdata)
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(getErrorMessage(data.detail));
        return;
      }
      toast.success(data.message);
      navigate('/admin/room-staus');
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  if (!roomStatus) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Edit Room Status</h1>
          <p className="text-sm text-gray-500 mt-1">
            Update the details for {roomStatus.status}
          </p>
        </div>

        <form onSubmit={handleUpdate} className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Status */}
            <div className="sm:col-span-2">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <input
                id="status"
                onChange={(e) => setStatus(e.target.value)}
                type="text"
                value={status}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                required
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Update Room Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoomstatus;