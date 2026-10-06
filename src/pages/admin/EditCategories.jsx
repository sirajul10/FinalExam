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

const EditCategories = () => {
  const { accessToken } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price_per_night, setPrice] = useState(0);
  const [max_occupancy, setOccupency] = useState(0);

  const fetchCategory = async () => {
    try {
      const res = await fetch(`${baseurl}/specific-category/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(getErrorMessage(data.detail));
        return;
      }
      setCategory(data);
      setName(data?.name ?? "");
      setDescription(data?.description ?? "");
      setPrice(data?.price_per_night ?? 0);
      setOccupency(data?.max_occupancy ?? 0);
    } catch (error) {
      toast.error("Faild To Edit Category");
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const handleUpdate = async (e) => {
  e.preventDefault();
  const categorydata = {
    name,
    description,
    price_per_night: Number(price_per_night),
    max_occupancy: Number(max_occupancy)
  };
  try {
    const res = await fetch(`${baseurl}/admin/update-room-category/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(categorydata)
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(getErrorMessage(data.detail));
      return;
    }
    toast.success(data.message);
    navigate('/admin/room-type');
  } catch (error) {
    toast.error("Failed to update");
  }
};

  if (!category) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Edit Category</h1>
          <p className="text-sm text-gray-500 mt-1">
            Update the details for {category.name}
          </p>
        </div>

        <form onSubmit={handleUpdate} className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                id="name"
                onChange={(e) => setName(e.target.value)}
                type="text"
                value={name}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Price Per Night */}
            <div>
              <label
                htmlFor="price_per_night"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price Per Night
              </label>
              <input
                id="price_per_night"
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                min="0"
                step="0.01"
                value={price_per_night}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Max Occupancy */}
            <div>
              <label
                htmlFor="max_occupancy"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Max Occupancy
              </label>
              <input
                id="max_occupancy"
                onChange={(e) => setOccupency(e.target.value)}
                type="number"
                min="1"
                value={max_occupancy}
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
              Update Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategories;