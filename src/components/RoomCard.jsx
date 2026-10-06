import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router";
import { FiDollarSign, FiArrowRight, FiCheckCircle, FiXCircle, FiTool, FiClock, FiHelpCircle } from "react-icons/fi";
import { FaBed } from "react-icons/fa";
import { AuthContext } from "../context/AuthProvider";
import { baseurl } from "../services/Baseurl";

const fallbackImage =
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=80";

const statusMap = {
  1: { label: "Available", className: "bg-emerald-100 text-emerald-700", Icon: FiCheckCircle },
  2: { label: "Occupied", className: "bg-red-100 text-red-700", Icon: FiXCircle },
  3: { label: "Maintenance", className: "bg-amber-100 text-amber-700", Icon: FiTool },
  4: { label: "Reserved", className: "bg-blue-100 text-blue-700", Icon: FiClock },
};

const RoomCard = ({ room }) => {
  const { accessToken } = useContext(AuthContext);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!room?.category_id || !accessToken) return;

      try {
        const res = await fetch(`${baseurl}/specific-category/${room.category_id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          console.error("Category fetch failed:", res.status);
          return;
        }

        const data = await res.json();
        setCategoryTitle(data.name || "");
        setPrice(Number(data.price_per_night) || 0);
      } catch (error) {
        console.error("Category fetch error:", error);
      }
    };

    fetchCategory();
  }, [room?.category_id, accessToken]);

  const currentStatus = statusMap[room.status] || {
    label: "Unknown",
    className: "bg-slate-100 text-slate-600",
    Icon: FiHelpCircle,
  };

  const StatusIcon = currentStatus.Icon;

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img
          src={room.room_image || fallbackImage}
          alt={`Room ${room.room_number}`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(e) => { e.currentTarget.src = fallbackImage; }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
          <p className="text-xs sm:text-sm font-medium text-white/80">Room</p>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {room.room_number}
          </h2>
        </div>

        <div className={`absolute right-3 top-3 sm:right-4 sm:top-4 flex items-center gap-1.5 rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-semibold ${currentStatus.className}`}>
          <StatusIcon className="h-3.5 w-3.5" />
          {currentStatus.label}
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-slate-400">
              Room Type
            </p>

            {categoryTitle ? (
              <h3 className="mt-1 text-base sm:text-lg font-bold text-slate-800 truncate">
                {categoryTitle}
              </h3>
            ) : (
              <div className="mt-2 h-5 w-24 animate-pulse rounded bg-slate-200" />
            )}
          </div>

          <div className="flex-shrink-0 rounded-xl bg-slate-100 px-3 py-2 text-center">
            <p className="text-[10px] sm:text-xs text-slate-400">Floor</p>
            <p className="text-sm sm:text-base font-bold text-slate-700">
              {room.floor}
            </p>
          </div>
        </div>

        <div className="my-4 sm:my-5 border-t border-slate-100" />

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FaBed className="h-4 w-4" />
            </div>
            <span className="truncate">Comfortable</span>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
              <FiDollarSign className="h-4 w-4" />
            </div>
            <span className="truncate">
              {price ? `${price} /Night` : "— /Night"}
            </span>
          </div>
        </div>

        <Link
          to={`/room-details/${room.id}`}
          className="mt-4 sm:mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-900 px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          View Room Details
          <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;