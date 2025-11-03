"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function AdminAudits() {
  const { data, isLoading } = useQuery({
    queryKey: ["adminAudits"],
    queryFn: async () => {
      const res = await api.get("/api/admin/audits");
      return res.data.logs;
    },
  });

  if (isLoading) return <p>Loading audit logs...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Audit Logs</h1>
      <table className="w-full bg-white rounded shadow text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-2">Admin</th>
            <th className="p-2">Action</th>
            <th className="p-2">Target</th>
            <th className="p-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((log: any) => (
            <tr key={log.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{log.admin.email}</td>
              <td className="p-2">{log.action}</td>
              <td className="p-2">{log.targetId || "-"}</td>
              <td className="p-2 text-gray-500">
                {new Date(log.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
