"use client";

import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import { motion } from "framer-motion";
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="TenaPay" width={40} height={40} />
          <h1 className="text-2xl font-bold">TenaPay</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium hover:text-blue-600 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium transition"
          >
            Get Started
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Health Micro-Insurance for Everyone
        </motion.h2>
        <p className="max-w-xl text-gray-600 dark:text-gray-400 mb-8">
          Affordable health coverage powered by ArifPay. Save small, stay
          protected — anytime, anywhere. Join the next generation of financial
          inclusion in Ethiopia.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Create Account
          </Link>
          <Link
            href="/learn-more"
            className="border border-blue-600 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
          >
            Learn More
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-800 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl mb-3">💳</div>
            <h3 className="text-xl font-semibold mb-2">Pay as You Go</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Make small daily or weekly contributions via ArifPay QR or POS.
            </p>
          </div>
          <div>
            <div className="text-4xl mb-3">🏥</div>
            <h3 className="text-xl font-semibold mb-2">Instant Claims</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get reimbursed instantly for medical expenses with your phone
              number.
            </p>
          </div>
          <div>
            <div className="text-4xl mb-3">🌍</div>
            <h3 className="text-xl font-semibold mb-2">Financial Inclusion</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Bringing affordable health coverage to every Ethiopian household.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-gray-100 dark:bg-gray-950 text-gray-600 dark:text-gray-400 text-center py-6 text-sm">
        <p>
          © {new Date().getFullYear()} TenaPay — Built with ❤️ during Arifpay
          Hackathon 2025
        </p>
        <p className="mt-2">
          <a
            href="https://yenettacode.com/arifpay-hackathon/"
            target="_blank"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Yenetta Code x ArifPay
          </a>
        </p>
      </footer>
    </div>
  );
}
