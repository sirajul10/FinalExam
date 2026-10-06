import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { baseurl } from '../services/Baseurl';
import toast from 'react-hot-toast';

const Myreservations = () => {
    const { authUser, accessToken } = useContext(AuthContext);
    const [myreservations, setMyreservations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReservation = async () => {
        if (!authUser) return;

        try {
            setLoading(true);
            const res = await fetch(`${baseurl}/myreservations`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.detail);
                return;
            }
            // Filter out cancelled reservations
            const activeReservations = data.filter(
                (reservation) => reservation.status !== 'cancel'
            );
            setMyreservations(activeReservations);
        } catch (error) {
            toast.error('Failed to load reservations');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (reservationId) => {
        const confirmCancel = window.confirm(
            'Are you sure you want to cancel this reservation?'
        );
        if (!confirmCancel) return;

        try {
            const res = await fetch(
                `${baseurl}/myreservations/${reservationId}/cancel`,
                {
                    method: 'PUT', // change to PATCH/POST if your API requires
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.detail || 'Failed to cancel reservation');
                return;
            }

            toast.success('Reservation cancelled successfully');
            // Remove cancelled reservation from the list
            setMyreservations((prev) =>
                prev.filter((r) => r.id !== reservationId)
            );
        } catch (error) {
            toast.error('Something went wrong');
            console.error(error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getNights = (checkIn, checkOut) => {
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        const diffTime = Math.abs(outDate - inDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getStatusBadge = (status) => {
        const statusStyles = {
            confirm: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            cancel: 'bg-red-100 text-red-800'
        };
        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                    statusStyles[status] || 'bg-gray-100 text-gray-800'
                }`}
            >
                {status}
            </span>
        );
    };

    useEffect(() => {
        if (!accessToken) return;
        fetchReservation();
    }, [accessToken]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (myreservations.length === 0) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">My Reservations</h1>
                <div className="bg-white rounded-lg shadow p-10 text-center">
                    <p className="text-gray-500 text-lg">
                        You have no active reservations.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">My Reservations</h1>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Reservation ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Check In
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Check Out
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nights
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Special Request
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {myreservations.map((reservation) => (
                            <tr
                                key={reservation.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{reservation.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {formatDate(reservation.check_in_date)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {formatDate(reservation.check_out_date)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {getNights(
                                        reservation.check_in_date,
                                        reservation.check_out_date
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                    ${reservation.total_amount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(reservation.status)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                                    {reservation.special_request || '—'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <button
                                        onClick={() =>
                                            handleCancel(reservation.id)
                                        }
                                        className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {myreservations.map((reservation) => (
                    <div
                        key={reservation.id}
                        className="bg-white rounded-lg shadow p-4"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-bold text-gray-900">
                                Reservation #{reservation.id}
                            </span>
                            {getStatusBadge(reservation.status)}
                        </div>
                        <div className="space-y-2 text-sm text-gray-700">
                            <p>
                                <span className="font-medium">Check In:</span>{' '}
                                {formatDate(reservation.check_in_date)}
                            </p>
                            <p>
                                <span className="font-medium">Check Out:</span>{' '}
                                {formatDate(reservation.check_out_date)}
                            </p>
                            <p>
                                <span className="font-medium">Nights:</span>{' '}
                                {getNights(
                                    reservation.check_in_date,
                                    reservation.check_out_date
                                )}
                            </p>
                            <p>
                                <span className="font-medium">Total:</span> $
                                {reservation.total_amount}
                            </p>
                            {reservation.special_request && (
                                <p>
                                    <span className="font-medium">
                                        Special Request:
                                    </span>{' '}
                                    {reservation.special_request}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => handleCancel(reservation.id)}
                            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md transition-colors"
                        >
                            Cancel Reservation
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Myreservations;