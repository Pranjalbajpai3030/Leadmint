
import React, { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { Loader2Icon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

// Mock campaign data
const campaignsData = [
  {
    id: 1,
    name: 'Summer Sale Promotion',
    segment: 'Active Customers',
    sent: 2500,
    delivered: 2430,
    opened: 1820,
    clicked: 945,
    status: 'completed',
    date: '2023-07-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'New Product Announcement',
    segment: 'All Customers',
    sent: 5000,
    delivered: 4850,
    opened: 3210,
    clicked: 1250,
    status: 'completed',
    date: '2023-07-10T14:00:00Z'
  },
  {
    id: 3,
    name: 'Customer Feedback Request',
    segment: 'Recent Purchasers',
    sent: 1200,
    delivered: 1180,
    opened: 890,
    clicked: 340,
    status: 'completed',
    date: '2023-07-05T09:15:00Z'
  },
  {
    id: 4,
    name: 'Re-engagement Campaign',
    segment: 'Inactive Customers',
    sent: 3800,
    delivered: 3650,
    opened: 1120,
    clicked: 380,
    status: 'completed',
    date: '2023-07-01T11:45:00Z'
  },
  {
    id: 5,
    name: 'Winter Holiday Preview',
    segment: 'VIP Customers',
    sent: 500,
    delivered: 495,
    opened: 410,
    clicked: 230,
    status: 'scheduled',
    date: '2023-10-15T08:00:00Z'
  }
];

// Helper to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

// Status badge color mapping
const statusColorMap: Record<string, string> = {
  completed: 'green',
  scheduled: 'yellow',
  draft: 'gray',
  failed: 'red'
};

// Generate chart data from campaign metrics
const generateChartData = (campaign: any) => [
  { name: 'Opened', value: campaign.opened, color: '#8884d8' },
  { name: 'Not Opened', value: campaign.delivered - campaign.opened, color: '#d0d1e6' },
  { name: 'Failed', value: campaign.sent - campaign.delivered, color: '#fa8072' }
];

const Campaigns = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Filter campaigns based on status
  const filteredCampaigns = filterStatus === 'all' 
    ? campaignsData 
    : campaignsData.filter(campaign => campaign.status === filterStatus);

  const handleViewDetails = (campaign: any) => {
    setSelectedCampaign(campaign);
    setIsDialogOpen(true);
  };

  const handleResend = (campaignId: number) => {
    // Simulate loading state
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Campaign Resent",
        description: `Campaign #${campaignId} has been scheduled for resending.`,
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            View and manage your messaging campaigns
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select 
            value={filterStatus} 
            onValueChange={setFilterStatus}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Link to="/campaign/new">
            <Button>Create Campaign</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaigns List</CardTitle>
          <CardDescription>
            {filteredCampaigns.length} campaigns found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Delivered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>{campaign.segment}</TableCell>
                  <TableCell>{formatDate(campaign.date)}</TableCell>
                  <TableCell>
                    <Badge 
                      className={`bg-${statusColorMap[campaign.status]}-500/20 text-${statusColorMap[campaign.status]}-700 border-${statusColorMap[campaign.status]}-500/50 capitalize`}
                    >
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs">
                        <span>
                          {campaign.delivered} / {campaign.sent}
                        </span>
                        <span>{Math.round((campaign.delivered / campaign.sent) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(campaign.delivered / campaign.sent) * 100}
                        className="h-2"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mr-2"
                      onClick={() => handleViewDetails(campaign)}
                    >
                      View Details
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleResend(campaign.id)}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                          Resending
                        </>
                      ) : (
                        'Resend'
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Campaign Details Dialog */}
      {selectedCampaign && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedCampaign.name}</DialogTitle>
              <DialogDescription>
                Campaign details and performance metrics
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              {/* Campaign Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Campaign Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="font-medium">Target Segment:</dt>
                      <dd>{selectedCampaign.segment}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">Date Sent:</dt>
                      <dd>{formatDate(selectedCampaign.date)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">Status:</dt>
                      <dd>
                        <Badge 
                          className={`bg-${statusColorMap[selectedCampaign.status]}-500/20 text-${statusColorMap[selectedCampaign.status]}-700 border-${statusColorMap[selectedCampaign.status]}-500/50 capitalize`}
                        >
                          {selectedCampaign.status}
                        </Badge>
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">Total Recipients:</dt>
                      <dd>{selectedCampaign.sent.toLocaleString()}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="font-medium">Delivered Rate:</dt>
                      <dd>{Math.round((selectedCampaign.delivered / selectedCampaign.sent) * 100)}%</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">Open Rate:</dt>
                      <dd>{Math.round((selectedCampaign.opened / selectedCampaign.delivered) * 100)}%</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">Click Rate:</dt>
                      <dd>{Math.round((selectedCampaign.clicked / selectedCampaign.delivered) * 100)}%</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">Engagement Rate:</dt>
                      <dd>{Math.round((selectedCampaign.clicked / selectedCampaign.opened) * 100)}%</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Delivery Chart */}
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Delivery Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={generateChartData(selectedCampaign)}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {generateChartData(selectedCampaign).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Campaigns;
