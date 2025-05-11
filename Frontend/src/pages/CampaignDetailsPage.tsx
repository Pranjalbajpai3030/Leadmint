
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronUp, 
  ChevronDown, 
  Users, 
  Mail, 
  Eye, 
  MousePointer,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';

interface CampaignDetails {
  id: string;
  name: string;
  date: string;
  segmentName: string;
  audienceSize: number;
  sent: number;
  opened: number;
  clicked: number;
  failed: number;
  status: 'completed' | 'scheduled' | 'failed';
  subject: string;
  message: string;
  engagementMetrics: {
    opens: { time: string; count: number }[];
    clicks: { time: string; count: number }[];
  };
  deliveryPerformance: {
    name: string;
    value: number;
    color: string;
  }[];
  deviceBreakdown: {
    name: string;
    value: number;
  }[];
  messageLog: {
    id: string;
    recipient: string;
    status: 'delivered' | 'opened' | 'clicked' | 'failed';
    timestamp: string;
    error?: string;
  }[];
  aiSummary: string;
}

const CampaignDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    // Mock API call to fetch campaign details
    const fetchCampaignDetails = () => {
      setTimeout(() => {
        const mockCampaign: CampaignDetails = {
          id: id || 'camp-123',
          name: 'Spring Sale Announcement',
          date: '2025-05-10T14:30:00Z',
          segmentName: 'Active Customers',
          audienceSize: 450,
          sent: 438,
          opened: 310,
          clicked: 145,
          failed: 12,
          status: 'completed',
          subject: 'Spring Sale: 20% Off Everything!',
          message: 'Dear Customer,\n\nSpring is here and so are our amazing deals! Enjoy 20% off everything in our store until the end of the month.\n\nShop now at our website or visit our store locations.\n\nThank you for your loyalty!\n\nBest,\nThe Xeno Team',
          engagementMetrics: {
            opens: [
              { time: '2025-05-10 14:45', count: 85 },
              { time: '2025-05-10 15:00', count: 67 },
              { time: '2025-05-10 15:15', count: 43 },
              { time: '2025-05-10 15:30', count: 32 },
              { time: '2025-05-10 16:00', count: 25 },
              { time: '2025-05-10 17:00', count: 38 },
              { time: '2025-05-11 09:00', count: 20 },
            ],
            clicks: [
              { time: '2025-05-10 14:50', count: 35 },
              { time: '2025-05-10 15:05', count: 29 },
              { time: '2025-05-10 15:20', count: 18 },
              { time: '2025-05-10 15:40', count: 15 },
              { time: '2025-05-10 16:10', count: 13 },
              { time: '2025-05-10 17:10', count: 22 },
              { time: '2025-05-11 09:15', count: 13 },
            ]
          },
          deliveryPerformance: [
            { name: 'Delivered', value: 438, color: '#8B5CF6' },
            { name: 'Failed', value: 12, color: '#EF4444' },
          ],
          deviceBreakdown: [
            { name: 'Mobile', value: 210 },
            { name: 'Desktop', value: 85 },
            { name: 'Tablet', value: 15 },
          ],
          messageLog: [
            {
              id: 'msg-001',
              recipient: 'john@example.com',
              status: 'clicked',
              timestamp: '2025-05-10T14:45:23Z'
            },
            {
              id: 'msg-002',
              recipient: 'jane@example.com',
              status: 'opened',
              timestamp: '2025-05-10T14:47:12Z'
            },
            {
              id: 'msg-003',
              recipient: 'robert@example.com',
              status: 'delivered',
              timestamp: '2025-05-10T14:32:05Z'
            },
            {
              id: 'msg-004',
              recipient: 'emily@example.com',
              status: 'clicked',
              timestamp: '2025-05-10T14:50:18Z'
            },
            {
              id: 'msg-005',
              recipient: 'michael@example.com',
              status: 'failed',
              timestamp: '2025-05-10T14:31:00Z',
              error: 'Mailbox full'
            }
          ],
          aiSummary: 'This campaign performed well with an open rate of 70.8% and a click rate of 33.1%, both above industry averages. The engagement was highest in the first hour after sending, with mobile devices dominating at 67.7% of all opens. Consider sending similar campaigns at this time for optimal engagement. The 12 failed deliveries were primarily due to full mailboxes or invalid email addresses.'
        };
        
        setCampaign(mockCampaign);
        setLoading(false);
      }, 1200);
    };
    
    fetchCampaignDetails();
  }, [id]);
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getMessageStatusIcon = (status: string) => {
    switch(status) {
      case 'delivered':
        return <Mail className="h-4 w-4 text-gray-500" />;
      case 'opened':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'clicked':
        return <MousePointer className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];
  
  if (loading) {
    return (
      <div className="page-container flex items-center justify-center h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-48 bg-gray-200 rounded-md mb-4"></div>
          <div className="h-4 w-36 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/campaign-history')} 
            className="mb-2 -ml-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Campaign History
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-1">{campaign?.name}</h1>
          
          <div className="flex items-center gap-3 text-gray-500 text-sm">
            <div>Sent: {formatDate(campaign?.date || '')}</div>
            <div>•</div>
            <div>Segment: {campaign?.segmentName}</div>
            <div>•</div>
            <div>Status: {getStatusBadge(campaign?.status || '')}</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="text-sm text-gray-500 mb-1">Open Rate</div>
              <div className="text-3xl font-bold text-gray-800">
                {campaign ? Math.round(campaign.opened / campaign.sent * 100) : 0}%
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center">
                <ChevronUp className="h-3 w-3 text-green-500" />
                <span>7.2% above average</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="text-sm text-gray-500 mb-1">Click Rate</div>
              <div className="text-3xl font-bold text-gray-800">
                {campaign ? Math.round(campaign.clicked / campaign.sent * 100) : 0}%
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center">
                <ChevronUp className="h-3 w-3 text-green-500" />
                <span>5.8% above average</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="text-sm text-gray-500 mb-1">Delivery Rate</div>
              <div className="text-3xl font-bold text-gray-800">
                {campaign ? Math.round(campaign.sent / campaign.audienceSize * 100) : 0}%
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center">
                <ChevronDown className="h-3 w-3 text-red-500" />
                <span>2.3% below average</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="message">Message</TabsTrigger>
          <TabsTrigger value="logs">Message Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Campaign Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-xeno-secondary bg-opacity-30 rounded-lg p-4 border border-xeno-secondary">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-xeno-primary mt-1" />
                    <p className="text-sm leading-relaxed">{campaign?.aiSummary}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Delivery Performance</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-64 w-full max-w-sm">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={campaign?.deliveryPerformance}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {campaign?.deliveryPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Engagement Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[...campaign?.engagementMetrics.opens || [], ...campaign?.engagementMetrics.clicks || []].sort((a, b) => 
                      new Date(a.time).getTime() - new Date(b.time).getTime()
                    )}
                    margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => value.split(' ')[1]}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      name="Opens" 
                      stroke="#8B5CF6" 
                      activeDot={{ r: 8 }}
                      connectNulls 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      name="Clicks" 
                      stroke="#3B82F6" 
                      connectNulls 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={campaign?.deviceBreakdown}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Campaign Metrics</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-6 font-medium">Audience Size</td>
                      <td className="py-3 px-6 text-right">{campaign?.audienceSize}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-6 font-medium">Emails Sent</td>
                      <td className="py-3 px-6 text-right">{campaign?.sent}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-6 font-medium">Emails Opened</td>
                      <td className="py-3 px-6 text-right">{campaign?.opened}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-6 font-medium">Clicks</td>
                      <td className="py-3 px-6 text-right">{campaign?.clicked}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-6 font-medium">Failed Deliveries</td>
                      <td className="py-3 px-6 text-right">{campaign?.failed}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-6 font-medium">Click-to-Open Rate</td>
                      <td className="py-3 px-6 text-right">
                        {campaign ? Math.round(campaign.clicked / campaign.opened * 100) : 0}%
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-6 font-medium">Average Time to Open</td>
                      <td className="py-3 px-6 text-right">12m 34s</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="message">
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-gray-50">
              <div className="text-sm font-medium text-gray-500">Subject:</div>
              <CardTitle className="text-lg">{campaign?.subject}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="whitespace-pre-line bg-white p-6 border rounded-md min-h-[300px]">
                {campaign?.message}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Message Logs</CardTitle>
              <CardDescription>
                Showing individual message delivery statuses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-700 border-b">
                    <tr>
                      <th className="py-3 px-4 font-medium">Recipient</th>
                      <th className="py-3 px-4 font-medium">Status</th>
                      <th className="py-3 px-4 font-medium">Timestamp</th>
                      <th className="py-3 px-4 font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {campaign?.messageLog.map(log => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">{log.recipient}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            {getMessageStatusIcon(log.status)}
                            <span className="capitalize">{log.status}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {formatDate(log.timestamp)}
                        </td>
                        <td className="py-3 px-4">
                          {log.error && <span className="text-red-500">{log.error}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="border-t p-4 text-center text-sm text-gray-500">
              Showing {campaign?.messageLog.length} of {campaign?.sent} messages. Use filters to refine results.
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignDetailsPage;
