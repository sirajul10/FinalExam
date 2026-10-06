import React, { useState } from 'react';
import { FiMail, FiUser, FiLock, FiArrowLeft } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router';
import { baseurl } from '../services/Baseurl';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [username,setusername] =useState("");
    const [new_password,setnew_password] =useState("");
    const [email,setemail] =useState("");
    const navigator = useNavigate();

    const handleSubmit =async(e)=>
    {
        e.preventDefault();
        const formData = {
            username,new_password,email
        }
        const res = await fetch(`${baseurl}/forgot-password`,{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(formData)
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
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-10">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
                {/* Back link */}
                <a
                    href="/login"
                    className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition hover:text-indigo-600"
                >
                    <FiArrowLeft className="h-4 w-4" />
                    Back to login
                </a>

                {/* Icon + Heading */}
                <div className="mb-6 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
                        <FiLock className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Forgot Password?
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Enter your details below to reset your password.
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Username */}
                    <div>
                        <label
                            htmlFor="username"
                            className="mb-1 block text-sm font-semibold text-gray-700"
                        >
                            Username
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <FiUser className="h-4 w-4" />
                            </span>
                            <input
                                type="text"
                                onChange={(e)=>setusername(e.target.value)}
                                value={username}
                                placeholder="Enter your username"
                                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-semibold text-gray-700"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <FiMail className="h-4 w-4" />
                            </span>
                            <input
                                type="email"
                                onChange={(e)=>setemail(e.target.value)}
                                value={email}
                                placeholder="user@example.com"
                                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            />
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label
                            htmlFor="new_password"
                            className="mb-1 block text-sm font-semibold text-gray-700"
                        >
                            New Password
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <FiLock className="h-4 w-4" />
                            </span>
                            <input
                                type="password"
                                onChange={(e)=>setnew_password(e.target.value)}
                                value={new_password}
                                placeholder="Enter new password"
                                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 active:scale-[0.99]"
                    >
                        Reset Password
                    </button>
                </form>

                {/* Footer hint */}
                <p className="mt-6 text-center text-xs text-gray-400">
                    Remembered it?{' '}
                    <Link
                        to="/login"
                        className="font-semibold text-indigo-600 hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;