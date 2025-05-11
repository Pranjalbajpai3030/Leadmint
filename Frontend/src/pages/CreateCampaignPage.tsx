import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Send, Sparkles, ArrowLeft } from "lucide-react";
import axios from "axios";

interface ManualCampaignForm {
  campaignName: string;
  subject: string;
  message: string;
}

interface AICampaignForm {
  campaignName: string;
  prompt: string;
  generatedMessage: string;
}

const CreateCampaignPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("manual");
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [customersTargeted, setCustomersTargeted] = useState<number | null>(
    null
  );
  const [showAIModal, setShowAIModal] = useState(false);

  const manualForm = useForm<ManualCampaignForm>();
  const aiForm = useForm<AICampaignForm>();

  const handleManualSubmit = manualForm.handleSubmit(async (data) => {
    const segmentId = localStorage.getItem("segmentId"); // Retrieve segment ID from localStorage
    if (!segmentId) {
      toast.error("Segment ID not found. Please go back and select a segment.");
      return;
    }

    const campaignPayload = {
      segment_id: parseInt(segmentId, 10),
      message: data.message,
    };

    try {
      toast.loading("Creating campaign...");
      const response = await axios.post(
        "https://customer-relationship-management-pi.vercel.app/api/campaigns",
        campaignPayload
      );

      const { customers_targeted } = response.data;

      // Set the number of targeted customers for the modal
      setCustomersTargeted(customers_targeted);

      toast.dismiss();
      toast.success("Campaign created successfully!");
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.dismiss();
      toast.error("Failed to create campaign. Please try again.");
    }
  });

  const handleAISubmit = aiForm.handleSubmit(async (data) => {
    const segmentId = localStorage.getItem("segmentId"); // Retrieve segment ID from localStorage
    if (!segmentId) {
      toast.error("Segment ID not found. Please go back and select a segment.");
      return;
    }

    const aiPayload = {
      segment_id: parseInt(segmentId, 10),
      prompt: data.prompt,
    };

    try {
      toast.loading("Generating message...");
      const response = await axios.post(
        "https://customer-relationship-management-pi.vercel.app/api/campaigns/generate-message",
        aiPayload
      );

      const { message } = response.data;

      if (!message) {
        toast.dismiss();
        toast.error("Failed to generate a valid message. Please try again.");
        return;
      }

      setGeneratedMessage(message);
      setShowAIModal(true);
      toast.dismiss();
    } catch (error) {
      console.error("Error generating message:", error);
      toast.dismiss();
      toast.error("Failed to generate message. Please try again.");
    }
  });

  const handleAIModalConfirm = async () => {
    const segmentId = localStorage.getItem("segmentId"); // Retrieve segment ID from localStorage
    if (!segmentId) {
      toast.error("Segment ID not found. Please go back and select a segment.");
      return;
    }

    const campaignPayload = {
      segment_id: parseInt(segmentId, 10),
      message: generatedMessage,
    };

    try {
      toast.loading("Creating campaign...");
      const response = await axios.post(
        "https://customer-relationship-management-pi.vercel.app/api/campaigns",
        campaignPayload
      );

      const { customers_targeted } = response.data;

      toast.dismiss();
      toast.success("Campaign created successfully!");
      navigate("/campaign-history");
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.dismiss();
      toast.error("Failed to create campaign. Please try again.");
    }
  };

  return (
    <div className="page-container max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Create Campaign
        </h1>
        <p className="text-gray-600">
          Prepare your message for the selected audience segment.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Message</CardTitle>
          <CardDescription>
            Craft your message for the "High Value Customers" segment (347
            recipients).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="manual"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Message</TabsTrigger>
              <TabsTrigger value="ai">AI Message Generator</TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="mt-6">
              <form onSubmit={handleManualSubmit} className="space-y-6">
                <div className="form-group">
                  <label htmlFor="campaignName" className="input-label">
                    Campaign Name
                  </label>
                  <Input
                    id="campaignName"
                    placeholder="High Value Customer Appreciation"
                    {...manualForm.register("campaignName", {
                      required: "Campaign name is required",
                    })}
                  />
                  {manualForm.formState.errors.campaignName && (
                    <span className="text-red-500 text-sm">
                      {manualForm.formState.errors.campaignName.message}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="input-label">
                    Email Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="Thank you for being a valued customer!"
                    {...manualForm.register("subject", {
                      required: "Subject is required",
                    })}
                  />
                  {manualForm.formState.errors.subject && (
                    <span className="text-red-500 text-sm">
                      {manualForm.formState.errors.subject.message}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="input-label">
                    Message Content
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    rows={8}
                    {...manualForm.register("message", {
                      required: "Message content is required",
                    })}
                  />
                  {manualForm.formState.errors.message && (
                    <span className="text-red-500 text-sm">
                      {manualForm.formState.errors.message.message}
                    </span>
                  )}
                </div>
              </form>
            </TabsContent>

            <TabsContent value="ai" className="mt-6">
              <form onSubmit={handleAISubmit} className="space-y-6">
                <div className="form-group">
                  <label htmlFor="prompt" className="input-label">
                    Describe what kind of message you want
                  </label>
                  <div className="flex gap-2">
                    <Textarea
                      id="prompt"
                      placeholder="Example: Create a thank-you message for high-spending customers"
                      rows={2}
                      className="flex-1"
                      {...aiForm.register("prompt", {
                        required: "Prompt is required",
                      })}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-0"
                      disabled={isGeneratingMessage || !aiForm.watch("prompt")}
                      onClick={() => handleAISubmit()}
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      {isGeneratingMessage ? "Generating..." : "Generate"}
                    </Button>
                  </div>
                  {aiForm.formState.errors.prompt && (
                    <span className="text-red-500 text-sm">
                      {aiForm.formState.errors.prompt.message}
                    </span>
                  )}
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button
            variant="outline"
            onClick={() => navigate("/preview-audience")}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Preview
          </Button>

          {activeTab === "manual" ? (
            <Button
              onClick={handleManualSubmit}
              className="gap-1"
              disabled={!manualForm.watch("message")}
            >
              <Send className="h-4 w-4" /> Send Campaign
            </Button>
          ) : (
            <Button
              onClick={handleAISubmit}
              className="gap-1"
              disabled={!aiForm.watch("prompt")}
            >
              <Send className="h-4 w-4" /> Generate Campaign
            </Button>
          )}
        </CardFooter>
      </Card>

      {showAIModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Generated Message</h2>
            <p className="text-gray-700">{generatedMessage}</p>
            <div className="flex justify-center gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAIModal(false)}
                className="gap-1"
              >
                Cancel
              </Button>
              <Button onClick={handleAIModalConfirm} className="gap-1">
                Confirm and Send <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {customersTargeted !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Congratulations!</h2>
            <p className="text-gray-700">
              Your campaign has been sent to {customersTargeted} customers.
            </p>
            <Button
              onClick={() => {
                setCustomersTargeted(null);
                navigate("/campaign-history");
              }}
              className="mt-4"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCampaignPage;
