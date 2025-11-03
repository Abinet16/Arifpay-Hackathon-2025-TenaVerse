"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function AdminAnalytics() {
  const { data } = useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: async () => {
      const res = await api.get("/api/admin/analytics/daily");
      return res.data.data;
    },
  });

  if (!data) return <p>Loading chart...</p>;

  const chartData = {
    labels: data.map((d: any) => d.date),
    datasets: [
      {
        label: "Collected (ETB)",
        data: data.map((d: any) => d.collected),
        borderColor: "rgb(34,197,94)",
        fill: false,
      },
      {
        label: "Claimed (ETB)",
        data: data.map((d: any) => d.claimed),
        borderColor: "rgb(239,68,68)",
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">7-Day Analytics</h1>
      <div className="bg-white p-4 rounded shadow">
        <Line data={chartData} />
      </div>
    </div>
  );
}
