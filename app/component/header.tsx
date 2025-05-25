"use client";
import React, { useState } from "react";
import {
  FaHome,
  FaHeart,
  FaSearch,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const { isSignedIn, user } = useUser();

  const handleHomeClick = () => {
    console.log("Home clicked");
  };

  const handleFavoriteClick = () => {
    console.log("Favorite clicked");
  };

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-100 w-full shadow-sm">
      <div className="flex items-center space-x-6">
        {/* Logo ve Navigation */}
        <div className="flex items-center space-x-4">
          <img src="logo.png" alt="Logo" className="w-16 h-16 rounded-lg" />

          <div className="flex items-center space-x-6">
            <button
              onClick={handleHomeClick}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <FaHome className="text-purple-600" size={18} />
              <span className="font-medium text-gray-700">Home</span>
            </button>

            <button
              onClick={handleFavoriteClick}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <FaHeart className="text-red-500" size={18} />
              <span className="font-medium text-gray-700">Favorite</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ara..."
              className="pl-4 pr-12 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 p-2 text-gray-400 hover:text-purple-600 transition-colors duration-200"
            >
              <FaSearch size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* User Authentication Section */}
      <div className="flex items-center space-x-4 pr-4">
        {isSignedIn ? (
          // Kullanıcı giriş yapmışsa
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
              <div className="flex flex-col">
                <span className="font-medium text-gray-700 text-sm">
                  {user?.firstName || user?.username || "User"}
                </span>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
          </div>
        ) : (
          // Kullanıcı giriş yapmamışsa
          <div className="flex items-center space-x-3">
            <SignInButton mode="modal">
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-sm">
                <FaUser size={14} />
                <span className="font-medium">Sign In</span>
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="flex items-center space-x-2 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-200">
                <span className="font-medium">Sign Up</span>
              </button>
            </SignUpButton>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
