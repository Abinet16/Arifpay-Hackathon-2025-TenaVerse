"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";

export default function AdminUsers() {
  const { data, isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const res = await api.get("/api/admin/users");
      return res.data.users;
    },
  });

  if (isLoading) return <p>Loading users...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Users</h1>
      <table className="w-full text-left bg-white shadow rounded">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-2">Email</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Balance</th>
            <th className="p-2">View</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((u: any) => (
            <tr key={u.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.phone}</td>
              <td className="p-2">{u.balance} ETB</td>
              <td className="p-2">
                <Link
                  href={`/admin/users/${u.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}