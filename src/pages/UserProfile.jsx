import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { FiUser, FiMail, FiAtSign, FiEdit2, FiCheckCircle, FiXCircle, FiShield, FiHash } from "react-icons/fi";
import { AuthContext } from "../context/AuthProvider";
import { baseurl } from "../services/Baseurl";
import toast from "react-hot-toast";

const UserProfile = () => {
  const { authUser, accessToken } = useContext(AuthContext);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!authUser?.role_id || !accessToken) return;

      try {
        const res = await fetch(`${baseurl}/role/${authUser.role_id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.detail || "Failed to fetch role");
          return;
        }

        setRole(data);
      } catch (error) {
        console.error("Role fetch error:", error);
        toast.error("Something went wrong while loading role");
      }
    };

    fetchData();
  }, [authUser, accessToken]);

  if (!authUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  const fullName = `${authUser.first_name || ""} ${authUser.last_name || ""}`.trim();
  const initials =
    `${authUser.first_name?.[0] || ""}${authUser.last_name?.[0] || ""}`.toUpperCase() ||
    "U";

  const roleLabel =
    role?.name ||
    (authUser.role_id === 1 ? "Admin" : "User");

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

          {/* Avatar + Name */}
          <div className="px-6 md:px-10 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 -mt-12">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                    {initials}
                  </div>
                </div>

                <div className="pb-1">
                  <h1 className="text-2xl font-bold text-gray-900 capitalize">
                    {authUser.username}
                  </h1>

                  <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                    <FiAtSign className="w-4 h-4" />
                    {authUser.username}
                  </p>
                </div>
              </div>

              {/* Edit button */}
              <Link
                to="/edit-profile"
                className="inline-flex items-center gap-2 self-start md:self-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
              >
                <FiEdit2 className="w-4 h-4" />
                Edit Profile
              </Link>
            </div>

            {/* Status badge */}
            <div className="mt-5">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  authUser.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {authUser.is_active ? (
                  <FiCheckCircle className="w-3.5 h-3.5" />
                ) : (
                  <FiXCircle className="w-3.5 h-3.5" />
                )}
                {authUser.is_active ? "Active Account" : "Inactive Account"}
              </span>
            </div>
          </div>
        </div>

        {/* Details card */}
        <div className="bg-white rounded-2xl shadow-sm mt-6 p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-5">
            Account Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* First name */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                First Name
              </label>
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                <FiUser className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-800 font-medium capitalize">
                  {authUser.first_name || "—"}
                </span>
              </div>
            </div>

            {/* Last name */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Last Name
              </label>
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                <FiUser className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-800 font-medium capitalize">
                  {authUser.last_name || "—"}
                </span>
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Username
              </label>
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                <FiAtSign className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-800 font-medium">
                  {authUser.username || "—"}
                </span>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Email
              </label>
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                <FiMail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-800 font-medium break-all">
                  {authUser.email || "—"}
                </span>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Role
              </label>
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                <FiShield className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-800 font-medium">{roleLabel}</span>
              </div>
            </div>

            {/* User ID */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                User ID
              </label>
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                <FiHash className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-800 font-medium">
                  #{authUser.id ?? "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;