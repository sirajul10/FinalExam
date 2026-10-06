import React, { useContext, useState } from "react";
import { Link } from "react-router";
import { FiMenu, FiUser, FiLogOut, FiKey, FiCalendar, FiHome,FiShield } from "react-icons/fi";
import { MdOutlineHotel } from "react-icons/md";
import { AuthContext } from "../context/AuthProvider";

const Navbar = () => {
  const { authUser, logout } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const closeMenus = () => {
    setMobileOpen(false);
    setProfileOpen(false);
  };

  return (
    <div className="navbar bg-blue-900 px-4 text-white shadow-lg lg:px-8">
      {/* Logo / Mobile menu */}
      <div className="navbar-start">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="btn btn-ghost text-white lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <FiMenu className="h-6 w-6" />
        </button>

        {/* Brand */}
        <Link
          to="/"
          onClick={closeMenus}
          className="btn btn-ghost text-xl font-bold text-white hover:bg-blue-800"
        >
          <MdOutlineHotel className="h-6 w-6 text-cyan-300" />
          Nelson
          <span className="text-cyan-300">Hotel</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-1 px-1">
          <li>
            <Link to="/" className="font-medium text-white hover:bg-blue-800">
              <FiHome className="h-4 w-4" />
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/rooms"
              className="font-medium text-white hover:bg-blue-800"
            >
              <MdOutlineHotel className="h-4 w-4" />
              Rooms
            </Link>
          </li>
        </ul>
      </div>

      {/* Right side */}
      <div className="navbar-end gap-2">
        {authUser ? (
          <div className="dropdown dropdown-end">
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="btn btn-ghost text-white hover:bg-blue-800 gap-2"
              aria-expanded={profileOpen}
            >
              <FiUser className="h-5 w-5" />
              <span className="hidden sm:inline">Profile</span>
            </button>

            {profileOpen && (
              <ul className="menu dropdown-content absolute right-0 mt-2 w-52 rounded-box bg-blue-900 p-2 shadow-lg z-50">
               
               
                {authUser?.role_id === 1 ? (
                    <li><Link to={'/admin'}
                    onClick={closeMenus}
                     className="text-white hover:bg-blue-800">
                      
                   <FiShield className="h-4 w-4" /> Admin
                    </Link>
                    </li>
                ) : null}
                <li>
                  <Link
                    to="/profile"
                    onClick={closeMenus}
                    className="text-white hover:bg-blue-800"
                  >
                    <FiUser className="h-4 w-4" />
                    My Profile
                  </Link>
                </li>

                <li>
                  <Link
                    to="/myreservation"
                    onClick={closeMenus}
                    className="text-white hover:bg-blue-800"
                  >
                    <FiCalendar className="h-4 w-4" />
                    My Reservations
                  </Link>
                </li>

                <li>
                  <Link
                    to="/change-password"
                    onClick={closeMenus}
                    className="text-white hover:bg-blue-800"
                  >
                    <FiKey className="h-4 w-4" />
                    Change Password
                  </Link>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => {
                      closeMenus();
                      logout();
                    }}
                    className="text-white hover:bg-blue-800"
                  >
                    <FiLogOut className="h-4 w-4" />
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="btn btn-ghost text-white hover:bg-blue-800"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Menu (rendered outside navbar-start so it doesn't affect layout) */}
      {mobileOpen && (
        <ul className="menu absolute top-16 left-4 z-50 w-56 rounded-box bg-blue-900 p-3 text-white shadow-lg lg:hidden">
          <li>
            <Link to="/" onClick={closeMenus} className="hover:bg-blue-800">
              <FiHome className="h-4 w-4" />
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/rooms"
              onClick={closeMenus}
              className="hover:bg-blue-800"
            >
              <MdOutlineHotel className="h-4 w-4" />
              Rooms
            </Link>
          </li>

          <li>
            <a
              href="#reservations"
              onClick={closeMenus}
              className="hover:bg-blue-800"
            >
              <FiCalendar className="h-4 w-4" />
              Reservations
            </a>
          </li>

          <li>
            <a
              href="#guests"
              onClick={closeMenus}
              className="hover:bg-blue-800"
            >
              <FiUser className="h-4 w-4" />
              Guests
            </a>
          </li>

          <li>
            <a
              href="#services"
              onClick={closeMenus}
              className="hover:bg-blue-800"
            >
              <FiKey className="h-4 w-4" />
              Services
            </a>
          </li>

          <li>
            <a
              href="#contact"
              onClick={closeMenus}
              className="hover:bg-blue-800"
            >
              Contact
            </a>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Navbar;
