import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold">YourBrand</h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
              Building simple, beautiful, and meaningful digital experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href="/"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="/about"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  About
                </a>
              </li>

              <li>
                <a
                  href="/services"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Services
                </a>
              </li>

              <li>
                <a
                  href="/contact"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Contact
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-gray-400">
              <li>hello@example.com</li>
              <li>+60 12-345 6789</li>
              <li>Kuala Lumpur, Malaysia</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Follow Us
            </h3>

            <div className="mt-5 flex flex-col space-y-3">
              <a
                href="#"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                Facebook
              </a>

              <a
                href="#"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                Instagram
              </a>

              <a
                href="#"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                LinkedIn
              </a>

              <a
                href="#"
                className="text-sm text-gray-400 transition hover:text-white"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-gray-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} YourBrand. All rights reserved.
          </p>

          <div className="flex gap-6">
            <a
              href="/privacy"
              className="text-sm text-gray-500 transition hover:text-white"
            >
              Privacy Policy
            </a>

            <a
              href="/terms"
              className="text-sm text-gray-500 transition hover:text-white"
            >
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
