"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { useSocket } from "@/hooks/useSocket";
import NotificationBell from "@/components/NotificationBell";
import ThemeToggle from "@/components/ThemeToggle";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, PlusCircle, Hospital } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user, logout } = useAuth();

  const [openTopUp, setOpenTopUp] = useState(false);
  const [openClaim, setOpenClaim] = useState(false);
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");

  // ✅ Prevent socket from running before user is available
 const token =
   typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
 useSocket(user?.id, token);


  const { data: transactions, isLoading, refetch } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await api.get("/api/claims/history");
      return res.data.transactions;
    },
    enabled: !!user, // ✅ Only fetch after user is loaded
  });

  // ----- ACTION HANDLERS -----

  async function handleTopUp(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/payments/checkout", {
        phone: user?.phone,
        email: user?.email,
        nonce: `txn-${Date.now()}`,
        items: [{ price: Number(amount), quantity: 1 }],
      });
      toast.success("Redirecting to Arifpay checkout...");
      window.open(data.checkoutUrl, "_blank");
      setOpenTopUp(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Checkout failed");
    }
  }

  async function handleClaim(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post("/api/claims/request", {
        amount: Number(amount),
        phone,
      });
      toast.success("Claim requested successfully");
      setOpenClaim(false);
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Claim failed");
    }
  }

  if (!user)
    return (
      <div className="text-center mt-40 text-gray-500">
        Please login to access your dashboard.
      </div>
    );

  // ----- UI -----
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user.fullName}</h1>
          <p className="text-gray-500 text-sm">Manage your health funds & claims</p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <NotificationBell />
          <Button
            onClick={logout}
            variant="outline"
            className="text-red-600 border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Cards */} 
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-sm border-blue-500/30 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-gray-700 dark:text-gray-200">
              💰 Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.p
              key={user.balance}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-4xl font-bold text-green-600 dark:text-green-400"
            >
              {user.balance.toFixed(2)} ETB
            </motion.p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-yellow-500/30 dark:border-yellow-700 flex flex-col justify-center items-center py-6">
          <Button
            onClick={() => setOpenTopUp(true)}
            className="w-3/4 mb-3 bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Top Up
          </Button>
          <Button
            onClick={() => setOpenClaim(true)}
            className="w-3/4 bg-yellow-500 hover:bg-yellow-600"
          >
            <Hospital className="mr-2 h-4 w-4" /> Request Claim
          </Button>
        </Card>
      </div>

      {/* Transactions */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-700 dark:text-gray-200">
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8 text-gray-400">
              <Loader2 className="animate-spin" />
            </div>
          ) : transactions?.length ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((t: any) => (
                <li
                  key={t.id}
                  className="flex justify-between py-3 text-sm sm:text-base"
                >
                  <span>{t.type}</span>
                  <span
                    className={
                      t.type === "CREDIT" ? "text-green-600" : "text-red-500"
                    }
                  >
                    {t.amount} ETB
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-6">
              No transactions yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* ---- Modals using ShadCN Card + Input ---- */}
      {openTopUp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-sm p-6 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>💳 Add Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTopUp} className="space-y-4">
                <Input
                  type="number"
                  placeholder="Enter amount (ETB)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Proceed
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenTopUp(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {openClaim && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-sm p-6 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>🏥 Request Claim</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleClaim} className="space-y-4">
                <Input
                  type="number"
                  placeholder="Claim amount (ETB)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Phone number (251...)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-yellow-500 hover:bg-yellow-600">
                    Submit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenClaim(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
