import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Users, ShoppingBag, Layers, Send } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStats {
  totalCustomers: number;
  totalOrders: number;
  totalSegments: number;
  totalCampaigns: number;
  recentCampaigns: Array<{
    id: number;
    message: string;
    segment: string;
    created_at: string;
    audience_size: number;
    success: number;
    failed: number;
  }>;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("User ID not found. Please log in again.");
        return;
      }

      try {
        const response = await axios.post(
          "https://customer-relationship-management-pi.vercel.app/api/stats/dashboard",
          { userId: parseInt(userId, 10) }
        );
        setStats(response.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-6 w-48 bg-gray-300 rounded-lg mx-auto" />
          <div className="h-4 w-36 bg-gray-200 rounded-lg mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-white to-slate-100 min-h-screen transition-all">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-500">Here’s a snapshot of your CRM activity 👇</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { title: "Total Customers", icon: <Users />, value: stats?.totalCustomers },
          { title: "Total Orders", icon: <ShoppingBag />, value: stats?.totalOrders },
          { title: "Segments", icon: <Layers />, value: stats?.totalSegments },
          { title: "Total Campaigns", icon: <Send />, value: stats?.totalCampaigns },
        ].map(({ title, icon, value }, i) => (
          <Card
            key={i}
            className="hover:scale-[1.03] transition-all shadow-lg border bg-white/70 backdrop-blur-md"
          >
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
              <div className="text-indigo-600">{icon}</div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-gray-900">
                {value?.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Recent Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Performance Chart */}
        <Card className="lg:col-span-2 shadow-md bg-white/80 backdrop-blur-sm transition-all">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 font-semibold">
              📊 Campaign Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats?.recentCampaigns.map((c) => ({
                  name: c.segment,
                  delivered: c.success,
                  failed: c.failed,
                }))}
                margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="delivered" stackId="a" fill="#4F46E5" />
                <Bar dataKey="failed" stackId="a" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Campaigns */}
        <Card className="shadow-md bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 font-semibold">
              📣 Recent Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <ul className="divide-y">
              {stats?.recentCampaigns.map((campaign) => (
                <li key={campaign.id} className="px-6 py-3 hover:bg-gray-50 transition-all">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-800">{campaign.message}</span>
                    <span className="text-xs bg-indigo-100 text-indigo-700 rounded-full px-2 py-0.5">
                      {new Date(campaign.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Audience: {campaign.audience_size}</span>
                    <span>Delivered: {campaign.success}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
