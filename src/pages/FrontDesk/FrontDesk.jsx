import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { baseurl } from "../../services/Baseurl";
import toast from "react-hot-toast";

const STATUS = {
  confirm: { label: "Confirmed", chip: "bg-sky-50 text-sky-800 ring-sky-200", bar: "bg-sky-500" },
  checked_in: { label: "Checked in", chip: "bg-emerald-50 text-emerald-800 ring-emerald-200", bar: "bg-emerald-500" },
  checked_out: { label: "Checked out", chip: "bg-slate-100 text-slate-700 ring-slate-300", bar: "bg-slate-400" },
  cancelled: { label: "Cancelled", chip: "bg-rose-50 text-rose-800 ring-rose-200", bar: "bg-rose-500" },
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const nightsBetween = (a, b) => Math.max(1, Math.round((new Date(b) - new Date(a)) / 86400000));

const isToday = (iso) => new Date(iso).toDateString() === new Date().toDateString();

const StatusChip = ({ status }) => {
  const s = STATUS[status] || { label: status, chip: "bg-slate-100 text-slate-700 ring-slate-300" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${s.chip}`}>
      {s.label}
    </span>
  );
};

const FrontDesk = () => {
  const { accessToken } = useContext(AuthContext);
  const [reserveInfo, setReserveInfo] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);

 
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [guestIds, setGuestIds] = useState(null); 
  const [guestMap, setGuestMap] = useState({});
  const [searching, setSearching] = useState(false);

  const authHeaders = { Authorization: `Bearer ${accessToken}` };

  const fetchReservations = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
    
      if (guestIds && guestIds.length === 0) {
        setReservations([]);
        setTotalPages(1);
        return;
      }

      const size = guestIds ? 100 : pageSize;
      const pageNo = guestIds ? 1 : page;

      const res = await fetch(
        `${baseurl}/front-desk/reservations?page=${pageNo}&page_size=${size}`,
        { headers: authHeaders }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.detail);
        return;
      }

      if (guestIds) {
        setReservations(data.reservations.filter((r) => guestIds.includes(r.user_id)));
        setTotalPages(1);
      } else {
        setReservations(data.reservations);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      toast.error("Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${baseurl}/front-desk/dashboard`, { headers: authHeaders });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.detail);
        return;
      }
      setReserveInfo(data);
    } catch (error) {
      toast.error("Failed to load summary");
    }
  };

  useEffect(() => {
    if (accessToken) fetchDashboard();
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) fetchReservations();
  }, [accessToken, page, guestIds]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const term = query.trim();
    if (!term) {
      clearSearch();
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(
        `${baseurl}/front-desk/guests/search/${encodeURIComponent(term)}`,
        { headers: authHeaders }
      );
      const data = await res.json();

      if (res.status === 404) {
        setGuestMap({});
        setGuestIds([]);
        setSearchTerm(term);
        setPage(1);
        return;
      }
      if (!res.ok) {
        toast.error(data.detail);
        return;
      }

      const map = {};
      data.forEach((u) => (map[u.id] = u.username));
      setGuestMap(map);
      setGuestIds(data.map((u) => u.id));
      setSearchTerm(term);
      setPage(1);
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSearchTerm("");
    setGuestIds(null);
    setGuestMap({});
    setPage(1);
  };
  const runAction = async (id, kind) => {
    setActingId(id);
    try {
      const res = await fetch(`${baseurl}/front-desk/${kind}/${id}`, {
        method: "PUT",
        headers: authHeaders,
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.detail);
        return;
      }
      toast.success(data.message);
      await Promise.all([fetchReservations(true), fetchDashboard()]);
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    } finally {
      setActingId(null);
    }
  };

  const total = reserveInfo?.total_reservations ?? 0;
  const counts = {
    confirm: Math.max(
      0,
      total - (reserveInfo?.checked_in ?? 0) - (reserveInfo?.checked_out ?? 0) - (reserveInfo?.cancelled ?? 0)
    ),
    checked_in: reserveInfo?.checked_in ?? 0,
    checked_out: reserveInfo?.checked_out ?? 0,
    cancelled: reserveInfo?.cancelled ?? 0,
  };

  const searchActive = guestIds !== null;

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Front desk</h1>
          <p className="mt-1 text-sm text-slate-600">
            Every reservation, with where each guest is in their stay.
          </p>
        </header>

        {/* Summary */}
        <section aria-label="Reservation summary" className="mb-8 rounded-xl border border-stone-200 bg-white p-5 sm:p-6">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-semibold tabular-nums">{reserveInfo ? total : "–"}</span>
            <span className="text-sm text-slate-600">total reservations</span>
          </div>

          <div
            className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-stone-100"
            role="img"
            aria-label="Share of reservations by status"
          >
            {total > 0 &&
              Object.entries(counts).map(([key, n]) =>
                n > 0 ? (
                  <div
                    key={key}
                    className={`${STATUS[key].bar} h-full`}
                    style={{ width: `${(n / total) * 100}%` }}
                    title={`${STATUS[key].label}: ${n}`}
                  />
                ) : null
              )}
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
            {Object.entries(counts).map(([key, n]) => (
              <div key={key} className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${STATUS[key].bar}`} aria-hidden="true" />
                <dt className="text-sm text-slate-600">{STATUS[key].label}</dt>
                <dd className="ml-auto text-sm font-semibold tabular-nums sm:ml-1">{n}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Reservations table */}
        <section aria-label="Reservations" className="overflow-hidden rounded-xl border border-stone-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-stone-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold">Reservations</h2>
              {!searchActive && (
                <p className="text-sm text-slate-500">
                  Page {page} of {totalPages}
                </p>
              )}
              {searchActive && (
                <p className="text-sm text-slate-500">
                  {reservations.length} result{reservations.length === 1 ? "" : "s"} for “{searchTerm}”
                </p>
              )}
            </div>

            <form onSubmit={handleSearch} className="flex w-full gap-2 sm:w-auto" role="search">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search guest by name"
                aria-label="Search guest by name"
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 sm:w-64"
              />
              <button
                type="submit"
                disabled={searching}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:opacity-50"
              >
                {searching ? "Searching…" : "Search"}
              </button>
              {searchActive && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                >
                  Clear
                </button>
              )}
            </form>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-stone-50 text-xs font-medium text-slate-500">
                <tr>
                  <th className="px-5 py-3">Booking</th>
                  <th className="px-3 py-3">Guest</th>
                  <th className="px-3 py-3">Room</th>
                  <th className="px-3 py-3">Stay</th>
                  <th className="px-3 py-3 text-right">Amount</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Request</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading &&
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={8} className="px-5 py-4">
                        <div className="h-4 w-full animate-pulse rounded bg-stone-100" />
                      </td>
                    </tr>
                  ))}

                {!loading && reservations.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center text-slate-500">
                      {searchActive
                        ? `No reservations found for “${searchTerm}”. Check the spelling or clear the search.`
                        : "No reservations yet. New bookings will appear here."}
                    </td>
                  </tr>
                )}

                {!loading &&
                  reservations.map((r) => (
                    <tr key={r.id} className="hover:bg-stone-50">
                      <td className="px-5 py-4 font-medium tabular-nums">#{r.id}</td>
                      <td className="px-3 py-4 text-slate-700">
                        {guestMap[r.user_id] || `Guest ${r.user_id}`}
                      </td>
                      <td className="px-3 py-4 text-slate-700">Room {r.room_id ?? "–"}</td>
                      <td className="px-3 py-4">
                        <div className="text-slate-900">
                          {formatDate(r.check_in_date)} – {formatDate(r.check_out_date)}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                          {nightsBetween(r.check_in_date, r.check_out_date)} nights
                          {isToday(r.check_in_date) && r.status === "confirm" && (
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 font-medium text-amber-800">
                              Arrives today
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-right font-medium tabular-nums">
                        ${Number(r.total_amount).toLocaleString()}
                      </td>
                      <td className="px-3 py-4">
                        <StatusChip status={r.status} />
                      </td>
                      <td className="max-w-[160px] truncate px-3 py-4 text-slate-600" title={r.special_request}>
                        {r.special_request || <span className="text-slate-400">None</span>}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {r.status === "confirm" && (
                          <button
                            onClick={() => runAction(r.id, "check-in")}
                            disabled={actingId === r.id}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:opacity-50"
                          >
                            {actingId === r.id ? "Checking in…" : "Check in"}
                          </button>
                        )}
                        {r.status === "checked_in" && (
                          <button
                            onClick={() => runAction(r.id, "check-out")}
                            disabled={actingId === r.id}
                            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:opacity-50"
                          >
                            {actingId === r.id ? "Checking out…" : "Check out"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination (hidden while searching) */}
          {!searchActive && (
            <div className="flex items-center justify-between border-t border-stone-200 px-5 py-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default FrontDesk;