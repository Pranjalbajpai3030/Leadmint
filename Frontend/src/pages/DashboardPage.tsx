
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, ShoppingBag, Layers, Send } from 'lucide-react';

interface DashboardStats {
  totalCustomers: number;
  totalSegments: number;
  totalCampaigns: number;
  recentCampaigns: Array<{
    id: string;
    name: string;
    date: string;
    audienceSize: number;
    delivered: number;
  }>;
  campaignPerformance: Array<{
    name: string;
    delivered: number;
    opened: number;
    clicked: number;
  }>;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Mock API call
    const fetchDashboardData = () => {
      // In a real app, this would be an API call
      const mockData: DashboardStats = {
        totalCustomers: 1874,
        totalSegments: 12,
        totalCampaigns: 35,
        recentCampaigns: [
          {
            id: "camp-123",
            name: "Spring Sale Announcement",
            date: "2025-05-10",
            audienceSize: 450,
            delivered: 438,
          },
          {
            id: "camp-122",
            name: "Customer Feedback Survey",
            date: "2025-05-05",
            audienceSize: 1200,
            delivered: 1150,
          },
          {
            id: "camp-121",
            name: "Product Update - v2.0",
            date: "2025-04-28",
            audienceSize: 750,
            delivered: 742,
          },
          {
            id: "camp-120",
            name: "VIP Customer Appreciation",
            date: "2025-04-15",
            audienceSize: 124,
            delivered: 124,
          }
        ],
        campaignPerformance: [
          {
            name: "Jan",
            delivered: 400,
            opened: 300,
            clicked: 180
          },
          {
            name: "Feb",
            delivered: 500,
            opened: 398,
            clicked: 220
          },
          {
            name: "Mar",
            delivered: 600,
            opened: 500,
            clicked: 350
          },
          {
            name: "Apr",
            delivered: 780,
            opened: 600,
            clicked: 420
          },
          {
            name: "May",
            delivered: 890,
            opened: 740,
            clicked: 510
          }
        ]
      };
      
      setStats(mockData);
      setLoading(false);
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
        <p className="text-gray-600">Welcome back! Here's an overview of your CRM activity.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Customers</CardTitle>
            <Users className="h-5 w-5 text-xeno-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalCustomers.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
            <ShoppingBag className="h-5 w-5 text-xeno-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2,150</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Segments</CardTitle>
            <Layers className="h-5 w-5 text-xeno-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalSegments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Campaigns</CardTitle>
            <Send className="h-5 w-5 text-xeno-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalCampaigns}</div>
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
                data={stats?.campaignPerformance}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="delivered" stackId="a" fill="#8B5CF6" />
                <Bar dataKey="opened" stackId="a" fill="#A78BFA" />
                <Bar dataKey="clicked" stackId="a" fill="#C4B5FD" />
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
              {stats?.recentCampaigns.map(campaign => (
                <li key={campaign.id} className="px-6 py-3 hover:bg-gray-50">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-800">{campaign.name}</span>
                    <span className="text-xs bg-xeno-secondary text-xeno-primary rounded-full px-2 py-1">
                      {new Date(campaign.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Audience: {campaign.audienceSize}</span>
                    <span>Delivered: {campaign.delivered}</span>
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
