import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { baseurl } from "../services/Baseurl";
import { AuthContext } from "../context/AuthProvider";
import toast from "react-hot-toast";
import {
  FiLoader,
  FiUsers,
  FiHome,
  FiChevronRight,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiCalendar,
  FiStar,
} from "react-icons/fi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { MdOutlineMeetingRoom, MdOutlineHotel } from "react-icons/md";

const RoomDetails = () => {
  const { id } = useParams();
  const { accessToken } = useContext(AuthContext);

  const [room, setRoom] = useState(null);
  const [roomType, setRoomType] = useState(null);
  const [loading, setLoading] = useState(true);

  const fallbackImage =
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=80";

  const fetchRoom = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${baseurl}/specific-room/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.detail || "Failed to fetch room");
        return;
      }

      setRoom(data);

      const catres = await fetch(
        `${baseurl}/specific-category/${data.category_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const catData = await catres.json();

      if (!catres.ok) {
        toast.error(catData.detail || "Failed to fetch room category");
        return;
      }

      setRoomType(catData);
    } catch (error) {
      console.error("Room details error:", error);
      toast.error("Something went wrong while loading the room");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && accessToken) {
      fetchRoom();
    }
  }, [id, accessToken]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />

          <p className="text-gray-500">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (!room || !roomType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <MdOutlineHotel className="w-16 h-16 text-gray-400" />
          </div>

          <h2 className="text-2xl font-semibold text-gray-800">
            Room not found
          </h2>

          <p className="text-gray-500 mt-2">
            We couldn't find the room you're looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <span>Rooms</span>

          <FiChevronRight className="w-4 h-4" />

          <span className="text-gray-900 font-medium">
            Room {room.room_number}
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="relative h-[280px] md:h-[450px] bg-gray-200">
            <img
              src={room.room_image || fallbackImage}
              alt={`Room ${room.room_number}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>

            <div className="absolute top-5 left-5">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                  room.is_active
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {room.is_active ? (
                  <FiCheckCircle className="w-4 h-4" />
                ) : (
                  <FiXCircle className="w-4 h-4" />
                )}

                {room.is_active ? "Active Room" : "Inactive Room"}
              </span>
            </div>

            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-sm font-medium opacity-90">Room</p>

              <p className="text-4xl font-bold">{room.room_number}</p>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
                  {roomType.name}
                </p>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Room {room.room_number}
                </h1>

                <p className="text-gray-500 mt-2">
                  Floor {room.floor} <span className="mx-1">•</span>
                  Room ID #{room.id}
                </p>
              </div>

              <div className="md:text-right">
                <p className="text-3xl font-bold text-gray-900">
                  ${roomType.price_per_night}
                </p>

                <p className="text-gray-500 text-sm">per night</p>
              </div>
            </div>

            <div className="border-t border-gray-100 my-8"></div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                  <FiUsers className="w-5 h-5 text-blue-600" />
                </div>

                <p className="text-sm text-gray-500">Max Occupancy</p>

                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {roomType.max_occupancy} Guests
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
                  <HiOutlineOfficeBuilding className="w-5 h-5 text-purple-600" />
                </div>

                <p className="text-sm text-gray-500">Floor</p>

                <p className="text-lg font-semibold text-gray-900 mt-1">
                  Floor {room.floor}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mb-3">
                  <MdOutlineMeetingRoom className="w-5 h-5 text-orange-600" />
                </div>

                <p className="text-sm text-gray-500">Room Number</p>

                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {room.room_number}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-3">
                  {room.is_active ? (
                    <FiCheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <FiXCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>

                <p className="text-sm text-gray-500">Status</p>

                <p
                  className={`text-lg font-semibold mt-1 ${
                    room.is_active ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {room.is_active ? "Available" : "Unavailable"}
                </p>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About this room
              </h2>

              <p className="text-gray-600 leading-7 max-w-3xl">
                {roomType.description}
              </p>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">
                Room details
              </h2>

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="flex justify-between p-4 border-b md:border-r border-gray-200">
                    <span className="text-gray-500">Room Type</span>

                    <span className="font-medium text-gray-900">
                      {roomType.name}
                    </span>
                  </div>

                  <div className="flex justify-between p-4 border-b border-gray-200">
                    <span className="text-gray-500">Room Number</span>

                    <span className="font-medium text-gray-900">
                      {room.room_number}
                    </span>
                  </div>

                  <div className="flex justify-between p-4 border-b md:border-r border-gray-200">
                    <span className="text-gray-500">Floor</span>

                    <span className="font-medium text-gray-900">
                      {room.floor}
                    </span>
                  </div>

                  <div className="flex justify-between p-4 border-b border-gray-200">
                    <span className="text-gray-500">Maximum Guests</span>

                    <span className="font-medium text-gray-900">
                      {roomType.max_occupancy}
                    </span>
                  </div>

                  <div className="flex justify-between p-4 md:border-r border-gray-200">
                    <span className="text-gray-500">Price</span>

                    <span className="font-medium text-gray-900">
                      ${roomType.price_per_night} / night
                    </span>
                  </div>

                  <div className="flex justify-between p-4">
                    <span className="text-gray-500">Room Status</span>

                    <span
                      className={`font-medium ${
                        room.is_active ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {room.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 p-6 md:p-8 bg-gray-900 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  Ready to book this room?
                </h2>

                <p className="text-gray-400 mt-1">
                  Enjoy your stay in our {roomType.name}.
                </p>
              </div>

              <Link
                to={`/create-reservation/${room.id}`}
                className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition"
              >
                <FiCalendar className="w-5 h-5" />
                Booked Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;