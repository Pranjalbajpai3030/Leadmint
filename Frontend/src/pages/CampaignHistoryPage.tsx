import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Search, Calendar, Eye } from "lucide-react";
import axios from "axios";

interface Campaign {
  id: number;
  message: string;
  segmentId: number;
  createdAt: string;
  audienceSize: number;
  sentCount: number;
  failedCount: number;
  status: "completed" | "scheduled" | "failed";
}

const CampaignHistoryPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get(
          "https://customer-relationship-management-pi.vercel.app/api/campaigns/history"
        );

        const fetchedCampaigns = response.data.campaigns.map(
          (campaign: any) => ({
            id: campaign.campaign_id,
            message: campaign.message,
            segmentId: campaign.segment_id,
            createdAt: campaign.created_at,
            audienceSize: parseInt(campaign.audience_size, 10),
            sentCount: parseInt(campaign.sent_count, 10),
            failedCount: parseInt(campaign.failed_count, 10),
            status: campaign.sent_count > 0 ? "completed" : "scheduled",
          })
        );

        setCampaigns(fetchedCampaigns);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.segmentId.toString().includes(searchQuery)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Completed
          </Badge>
        );
      case "scheduled":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Scheduled
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Campaign History
          </h1>
          <p className="text-gray-600">
            Review and analyze your past campaign performance.
          </p>
        </div>

        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search campaigns..."
            className="pl-9 w-full md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>
            Showing {filteredCampaigns.length} of {campaigns.length} campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-700 border-b">
                <tr>
                  <th className="py-3 px-4 font-medium">Message</th>
                  <th className="py-3 px-4 font-medium">Date</th>
                  <th className="py-3 px-4 font-medium text-right">Audience</th>
                  <th className="py-3 px-4 font-medium text-right">Sent</th>
                  <th className="py-3 px-4 font-medium text-right">Failed</th>
                  <th className="py-3 px-4 font-medium text-right">
                    Success Rate
                  </th>
                  <th className="py-3 px-4 font-medium text-center">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {campaign.message}
                    </td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(campaign.createdAt)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {campaign.audienceSize}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {campaign.sentCount}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {campaign.failedCount}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {campaign.audienceSize > 0
                        ? `${(
                            (campaign.sentCount / campaign.audienceSize) *
                            100
                          ).toFixed(2)}%`
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(campaign.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link to={`/campaign/${campaign.id}/details`}>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Eye className="h-4 w-4 mr-1" /> View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <h3 className="text-lg font-medium mb-2">No campaigns found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignHistoryPage;
