import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { useParams, useNavigate } from "react-router";
import { baseurl } from "../../services/Baseurl";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";

const EditCategories = () => {
  const { accessToken } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);

  const [Fname, setFname] = useState(null);
  const [Fdescription, setFdescription] = useState(null);
  const [Fprice, setFprice] = useState(null);
  const [Foccupancy, setFoccupancy] = useState(null);

  const fetchCategory = async () => {
    try {
      const res = await fetch(`${baseurl}/specific-category/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.detail);
        return;
      }
      setCategory(data);
    } catch (error) {
      toast.error("Failed to fetch category details");
    }
  };

  // Fetch on mount / when id changes
  useEffect(() => {
    fetchCategory();
  }, [id]);

  // Seed form state once category has actually loaded
  useEffect(() => {
    if (category) {
      setFname(category.name);
      setFdescription(category.description);
      setFprice(category.price_per_night);
      setFoccupancy(category.max_occupancy);
    }
  }, [category]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const categorydata = {
      name: Fname,
      description: Fdescription,
      price_per_night: Number(Fprice),
      max_occupancy: Number(Foccupancy),
    };
    try {
      const res = await fetch(`${baseurl}/admin/update-category/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categorydata),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.detail);
        return;
      }
      toast.success(data.message);
      navigate("/admin");
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
                onChange={(e) => setFname(e.target.value)}
                type="text"
                defaultValue={category.name}
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
                onChange={(e) => setFprice(e.target.value)}
                type="number"
                min="0"
                step="0.01"
                defaultValue={category.price_per_night}
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
                onChange={(e) => setFoccupancy(e.target.value)}
                type="number"
                min="1"
                defaultValue={category.max_occupancy}
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
                onChange={(e) => setFdescription(e.target.value)}
                defaultValue={category.description}
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