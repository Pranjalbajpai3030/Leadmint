
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Send, Sparkles, ArrowLeft } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('manual');
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  
  const manualForm = useForm<ManualCampaignForm>();
  const aiForm = useForm<AICampaignForm>();
  
  const handleManualSubmit = manualForm.handleSubmit(data => {
    // In a real app, this would call the API endpoint
    const campaignPayload = {
      userId: 'user123', // Would come from auth context in real app
      segmentId: 'segment-123', // Would come from previous page context
      campaignName: data.campaignName,
      subject: data.subject,
      message: data.message
    };
    
    console.log('Submitting manual campaign:', campaignPayload);
    
    // Mock API call
    toast.loading('Creating campaign...', { duration: 1500 });
    
    // Simulate successful API response
    setTimeout(() => {
      toast.success('Campaign created successfully!');
      navigate('/campaign-history');
    }, 1500);
  });
  
  const generateMessage = (prompt: string) => {
    setIsGeneratingMessage(true);
    
    // Mock AI generation
    setTimeout(() => {
      const mockGeneratedMessage = 
        `Dear Valued Customer,\n\n` +
        `Thank you for your continued loyalty and support. We're reaching out to express our appreciation ` +
        `for being one of our high-spending customers.\n\n` +
        `As a token of our gratitude, we're pleased to offer you exclusive early access to our upcoming ` +
        `product line, along with a special 15% discount on your next purchase.\n\n` +
        `We value your business and look forward to continuing to serve you.\n\n` +
        `Warm regards,\n` +
        `The Xeno Team`;
      
      setGeneratedMessage(mockGeneratedMessage);
      aiForm.setValue('generatedMessage', mockGeneratedMessage);
      setIsGeneratingMessage(false);
    }, 2500);
  };
  
  const handleAISubmit = aiForm.handleSubmit(data => {
    // In a real app, this would call the API endpoint
    const aiPayload = {
      userId: 'user123', // Would come from auth context in real app
      segmentId: 'segment-123', // Would come from previous page context
      campaignName: data.campaignName,
      message: data.generatedMessage || generatedMessage
    };
    
    console.log('Submitting AI campaign:', aiPayload);
    
    // Mock API call
    toast.loading('Creating campaign...', { duration: 1500 });
    
    // Simulate successful API response
    setTimeout(() => {
      toast.success('Campaign created successfully!');
      navigate('/campaign-history');
    }, 1500);
  });
  
  return (
    <div className="page-container max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Campaign</h1>
        <p className="text-gray-600">Prepare your message for the selected audience segment.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Campaign Message</CardTitle>
          <CardDescription>Craft your message for the "High Value Customers" segment (347 recipients).</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Message</TabsTrigger>
              <TabsTrigger value="ai">AI Message Generator</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual" className="mt-6">
              <form onSubmit={handleManualSubmit} className="space-y-6">
                <div className="form-group">
                  <label htmlFor="campaignName" className="input-label">Campaign Name</label>
                  <Input
                    id="campaignName"
                    placeholder="High Value Customer Appreciation"
                    {...manualForm.register('campaignName', { required: 'Campaign name is required' })}
                  />
                  {manualForm.formState.errors.campaignName && (
                    <span className="text-red-500 text-sm">
                      {manualForm.formState.errors.campaignName.message}
                    </span>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject" className="input-label">Email Subject</label>
                  <Input
                    id="subject"
                    placeholder="Thank you for being a valued customer!"
                    {...manualForm.register('subject', { required: 'Subject is required' })}
                  />
                  {manualForm.formState.errors.subject && (
                    <span className="text-red-500 text-sm">
                      {manualForm.formState.errors.subject.message}
                    </span>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="message" className="input-label">Message Content</label>
                  <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    rows={8}
                    {...manualForm.register('message', { required: 'Message content is required' })}
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
                  <label htmlFor="aiCampaignName" className="input-label">Campaign Name</label>
                  <Input
                    id="aiCampaignName"
                    placeholder="High Value Customer Appreciation"
                    {...aiForm.register('campaignName', { required: 'Campaign name is required' })}
                  />
                  {aiForm.formState.errors.campaignName && (
                    <span className="text-red-500 text-sm">
                      {aiForm.formState.errors.campaignName.message}
                    </span>
                  )}
                </div>
                
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
                      {...aiForm.register('prompt', { required: 'Prompt is required' })}
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      className="mt-0"
                      disabled={isGeneratingMessage || !aiForm.watch('prompt')}
                      onClick={() => generateMessage(aiForm.watch('prompt'))}
                    >
                      <Sparkles className="h-4 w-4 mr-1" /> 
                      {isGeneratingMessage ? 'Generating...' : 'Generate'}
                    </Button>
                  </div>
                  {aiForm.formState.errors.prompt && (
                    <span className="text-red-500 text-sm">
                      {aiForm.formState.errors.prompt.message}
                    </span>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="generatedMessage" className="input-label">Generated Message</label>
                  <div className={`border rounded-md p-4 bg-gray-50 min-h-[12rem] whitespace-pre-line ${!generatedMessage ? 'flex items-center justify-center text-gray-400' : ''}`}>
                    {isGeneratingMessage ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-pulse flex flex-col items-center">
                          <Sparkles className="h-6 w-6 mb-2" />
                          <div>Generating message...</div>
                        </div>
                      </div>
                    ) : generatedMessage ? (
                      <Textarea
                        id="generatedMessage"
                        value={generatedMessage}
                        onChange={(e) => setGeneratedMessage(e.target.value)}
                        rows={10}
                        className="border-0 p-0 bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...aiForm.register('generatedMessage')}
                      />
                    ) : (
                      <div className="text-center">
                        <Sparkles className="h-6 w-6 mx-auto mb-2" />
                        <div>Your AI-generated message will appear here</div>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button variant="outline" onClick={() => navigate('/preview-audience')} className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Preview
          </Button>
          
          {activeTab === 'manual' ? (
            <Button 
              onClick={handleManualSubmit} 
              className="gap-1"
              disabled={!manualForm.watch('message')}
            >
              <Send className="h-4 w-4" /> Send Campaign
            </Button>
          ) : (
            <Button 
              onClick={handleAISubmit} 
              className="gap-1"
              disabled={!generatedMessage}
            >
              <Send className="h-4 w-4" /> Send Campaign
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateCampaignPage;
