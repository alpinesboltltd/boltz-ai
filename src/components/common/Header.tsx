"use client";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-bold text-primary-600">Helix</span>
          </Link>
          <nav className="hidden md:ml-10 md:flex md:space-x-8 justify-center flex-1">
            <Link
              href="/integrations"
              className="text-gray-500 hover:text-gray-900"
            >
              Integrations
            </Link>
            <Link href="/pricing" className="text-gray-500 hover:text-gray-900">
              Pricing
            </Link>
            <div className="relative group">
              <button className="text-gray-500 hover:text-gray-900 inline-flex items-center">
                Use Case
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div className="absolute left-0 z-10 hidden w-60 rounded-md bg-white shadow-lg group-hover:block">
                <Link
                  href="/use-case/marketing"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <svg
                      className="mr-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10v4m0 0a4 4 0 004 4h1l2 3v-3h5a2 2 0 002-2v-6a2 2 0 00-2-2h-5V7l-2 3H7a4 4 0 00-4 4z"
                      />
                    </svg>
                    <div className="">
                      <h6 className="font-bold">Marketing Agencies</h6>
                      <p className="font-normal text-xs">
                        For agencies managing clitet leads
                      </p>
                    </div>
                  </div>
                </Link>
                <Link
                  href="/use-case/b2b"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <svg
                      className="mr-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="12" r="2" fill="currentColor" />
                    </svg>

                    <div className="">
                      <h6 className="font-bold">B2B Brands Running Ads</h6>
                      <p className="font-normal text-xs">
                        Optimize ad-driven lead conversion
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div className="relative group">
              <button className="text-gray-500 hover:text-gray-900 inline-flex items-center">
                Resoures
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div className="absolute left-0 z-10 hidden w-60 rounded-md bg-white shadow-lg group-hover:block">
                <Link
                  href="/use-case/marketing"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <svg
                      className="mr-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10v4m0 0a4 4 0 004 4h1l2 3v-3h5a2 2 0 002-2v-6a2 2 0 00-2-2h-5V7l-2 3H7a4 4 0 00-4 4z"
                      />
                    </svg>
                    <div className="">
                      <h6 className="font-bold">Marketing Agencies</h6>
                      <p className="font-normal text-xs">
                        For agencies managing clitet leads
                      </p>
                    </div>
                  </div>
                </Link>
                <Link
                  href="/use-case/b2b"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <svg
                      className="mr-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="12" r="2" fill="currentColor" />
                    </svg>

                    <div className="">
                      <h6 className="font-bold">B2B Brands Running Ads</h6>
                      <p className="font-normal text-xs">
                        Optimize ad-driven lead conversion
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* <Link href="/enterprise" className="text-gray-500 hover:text-gray-900">
                  Enterprise
                </Link>  */}
          </nav>
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="/auth/login"
              className="text-gray-500 hover:text-gray-900"
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
            >
              Sign up free
            </Link>
          </div>
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <Link
              href="/features"
              className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            >
              Features
            </Link>
            <Link
              href="/integrations"
              className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            >
              Integrations
            </Link>
            <Link
              href="/pricing"
              className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            >
              Pricing
            </Link>
            <Link
              href="/enterprise"
              className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            >
              Enterprise
            </Link>
            <Link
              href="/dashboard"
              className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            >
              Dashboard
            </Link>
          </div>
          <div className="border-t border-gray-200 pb-3 pt-4">
            <div className="flex items-center px-5">
              <Link
                href="/auth/login"
                className="block w-full px-3 py-2 text-center text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                className="block w-full px-3 py-2 text-center text-base font-medium text-primary-600 hover:bg-gray-50"
              >
                Sign up free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
