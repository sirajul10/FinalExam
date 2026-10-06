import React from "react";
import { Link } from "react-router";
import { FiCalendar, FiHome, FiStar, FiUsers, FiTrendingUp, FiAward } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";

const Banner = () => {
  return (
    <section className="relative min-h-[600px] sm:min-h-[560px] md:min-h-[520px] overflow-hidden bg-slate-900">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/65" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[600px] sm:min-h-[560px] md:min-h-[520px] max-w-7xl items-center px-4 py-20 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-3xl text-white">
          {/* Small Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs sm:text-sm font-medium backdrop-blur-md">
            <HiOutlineSparkles className="h-4 w-4 text-emerald-400" />
            Smart Hotel Management
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Manage Your Hotel
            <span className="block text-emerald-400">Smarter &amp; Easier</span>
          </h1>

          {/* Description */}
          <p className="mt-5 sm:mt-6 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base sm:leading-7 lg:text-lg">
            Manage rooms, reservations, guests, staff, and hotel operations from
            one powerful and easy-to-use platform.
          </p>

          {/* Buttons */}
          <div className="mt-7 sm:mt-8 flex flex-col gap-3 sm:gap-4 sm:flex-row">
            <Link
              to="/create-reservation"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600"
            >
              <FiCalendar className="h-5 w-5" />
              Manage Reservations
            </Link>

            <Link
              to="/rooms"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <FiHome className="h-5 w-5" />
              View Rooms
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-slate-950/40 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
          <div className="flex flex-col items-center gap-1 px-3 py-4 sm:px-6 sm:py-5">
            <FiHome className="h-5 w-5 text-emerald-400" />
            <p className="text-lg sm:text-xl font-bold text-white">120+</p>
            <p className="text-[10px] sm:text-xs text-slate-300 text-center">
              Rooms
            </p>
          </div>

          <div className="flex flex-col items-center gap-1 px-3 py-4 sm:px-6 sm:py-5">
            <FiTrendingUp className="h-5 w-5 text-emerald-400" />
            <p className="text-lg sm:text-xl font-bold text-white">85%</p>
            <p className="text-[10px] sm:text-xs text-slate-300 text-center">
              Occupancy
            </p>
          </div>

          <div className="flex flex-col items-center gap-1 px-3 py-4 sm:px-6 sm:py-5">
            <FiUsers className="h-5 w-5 text-emerald-400" />
            <p className="text-lg sm:text-xl font-bold text-white">2.5K+</p>
            <p className="text-[10px] sm:text-xs text-slate-300 text-center">
              Guests
            </p>
          </div>

          <div className="flex flex-col items-center gap-1 px-3 py-4 sm:px-6 sm:py-5">
            <FiStar className="h-5 w-5 text-emerald-400" />
            <p className="text-lg sm:text-xl font-bold text-white">4.9/5</p>
            <p className="text-[10px] sm:text-xs text-slate-300 text-center">
              Guest Rating
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
