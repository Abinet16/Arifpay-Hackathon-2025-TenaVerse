"use client";
import { useState } from "react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-gray-50 dark:bg-gray-900">
      <button
        className="sm:hidden p-4 text-lg"
        onClick={() => setOpen((o) => !o)}
      >
        ☰
      </button>
      <aside
        className={`${
          open ? "block" : "hidden sm:block"
        } w-full sm:w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-4`}
      >
        <h2 className="text-xl font-semibold mb-6">TenaPay Admin</h2>
        <nav className="flex flex-col gap-2">
          <Link href="/admin" className="hover:text-blue-600">
            🏠 Overview
          </Link>
          <Link href="/admin/users" className="hover:text-blue-600">
            👥 Users
          </Link>
          <Link href="/admin/analytics" className="hover:text-blue-600">
            📊 Analytics
          </Link>
          <Link href="/admin/audits" className="hover:text-blue-600">
            🧾 Audits
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
