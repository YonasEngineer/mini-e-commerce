"use client";

import { useCartStore } from "@/store/cart-store";
import { useState } from "react";
import { selectCartTotalPrice } from "@/store/cart-store";
import { useCartModalContext } from "@/context/CartSidebarModalContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const totalPrice = selectCartTotalPrice(cartItems);
  const { openCartModal } = useCartModalContext();
  const { isCartModalOpen } = useCartModalContext();
  console.log("see the isCartModalOpen", isCartModalOpen);
  const handleOpenCartModal = () => {
    openCartModal();
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            {" "}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-bold text-gray-800">
                F
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none">Flikia</span>
                <span className="text-xs text-yellow-400">Delivery</span>
              </div>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center flex-1 mx-8">
            {/* Categories Dropdown */}
            <select className="bg-gray-700 text-white px-4 py-2 rounded-l border-r border-gray-600 outline-none cursor-pointer hover:bg-gray-600 transition">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Food & Drinks</option>
              <option>Fashion</option>
              <option>Books</option>
            </select>

            {/* Search Input */}
            <input
              type="text"
              placeholder="I am shopping for..."
              className="flex-1 bg-gray-700 text-white px-4 py-2 outline-none placeholder-gray-400 focus:bg-gray-600 transition"
            />

            {/* Search Button */}
            <button className="bg-yellow-400 text-gray-800 px-6 py-2 rounded-r font-semibold hover:bg-yellow-500 transition">
              🔍
            </button>
          </div>

          {/* Right Section - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            {/* Support */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">24/7 SUPPORT</span>
              <span className="text-sm font-semibold">+1 (212) 555-1234</span>
            </div>

            {/* Account */}
            <div className="flex items-center gap-2 cursor-pointer hover:text-yellow-400 transition">
              <span className="text-lg">👤</span>
              <span className="text-sm">Sign In</span>
            </div>

            {/* Cart */}
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-yellow-400 transition relative"
              onClick={handleOpenCartModal}
            >
              <span className="text-lg">🛒</span>
              <div className="flex flex-col">
                <span className="text-sm">CART</span>
                <span className="text-sm font-bold"> {totalPrice} </span>
              </div>
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-800 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cartItems.length ?? ""}
              </span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 cursor-pointer"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-all ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-all ${isMenuOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-all ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            ></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 border-t border-gray-700">
            <div className="py-4 flex flex-col gap-4">
              {/* Mobile Search */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="I am shopping for..."
                  className="flex-1 bg-gray-700 text-white px-4 py-2 rounded outline-none placeholder-gray-400 focus:bg-gray-600 transition text-sm"
                />
                <button className="bg-yellow-400 text-gray-800 px-4 py-2 rounded font-semibold hover:bg-yellow-500 transition">
                  🔍
                </button>
              </div>

              {/* Mobile Categories */}
              <select className="w-full bg-gray-700 text-white px-4 py-2 rounded outline-none cursor-pointer hover:bg-gray-600 transition text-sm">
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Food & Drinks</option>
                <option>Fashion</option>
                <option>Books</option>
              </select>

              {/* Mobile Links */}
              <div className="flex flex-col gap-3 pt-2 border-t border-gray-700">
                <div className="flex items-center gap-2 text-sm cursor-pointer hover:text-yellow-400 transition">
                  <span>📞</span>
                  <span>+1 (212) 555-1234</span>
                </div>
                <div className="flex items-center gap-2 text-sm cursor-pointer hover:text-yellow-400 transition">
                  <span>👤</span>
                  <span>Sign In</span>
                </div>
                <div className="flex items-center gap-2 text-sm cursor-pointer hover:text-yellow-400 transition">
                  <span>🛒</span>
                  <span>CART - $99010</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
