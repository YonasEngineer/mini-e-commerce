"use client";

import { MapPin, Phone, Mail } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900">
              Mini E-commerce
            </h3>
            <p className="text-sm text-slate-600">
              Fast delivery service for all your favorite meals and products
              right to your doorstep.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              <a
                href="#"
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Contact</h4>
            <ul className="space-y-3">
              <li className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600">
                  123 Delivery Street, City, Country
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <a
                  href="tel:+1212555"
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  +1 (212) 555-1234
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <a
                  href="mailto:support@flikia.com"
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  support@mini.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8">
          <p className="text-sm text-slate-600">
            © {currentYear} Mini E-commerce Delivery. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link
              href="/terms"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/cookies"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
