import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { baseurl } from "../services/Baseurl";
import toast from "react-hot-toast";

const Signup = () => {

        const [username,setUsername] = useState("");
        const [first_name,setFirst_name] = useState("");
        const [last_name,setLast_name] = useState("");
        const [email,setEmail] = useState("");
        const [password,setPassword] = useState("");
        const [phone,setPhone] = useState("");
        const navigator = useNavigate();
    const signuphandle = async(e)=>
    {
         e.preventDefault();
        const formdata = {
            username,first_name,last_name,email,password,phone
        }
        const res = await fetch(`${baseurl}/create-user`,{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(formdata)
        });
        const data = await res.json();
        if(!res.ok)
        {
            toast.error(data.detail);
            return;
        }
        toast.success(data.message);
        navigator("/login");
    }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <form className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg" onSubmit={signuphandle}>
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Create Account
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Username */}
          <div className="sm:col-span-2">
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-semibold text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              onChange={(e)=>setUsername(e.target.value)}
              value={username}
              placeholder="Enter your username"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* First Name */}
          <div>
            <label
              htmlFor="first_name"
              className="mb-1 block text-sm font-semibold text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              onChange={(e)=>setFirst_name(e.target.value)}
              value={first_name}
              placeholder="John"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="last_name"
              className="mb-1 block text-sm font-semibold text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
               onChange={(e)=>setLast_name(e.target.value)}
              value={last_name}
              placeholder="Doe"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Email */}
          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-semibold text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
                onChange={(e)=>setEmail(e.target.value)}
              value={email}
              placeholder="user@example.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Phone */}
          <div className="sm:col-span-2">
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-semibold text-gray-700"
            >
              Phone
            </label>
            <input
              type="tel"
              onChange={(e)=>setPhone(e.target.value)}
              value={phone}
              placeholder="+60 12-345 6789"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Password */}
          <div className="sm:col-span-2">
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              onChange={(e)=>setPassword(e.target.value)}
              value={password}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to={"/login"}
            className="font-semibold text-indigo-600 hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
