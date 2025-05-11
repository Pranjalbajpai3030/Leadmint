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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { Plus, Trash2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Rule {
  field: string;
  operator: string;
  value: string | number;
}

interface ManualSegmentForm {
  segmentName: string;
}

const SegmentBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("manual");
  const [rules, setRules] = useState<Rule[]>([
    { field: "total_spent", operator: ">", value: "1000" },
  ]);
  const [condition, setCondition] = useState<"AND" | "OR">("AND");
  const [audienceSize, setAudienceSize] = useState<number | null>(null);
  const [aiGeneratedRules, setAIGeneratedRules] = useState<any | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);

  const manualForm = useForm<ManualSegmentForm>();
  const aiForm = useForm<{ segmentName: string; prompt: string }>();

  const addRule = () => {
    setRules([...rules, { field: "total_spent", operator: ">", value: "" }]);
  };

  const removeRule = (index: number) => {
    const newRules = [...rules];
    newRules.splice(index, 1);
    setRules(newRules);
  };

  const updateRule = (index: number, key: keyof Rule, value: string) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [key]: value };
    setRules(newRules);
  };

  const handleManualSubmit = manualForm.handleSubmit(async (data) => {
    const userId = "1";
    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    const segmentPayload = {
      user_id: parseInt(userId, 10),
      name: data.segmentName,
      rules: {
        condition,
        rules: rules.map((rule) => ({
          field: rule.field,
          operator: rule.operator,
          value: rule.value,
        })),
      },
    };

    try {
      toast.loading("Creating segment...");
      const response = await axios.post(
        "https://customer-relationship-management-pi.vercel.app/api/segments/",
        segmentPayload
      );

      const { audience_size, customers } = response.data.segment;
      const segmentId = response.data.segment.id;
      localStorage.setItem("segmentCustomers", JSON.stringify(customers));
      localStorage.setItem("segmentId", segmentId);
      localStorage.setItem("segmentName", response.data.segment.name);
      setAudienceSize(audience_size); // Set audience size for the modal
      toast.dismiss();
      toast.success("Segment created successfully!");
    } catch (error) {
      console.error("Error creating segment:", error);
      toast.dismiss();
      toast.error("Failed to create segment. Please try again.");
    }
  });

  const handleAISubmit = aiForm.handleSubmit(async (data) => {
    const userId = "1";
    const aiPayload = {
      user_id: parseInt(userId, 10),
      segment_name: data.segmentName,
      prompt: data.prompt,
    };

    try {
      toast.loading("Generating rules with AI...");
      const response = await axios.post(
        "https://customer-relationship-management-pi.vercel.app/api/segments/generate-rule",
        aiPayload
      );

      const generatedRules = response.data;
      if (!generatedRules || !generatedRules.rules) {
        toast.dismiss();
        toast.error("Invalid prompt. Please try a new one.");
        return;
      }

      setAIGeneratedRules(generatedRules);
      setShowAIModal(true);
      toast.dismiss();
    } catch (error) {
      console.error("Error generating rules with AI:", error);
      toast.dismiss();
      toast.error("Failed to generate rules. Please try again.");
    }
  });

  const handleAIModalConfirm = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }
    const segmentPayload = {
      user_id: parseInt(userId, 10),
      name: aiGeneratedRules.name,
      rules: aiGeneratedRules.rules,
    };

    try {
      toast.loading("Creating segment...");
      const response = await axios.post(
        "https://customer-relationship-management-pi.vercel.app/api/segments/",
        segmentPayload
      );

      const { audience_size, customers } = response.data.segment;
      const segmentId = response.data.segment.id;
      localStorage.setItem("segmentCustomers", JSON.stringify(customers));
      localStorage.setItem("segmentId", segmentId);
      localStorage.setItem("segmentName", response.data.segment.name);
      setAudienceSize(audience_size);
      setShowAIModal(false);
      toast.dismiss();
      toast.success("Segment created successfully!");
      navigate("/preview-audience");
    } catch (error) {
      console.error("Error creating segment:", error);
      toast.dismiss();
      toast.error("Failed to create segment. Please try again.");
    }
  };

  return (
    <div className="page-container max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Segment Builder
        </h1>
        <p className="text-gray-600">
          Create targeted audience segments for your campaigns.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Segment</CardTitle>
          <CardDescription>
            Define who you want to target with your campaign.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="manual"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Rule Builder</TabsTrigger>
              <TabsTrigger value="ai">AI Generator</TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="mt-6">
              <form onSubmit={handleManualSubmit} className="space-y-6">
                <div className="form-group">
                  <label htmlFor="segmentName" className="input-label">
                    Segment Name
                  </label>
                  <Input
                    id="segmentName"
                    placeholder="High Value Customers"
                    {...manualForm.register("segmentName", {
                      required: "Segment name is required",
                    })}
                  />
                  {manualForm.formState.errors.segmentName && (
                    <span className="text-red-500 text-sm">
                      {manualForm.formState.errors.segmentName.message}
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">Match</h3>
                    <Select
                      value={condition}
                      onValueChange={(value) =>
                        setCondition(value as "AND" | "OR")
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">
                          ALL of the conditions
                        </SelectItem>
                        <SelectItem value="OR">
                          ANY of the conditions
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3 border rounded-md p-4">
                    {rules.map((rule, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-2 items-center"
                      >
                        <div className="col-span-4">
                          <Select
                            value={rule.field}
                            onValueChange={(value) =>
                              updateRule(index, "field", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="total_spent">
                                Total Spent
                              </SelectItem>
                              <SelectItem value="visit_count">
                                Visit Count
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="col-span-3">
                          <Select
                            value={rule.operator}
                            onValueChange={(value) =>
                              updateRule(index, "operator", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value=">">Greater than</SelectItem>
                              <SelectItem value=">=">
                                Greater than or equal
                              </SelectItem>
                              <SelectItem value="<">Less than</SelectItem>
                              <SelectItem value="<=">
                                Less than or equal
                              </SelectItem>
                              <SelectItem value="==">Equal to</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="col-span-4">
                          <Input
                            value={rule.value.toString()}
                            onChange={(e) =>
                              updateRule(index, "value", e.target.value)
                            }
                            placeholder="Value"
                            type="text"
                          />
                        </div>

                        <div className="col-span-1 flex justify-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeRule(index)}
                            disabled={rules.length === 1}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addRule}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Condition
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="ai" className="mt-6">
              <form onSubmit={handleAISubmit} className="space-y-6">
                <div className="form-group">
                  <label htmlFor="aiSegmentName" className="input-label">
                    Segment Name
                  </label>
                  <Input
                    id="aiSegmentName"
                    placeholder="High Value Customers"
                    {...aiForm.register("segmentName", {
                      required: "Segment name is required",
                    })}
                  />
                  {aiForm.formState.errors.segmentName && (
                    <span className="text-red-500 text-sm">
                      {aiForm.formState.errors.segmentName.message}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="prompt" className="input-label">
                    Describe your audience in plain English
                  </label>
                  <Textarea
                    id="prompt"
                    placeholder="Example: Customers who spent more than 1000 and visited in last 30 days"
                    rows={4}
                    {...aiForm.register("prompt", {
                      required: "Prompt is required",
                    })}
                  />
                  {aiForm.formState.errors.prompt && (
                    <span className="text-red-500 text-sm">
                      {aiForm.formState.errors.prompt.message}
                    </span>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    AI will convert your description into targeting rules
                    automatically.
                  </p>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t p-6">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Cancel
          </Button>
          {activeTab === "manual" && (
            <Button onClick={handleManualSubmit} className="gap-1">
              Preview Audience <ChevronRight className="h-4 w-4" />
            </Button>
          )}
          {activeTab === "ai" && (
            <Button onClick={handleAISubmit} className="gap-1">
              Generate Rules <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>

      {showAIModal && aiGeneratedRules && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Generated Rules</h2>
            <p className="text-gray-700">
              AI has generated the following rules for your segment:
            </p>
            <pre className="bg-gray-100 p-4 rounded-md text-left text-sm mt-4">
              {JSON.stringify(aiGeneratedRules.rules, null, 2)}
            </pre>
            <div className="flex justify-center gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAIModal(false)}
                className="gap-1"
              >
                Cancel
              </Button>
              <Button onClick={handleAIModalConfirm} className="gap-1">
                Confirm and Save <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {audienceSize !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Audience Size</h2>
            <p className="text-gray-700">
              This segment contains {audienceSize} users.
            </p>
            <Button
              onClick={() => {
                setAudienceSize(null);
                navigate("/preview-audience");
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

export default SegmentBuilderPage;
