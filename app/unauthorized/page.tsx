"use client";
import Link from "next/link";
import Image from "next/image";
import { Shield, ArrowLeft, Mail } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image 
              src="/assets/Notes ninja Logo copy.png" 
              alt="NotesNinja" 
              width={120}
              height={32}
              className="h-8 w-auto mx-auto"
            />
          </Link>
        </div>

        {/* Unauthorized Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center">
            {/* Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-red-600" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h1>

            {/* Description */}
            <p className="text-gray-600 mb-6">
              Sorry, you don&apos;t have permission to access the admin panel. 
              This area is restricted to authorized administrators only.
            </p>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">
                If you believe this is an error, please contact the system administrator:
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                <Mail className="w-4 h-4" />
                <span>purohitlokesh46@gmail.com</span>
              </div>
            </div>

            {/* Action Button */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
