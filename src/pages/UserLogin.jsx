import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { baseurl } from "../services/Baseurl";
import { AuthContext } from "../context/AuthProvider";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const UserLogin = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { setAutuser, loading, setLoading } = useContext(AuthContext);
  const navigator = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Please enter username and password");
      return;
    }
    
    setLoading(true);

    try {
      const formdata = new URLSearchParams();
      formdata.append("username", username);
      formdata.append("password", password);
      console.log(username,password);

      const res = await fetch(`${baseurl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formdata,
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        // Safe string handling for toast
        const errorMessage = typeof data?.detail === "string" ? data.detail : "Login failed";
        toast.error(errorMessage);
        setLoading(false);
        return;
      }

      const accessToken = data?.access_token;
      localStorage.setItem("lg_token", accessToken);

      const userRes = await fetch(`${baseurl}/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userData = await userRes.json();

      if (!userRes.ok) {
        localStorage.removeItem("lg_token");
        const userErrMessage = typeof userData?.detail === "string" ? userData.detail : "Failed to get user information";
        toast.error(userErrMessage);
        setLoading(false);
        return;
      }

      if (userData.id) {
        setAutuser(userData);
        toast.success("Login successful");
        navigator("/");
      }
    } catch (error) {
      
      toast.error(error?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 via-base-100 to-base-300 p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card bg-base-100 shadow-2xl border border-base-300 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                <FiUser className="h-7 w-7 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>

            <p className="text-white/80 text-sm mt-1">
              Sign in to continue to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="card-body gap-4 p-6">
            {/* Username */}
            <div className="form-control w-full">
              <label className="label pb-1">
                <span className="label-text font-semibold text-base-content/80">
                  Username
                </span>
              </label>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-base-content/40">
                  <FiMail className="h-5 w-5" />
                </span>

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="username"
                  className="input input-bordered w-full pl-10 focus:input-primary transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control w-full">
              <div className="flex justify-between items-center pb-1">
                <label className="label p-0">
                  <span className="label-text font-semibold text-base-content/80">
                    Password
                  </span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs link link-primary no-underline hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-base-content/40">
                  <FiLock className="h-5 w-5" />
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10 pr-10 focus:input-primary transition-all"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-base-content/40 hover:text-base-content/70 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5" />
                  ) : (
                    <FiEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2 p-0">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                />

                <span className="label-text text-sm">Remember me</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Sign in"
              )}
            </button>

            {/* Sign Up */}
            <p className="text-center text-sm text-base-content/70 mt-2">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="link link-primary font-semibold no-underline hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;