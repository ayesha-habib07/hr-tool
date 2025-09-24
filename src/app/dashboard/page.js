"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import table from '../../components/ui/table'

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Dashboard error:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) return <p className="text-white p-4">Loading dashboard...</p>;
  if (!user) return null;


  const roleName = user.role?.name || user.role;

  return (
    <div className="rounded-lg p-6 text-secondary-dark800 bg-primary-light50 space-y-6">
      <h2 className="text-2xl font-bold mb-6">
        Welcome, {user.name} ({roleName})
      </h2>
      <table />
      

    </div>
  );
}

