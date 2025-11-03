"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.push("/dashboard");
    }
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  if (!user) return <div className="p-6 text-center">Loading...</div>;
  return <>{children}</>;
}
