
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Check, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { createCampaign, Campaign } from '@/lib/api';
import { generateCampaignMessages } from '@/lib/gemini';

interface CampaignBuilderProps {
  segmentRules?: any; // Optional prop to prefill segment rules
  onSuccess?: (campaign: Campaign) => void;
}

const CampaignBuilder: React.FC<CampaignBuilderProps> = ({ segmentRules, onSuccess }) => {
  const [campaignName, setCampaignName] = useState('');
  const [campaignGoal, setCampaignGoal] = useState('');
  const [message, setMessage] = useState('');
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isGeneratingMessages, setIsGeneratingMessages] = useState(false);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [activeTab, setActiveTab] = useState('write');
  const { toast } = useToast();

  // If segment rules are passed, use them
  const [segment] = useState(segmentRules || {
    combinator: 'and',
    rules: [{ field: 'lastActiveDaysAgo', operator: '>', value: 30 }],
  });

  const handleGenerateMessages = async () => {
    if (!campaignGoal.trim()) {
      toast({
        title: "Campaign goal required",
        description: "Please enter a campaign goal to generate message suggestions.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingMessages(true);
    try {
      const messages = await generateCampaignMessages(campaignGoal);
      setSuggestedMessages(messages);
      setActiveTab('suggestions');
    } catch (error) {
      console.error('Error generating messages:', error);
      toast({
        title: "Error",
        description: "Failed to generate message suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingMessages(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setMessage(suggestion);
    setActiveTab('write');
  };

  const handleCreateCampaign = async () => {
    if (!campaignName.trim()) {
      toast({
        title: "Campaign name required",
        description: "Please enter a name for your campaign.",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message for your campaign.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingCampaign(true);
    try {
      const campaign = await createCampaign({
        name: campaignName,
        segmentRules: segment,
        message,
        audienceSize: Math.floor(Math.random() * 2000) + 500, // Simulated for demo
      });

      toast({
        title: "Campaign created",
        description: "Your campaign has been created successfully.",
        variant: "default",
      });

      if (onSuccess) {
        onSuccess(campaign);
      }

      // Reset form
      setCampaignName('');
      setCampaignGoal('');
      setMessage('');
      setSuggestedMessages([]);
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingCampaign(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Campaign</h1>
        <p className="text-muted-foreground">Create a new messaging campaign.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Summer Sale Reactivation"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Campaign Goal</Label>
                <Textarea
                  id="goal"
                  placeholder="e.g., Reactivate customers who haven't purchased in 3 months"
                  value={campaignGoal}
                  onChange={(e) => setCampaignGoal(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateMessages}
                  disabled={isGeneratingMessages || !campaignGoal}
                  className="mt-1"
                >
                  {isGeneratingMessages ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Generate Message Suggestions
                </Button>
              </div>

              <div className="space-y-2">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="write">Write Message</TabsTrigger>
                    <TabsTrigger value="suggestions" disabled={suggestedMessages.length === 0}>
                      Suggestions {suggestedMessages.length > 0 && `(${suggestedMessages.length})`}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="write" className="pt-4">
                    <Label htmlFor="message">Message Content</Label>
                    <Textarea
                      id="message"
                      placeholder="e.g., Hi {name}, we miss you! Come back and enjoy 15% off your next purchase with code WELCOME15."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[120px]"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use {'{name}'} to personalize the message with the customer's name.
                    </p>
                  </TabsContent>
                  <TabsContent value="suggestions" className="pt-4">
                    <div className="space-y-3">
                      {suggestedMessages.map((suggestion, index) => (
                        <div
                          key={index}
                          className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleSelectSuggestion(suggestion)}
                        >
                          <p>{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleCreateCampaign}
                  disabled={isCreatingCampaign || !campaignName || !message}
                  className="w-full sm:w-auto"
                >
                  {isCreatingCampaign ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Create Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Segment Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="font-medium text-sm">Target Criteria:</h4>
                  <ul className="mt-2 text-sm space-y-1">
                    {segment.rules.map((rule: any, index: number) => (
                      <li key={index} className="flex gap-1">
                        <span className="text-muted-foreground">
                          {fieldOptions.find(f => f.value === rule.field)?.label || rule.field}
                        </span>
                        <span>
                          {operatorLabels[rule.operator as keyof typeof operatorLabels]}
                        </span>
                        <span className="font-medium">{rule.value}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    Rules combined with{' '}
                    <span className="font-medium uppercase">{segment.combinator}</span>
                  </p>
                </div>
                <div className="flex justify-between items-center bg-primary/10 p-3 rounded-md">
                  <span className="text-sm font-medium">Estimated Audience:</span>
                  <span className="font-bold">
                    {(Math.floor(Math.random() * 2000) + 500).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Field options for display purposes
const fieldOptions = [
  { value: 'lastActiveDaysAgo', label: 'Days Since Last Active' },
  { value: 'totalSpent', label: 'Total Amount Spent' },
  { value: 'lastPurchaseDaysAgo', label: 'Days Since Last Purchase' },
  { value: 'purchaseCount', label: 'Number of Purchases' },
];

const operatorLabels = {
  '>': 'is greater than',
  '<': 'is less than',
  '=': 'is equal to',
  '>=': 'is at least',
  '<=': 'is at most',
};

export default CampaignBuilder;
