import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Users, Layers, ArrowLeft } from "lucide-react";

const PreviewAudiencePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [previewData, setPreviewData] = useState<{
    segmentName: string;
    audienceSize: number;
    sampleCustomers: any[];
  } | null>(null);

  useEffect(() => {
    const fetchPreviewData = () => {
      // Retrieve customers from local storage
      const segmentName = localStorage.getItem("segmentName");
      const storedCustomers = localStorage.getItem("segmentCustomers");
      if (storedCustomers) {
        const customers = JSON.parse(storedCustomers);

        // Transform the data to match the required format
        const sampleCustomers = customers.slice(0, 5).map((customer: any) => ({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          totalSpent: parseFloat(customer.totalamount),
        }));

        setPreviewData({
          segmentName: segmentName,
          audienceSize: customers.length,
          sampleCustomers,
        });
      }
      setLoading(false);
    };

    fetchPreviewData();
  }, []);

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
    <div className="page-container max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Preview Audience
        </h1>
        <p className="text-gray-600">
          Review your selected audience before creating a campaign.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="bg-xeno-secondary p-2 rounded-full">
              <Layers className="h-5 w-5 text-xeno-primary" />
            </div>
            <div>
              <CardTitle>{previewData?.segmentName}</CardTitle>
              <CardDescription>Segment matching your criteria</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-xeno-secondary bg-opacity-50 rounded-lg p-6 flex items-center justify-center gap-4 mb-6">
            <Users className="h-12 w-12 text-xeno-primary" />
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800">
                {previewData?.audienceSize}
              </div>
              <div className="text-gray-600">Total Matching Customers</div>
            </div>
          </div>

          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="py-3 px-4 font-medium">Name</th>
                  <th className="py-3 px-4 font-medium">Email</th>
                  <th className="py-3 px-4 font-medium text-right">
                    Total Spent
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {previewData?.sampleCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{customer.name}</td>
                    <td className="py-3 px-4">{customer.email}</td>
                    <td className="py-3 px-4 text-right">
                      ${customer.totalSpent.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button
            variant="outline"
            onClick={() => navigate("/segment-builder")}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Builder
          </Button>

          <Button
            onClick={() => navigate("/create-campaign")}
            className="gap-1"
          >
            Create Campaign <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PreviewAudiencePage;
