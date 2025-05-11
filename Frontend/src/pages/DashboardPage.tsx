import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, ShoppingBag, Layers, Send } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

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
      const userId = localStorage.getItem("userId"); // Retrieve user ID from localStorage
      console.log("User ID:", userId); // Debugging line
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data. Please try again.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center h-[80vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-48 bg-gray-200 rounded-md mb-4"></div>
          <div className="h-4 w-36 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's an overview of your CRM activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Customers
            </CardTitle>
            <Users className="h-5 w-5 text-xeno-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.totalCustomers.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Orders
            </CardTitle>
            <ShoppingBag className="h-5 w-5 text-xeno-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.totalOrders.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Segments
            </CardTitle>
            <Layers className="h-5 w-5 text-xeno-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.totalSegments.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Campaigns
            </CardTitle>
            <Send className="h-5 w-5 text-xeno-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.totalCampaigns.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats?.recentCampaigns.map((campaign) => ({
                  name: campaign.segment,
                  delivered: campaign.success,
                  failed: campaign.failed,
                }))}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="delivered" stackId="a" fill="#8B5CF6" />
                <Bar dataKey="failed" stackId="a" fill="#F87171" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <ul className="divide-y">
              {stats?.recentCampaigns.map((campaign) => (
                <li key={campaign.id} className="px-6 py-3 hover:bg-gray-50">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-800">
                      {campaign.message}
                    </span>
                    <span className="text-xs bg-xeno-secondary text-xeno-primary rounded-full px-2 py-1">
                      {new Date(campaign.created_at).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" }
                      )}
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
