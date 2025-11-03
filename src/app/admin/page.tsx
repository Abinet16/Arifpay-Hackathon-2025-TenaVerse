"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function AdminOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ["adminOverview"],
    queryFn: async () => {
      const res = await api.get("/api/admin/overview");
      return res.data;
    },
  });

  if (isLoading) return <p>Loading overview...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-sm text-gray-500">Total Users</h2>
          <p className="text-2xl font-semibold">{data?.users}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-sm text-gray-500">Transactions</h2>
          <p className="text-2xl font-semibold">{data?.transactions}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-sm text-gray-500">Total Volume (ETB)</h2>
          <p className="text-2xl font-semibold text-green-600">
            {data?.totalVolume}
          </p>
        </div>
      </div>
    </div>
  );
}
