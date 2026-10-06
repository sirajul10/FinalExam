import React, { useContext, useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { AuthContext } from "../../context/AuthProvider";
import { baseurl } from "../../services/Baseurl";
import toast from "react-hot-toast";
import { Link } from "react-router";
import AddCategoryModal from "./components/AddCategoryModal";

const Categories = () => {
  const { authUser, accessToken } = useContext(AuthContext);
  const [roomTypes, setRoomTypes] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  useEffect(() => {
    fetchRoomType();
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
              Categories
            </h1>
            <p className="text-sm text-slate-500">
              Manage room categories, pricing and occupancy.
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          >
            <FiPlus size={16} />
            Add category
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "Name",
                  "Description",
                  "Price / night",
                  "Max occupancy",
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
              {roomTypes.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50 text-slate-900">
                  <td className="px-4 py-3 text-sm font-medium">
                    {category.name}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate">
                    {category.description || "—"}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {category.price_per_night !== undefined
                      ? `$${Number(category.price_per_night).toFixed(2)}`
                      : "—"}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {category.max_occupancy ?? "—"}
                  </td>

                  <td className="px-4 py-3 text-right text-sm">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/edit-category/${category.id}`}
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <FiEdit2 size={16} />
                      </Link>

                     
                    </div>
                  </td>
                </tr>
              ))}

              {roomTypes.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-sm text-slate-400"
                  >
                    No categories yet. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddCategoryModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} />
    </div>
  );
};

export default Categories;