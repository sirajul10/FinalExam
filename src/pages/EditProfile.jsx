import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FiUser, FiMail, FiPhone, FiAtSign, FiSave, FiArrowLeft, FiEdit3 } from "react-icons/fi";
import { AuthContext } from "../context/AuthProvider";
import { baseurl } from "../services/Baseurl";
import toast from "react-hot-toast";

const EditProfile = () => {
  const { authUser, accessToken } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const navigator = useNavigate();

  useEffect(() => {
    if (!authUser) return;
    setUsername(authUser.username || "");
    setFirstName(authUser.first_name || "");
    setLastName(authUser.last_name || "");
    setEmail(authUser.email || "");
    setPhone(authUser.phone || "");
  }, [authUser]);

  const updateProfile = async (e) => {
    e.preventDefault();

    const formdata = { username, first_name, last_name, email, phone };

    try {
      const res = await fetch(`${baseurl}/update-user`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.detail || "Update failed");
        return;
      }

      toast.success(data.message || "Profile updated");
      navigator("/profile");
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Something went wrong");
    }
  };

  if (!authUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-5"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to profile
        </Link>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 md:px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <FiEdit3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Edit Profile</h1>
                <p className="text-white/80 text-sm">Update your account information</p>
              </div>
            </div>
          </div>

          <form onSubmit={updateProfile} className="p-6 md:p-8 space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FiAtSign className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            {/* First + Last */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="first_name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  First Name
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <FiUser className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    id="first_name"
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Last Name
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <FiUser className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    id="last_name"
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FiMail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Phone
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FiPhone className="w-5 h-5" />
                </span>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+60 12-345 6789"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-100">
              <Link
                to="/profile"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
              >
                <FiSave className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;