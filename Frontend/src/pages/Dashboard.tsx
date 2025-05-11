
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data for dashboard
const customerGrowthData = [
  { month: 'Jan', customers: 120 },
  { month: 'Feb', customers: 145 },
  { month: 'Mar', customers: 162 },
  { month: 'Apr', customers: 190 },
  { month: 'May', customers: 210 },
];

const campaignPerformanceData = [
  { name: 'Campaign A', sent: 400, delivered: 380, opened: 230, clicked: 100 },
  { name: 'Campaign B', sent: 300, delivered: 290, opened: 180, clicked: 80 },
  { name: 'Campaign C', sent: 500, delivered: 480, opened: 320, clicked: 160 },
];

const customerSegmentationData = [
  { name: 'Active', value: 450 },
  { name: 'Inactive', value: 300 },
  { name: 'New', value: 200 },
  { name: 'At Risk', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const kpiData = [
  { title: 'Total Customers', value: 1050, change: '+5.2%', trend: 'up' },
  { title: 'Active Users', value: 720, change: '+2.3%', trend: 'up' },
  { title: 'Campaigns Sent', value: 24, change: '+8.1%', trend: 'up' },
  { title: 'Avg Open Rate', value: 68.5, change: '-1.2%', trend: 'down' },
];

// Helper function to format number with commas
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Helper function to safely format percentage values
const formatPercent = (value: number | string): string => {
  if (typeof value === 'number') {
    return value.toFixed(1) + '%';
  }
  return value.toString();
};

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your CRM performance and key metrics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpi.title.includes('Rate') ? formatPercent(kpi.value) : formatNumber(kpi.value)}
              </div>
              <p className={`text-xs ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {kpi.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Growth</CardTitle>
            <CardDescription>Monthly new customer acquisition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={customerGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="customers" 
                    stroke="#8884d8" 
                    strokeWidth={2} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Delivery and engagement metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sent" fill="#8884d8" />
                  <Bar dataKey="delivered" fill="#82ca9d" />
                  <Bar dataKey="opened" fill="#ffc658" />
                  <Bar dataKey="clicked" fill="#ff8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Customer Segmentation Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Segmentation</CardTitle>
            <CardDescription>Breakdown of customer segments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerSegmentationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {customerSegmentationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest customer interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">Customer #{item}</p>
                    <p className="text-sm text-muted-foreground">
                      {item % 2 === 0 ? 'Made a purchase' : 'Viewed campaign'}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item} {item === 1 ? 'hour' : 'hours'} ago
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
