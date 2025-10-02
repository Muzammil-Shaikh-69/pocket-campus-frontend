import { Link, useNavigate } from "react-router-dom";
import { clearToken, getToken } from "../lib/auth";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const authed = Boolean(getToken());
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-black shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center w-full">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0H9m3 0h3"
                  />
                </svg>
              </div>

              <span className="text-white font-bold text-xl">
                Pocket Campus
              </span>
            </Link>

            <button
              className="ml-auto inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 sm:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              <svg
                className={`h-6 w-6 transition-transform ${
                  open ? "rotate-90" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>

          <div className="hidden sm:flex items-center space-x-6">
            {authed && (
              <>
                <Link
                  to="/"
                  className="text-white hover:text-gray-300 transition-colors duration-200 font-medium whitespace-nowrap"
                >
                  Dashboard
                </Link>
                <Link
                  to="/tasks"
                  className="text-white hover:text-gray-300 transition-colors duration-200 font-medium whitespace-nowrap"
                >
                  Tasks
                </Link>
                <Link
                  to="/reports"
                  className="text-white hover:text-gray-300 transition-colors duration-200 font-medium whitespace-nowrap"
                >
                  Reports
                </Link>
              </>
            )}

            {!authed ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-white hover:text-gray-300 transition-colors duration-200 font-medium whitespace-nowrap"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-white hover:text-gray-300 transition-colors duration-200 font-medium whitespace-nowrap"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <button
                className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-all duration-200 backdrop-blur-sm border border-white/30"
                onClick={() => {
                  clearToken();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${open ? "block" : "hidden"} sm:hidden pb-4`}>
          <div className="space-y-2">
            {authed && (
              <>
                <Link
                  to="/"
                  className="block text-white/90 hover:text-white font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/tasks"
                  className="block text-white/90 hover:text-white font-medium"
                >
                  Tasks
                </Link>
                <Link
                  to="/reports"
                  className="block text-white/90 hover:text-white font-medium"
                >
                  Reports
                </Link>
              </>
            )}
            {!authed ? (
              <>
                <Link
                  to="/login"
                  className="block text-white/90 hover:text-white font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-block mt-2 bg-white text-black px-4 py-2 rounded-lg font-medium"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <button
                className="w-full bg-white/20 text-white px-4 py-2 rounded-lg font-medium border border-white/30"
                onClick={() => {
                  clearToken();
                  navigate("/login");
                  setOpen(false);
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
