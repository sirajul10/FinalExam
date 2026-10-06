import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate, useParams } from "react-router";
import { baseurl } from "../services/Baseurl";
import toast from "react-hot-toast";
import {
  FiLoader,
  FiCalendar,
  FiFileText,
  FiHome,
  FiTag,
  FiDollarSign,
  FiMoon,
  FiInfo,
  FiCheckCircle,
} from "react-icons/fi";

const CreateReservation = () => {
  const { accessToken } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [roomType, setRoomType] = useState(null);
  const [loading, setLoading] = useState(true);

  const [check_in_date, setCheckIndate] = useState("");
  const [check_out_date, setCheckoutDate] = useState("");
  const [special_request, setSpecialRequest] = useState("");

  const [pricePerNight, setPricePernight] = useState(0);
  const [nights, setNights] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [errors, setErrors] = useState({});

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
        alert(data.detail || "Failed to fetch room");
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
        alert(catData.detail || "Failed to fetch room category");
        return;
      }

      setRoomType(catData);
      setPricePernight(Number(catData.price_per_night) || 0);
    } catch (error) {
      console.error("Room details error:", error);
      alert("Something went wrong while loading the room");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken && id) {
      fetchRoom();
    }
  }, [accessToken, id]);

  useEffect(() => {
    if (!check_in_date || !check_out_date) {
      setNights(0);
      setTotalAmount(0);
      return;
    }

    const checkIn = new Date(`${check_in_date}T00:00:00`);
    const checkOut = new Date(`${check_out_date}T00:00:00`);

    const diffInMs = checkOut.getTime() - checkIn.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays <= 0) {
      setNights(0);
      setTotalAmount(0);

      setErrors({
        dates: "Check-out date must be after check-in date.",
      });

      return;
    }

    setErrors({});

    setNights(diffInDays);
    setTotalAmount(diffInDays * pricePerNight);
  }, [check_in_date, check_out_date, pricePerNight]);

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!check_in_date || !check_out_date) {
      setErrors({
        dates: "Please select check-in and check-out dates.",
      });
      return;
    }

    if (nights <= 0) {
      setErrors({
        dates: "Check-out date must be after check-in date.",
      });
      return;
    }

    const reservations = {
      room_id: id,
      check_in_date,
      check_out_date,
      status: "confirm",
      total_amount: totalAmount,
      special_request,
    };

    const res = await fetch(`${baseurl}/create-reservation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(reservations),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.detail);
    }
    toast.success(data.message);
    navigate("/");
  };

  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FiLoader className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!room || !roomType) {
    return (
      <div className="text-center py-20 text-gray-500">Room not found.</div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 md:p-8"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Create Reservation
          </h1>

          <p className="text-gray-500 mb-6">
            Fill in your stay details to book this room.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Check-in */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in Date
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FiCalendar className="h-5 w-5" />
                </span>

                <input
                  type="date"
                  name="check_in_date"
                  min={today}
                  value={check_in_date}
                  onChange={(e) => {
                    setCheckIndate(e.target.value);

                    if (check_out_date && e.target.value >= check_out_date) {
                      setCheckoutDate("");
                    }
                  }}
                  className="w-full rounded-lg border px-3 py-2 pl-10 focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Check-out */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-out Date
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FiCalendar className="h-5 w-5" />
                </span>

                <input
                  type="date"
                  name="check_out_date"
                  min={check_in_date || today}
                  value={check_out_date}
                  onChange={(e) => setCheckoutDate(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 pl-10 focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          {errors.dates && (
            <p className="text-red-500 text-sm mt-2">{errors.dates}</p>
          )}

          {/* Special request */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Request <span className="text-gray-400">(optional)</span>
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute top-3 left-0 flex items-center pl-3 text-gray-400">
                <FiFileText className="h-5 w-5" />
              </span>

              <textarea
                name="special_request"
                rows={4}
                maxLength={500}
                placeholder="e.g. Late check-in, extra pillows, quiet room..."
                value={special_request}
                onChange={(e) => setSpecialRequest(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!check_in_date || !check_out_date || nights <= 0}
            className="mt-8 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            <FiCheckCircle className="h-5 w-5" />
            Confirm
          </button>
        </form>

        <aside className="bg-white rounded-2xl shadow-md p-6 h-fit sticky top-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Booking Summary
          </h2>

          {room.image_url && (
            <img
              src={room.image_url}
              alt={roomType.name || "Room"}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
          )}

          <div className="space-y-3 text-sm">
            {/* Room */}
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-gray-500">
                <FiHome className="h-4 w-4" />
                Room
              </span>

              <span className="font-medium text-gray-800">
                {room.room_number || room.room_id || id}
              </span>
            </div>

            {/* Type */}
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-gray-500">
                <FiTag className="h-4 w-4" />
                Type
              </span>

              <span className="font-medium text-gray-800">
                {roomType.name || "—"}
              </span>
            </div>

            {/* Price per night */}
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-gray-500">
                <FiDollarSign className="h-4 w-4" />
                Price / night
              </span>

              <span className="font-medium text-gray-800">
                ${Number(pricePerNight).toFixed(2)}
              </span>
            </div>

            {/* Nights */}
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-gray-500">
                <FiMoon className="h-4 w-4" />
                Nights
              </span>

              <span className="font-medium text-gray-800">{nights}</span>
            </div>
          </div>

          <hr className="my-4" />

          {/* Total */}
          <div className="flex justify-between text-base font-semibold text-gray-900">
            <span>Total</span>

            <span>${Number(totalAmount).toFixed(2)}</span>
          </div>

          <p className="flex items-start gap-2 text-xs text-gray-400 mt-3">
            <FiInfo className="h-4 w-4 flex-shrink-0 mt-0.5" />
            You won't be charged until your reservation is confirmed.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default CreateReservation;
