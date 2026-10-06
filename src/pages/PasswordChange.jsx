import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FiLock, FiKey, FiShield, FiArrowLeft, FiSave, FiEye, FiEyeOff, FiCheckCircle } from "react-icons/fi";
import { AuthContext } from "../context/AuthProvider";
import toast from "react-hot-toast";
import { baseurl } from "../services/Baseurl";

const PasswordChange = () => {
  const { authUser, accessToken } = useContext(AuthContext);

  const [current_password, setCurrentPassword] = useState("");
  const [new_password, setNewpass] = useState("");
  const [cnfPass, setcnfpass] = useState("");

  const [showcurr, setShowcurr] = useState(false);
  const [shownew, setshownew] = useState(false);
  const [showc, setshowc] = useState(false);

  const navigator = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (!authUser) return;

    if (!current_password || !new_password || !cnfPass) {
      toast.error("Please fill in all fields");
      return;
    }

    if (new_password !== cnfPass) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      const formdata = { current_password, new_password };

      const res = await fetch(`${baseurl}/change-password`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.detail || "Failed to change password");
        return;
      }

      toast.success(data.message || "Password updated successfully");
      navigator("/profile");
    } catch (error) {
      console.error("Change password error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-5"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to profile
        </Link>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 md:px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <FiKey className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  Change Password
                </h1>
                <p className="text-white/80 text-sm">Keep your account secure</p>
              </div>
            </div>
          </div>

          <form className="p-6 md:p-8 space-y-5" onSubmit={handlesubmit}>
            {/* Current Password */}
            <div>
              <label
                htmlFor="current_password"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Current Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FiLock className="w-5 h-5" />
                </span>
                <input
                  id="current_password"
                  type={showcurr ? "text" : "password"}
                  value={current_password}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
                <button
                  type="button"
                  onClick={() => setShowcurr((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showcurr ? "Hide password" : "Show password"}
                >
                  {showcurr ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100"></div>

            {/* New Password */}
            <div>
              <label
                htmlFor="new_password"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                New Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FiShield className="w-5 h-5" />
                </span>
                <input
                  id="new_password"
                  type={shownew ? "text" : "password"}
                  value={new_password}
                  onChange={(e) => setNewpass(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
                <button
                  type="button"
                  onClick={() => setshownew((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={shownew ? "Hide password" : "Show password"}
                >
                  {shownew ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <ul className="mt-3 space-y-1.5 text-xs text-gray-500">
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="w-3.5 h-3.5 text-gray-400" />
                  At least 8 characters
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="w-3.5 h-3.5 text-gray-400" />
                  Contains uppercase & lowercase letters
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="w-3.5 h-3.5 text-gray-400" />
                  Contains at least one number
                </li>
              </ul>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm_password"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FiShield className="w-5 h-5" />
                </span>
                <input
                  id="confirm_password"
                  type={showc ? "text" : "password"}
                  value={cnfPass}
                  onChange={(e) => setcnfpass(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
                <button
                  type="button"
                  onClick={() => setshowc((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showc ? "Hide password" : "Show password"}
                >
                  {showc ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-100">
              <Link
                to="/profile"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <FiSave className="w-4 h-4" />
                Update Password
              </button>
            </div>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
          <FiShield className="w-3.5 h-3.5" />
          Your password is encrypted and never shared.
        </p>
      </div>
    </div>
  );
};

export default PasswordChange;