
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from 'react-hook-form';
import { Plus, Trash2, ChevronRight, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface RuleGroup {
  condition: 'AND' | 'OR';
  rules: Rule[];
}

interface Rule {
  field: string;
  operator: string;
  value: string | number;
}

interface ManualSegmentForm {
  segmentName: string;
  ruleGroup: RuleGroup;
}

interface AISegmentForm {
  segmentName: string;
  prompt: string;
}

const SegmentBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('manual');
  const [rules, setRules] = useState<Rule[]>([
    { field: 'totalSpent', operator: '>', value: '1000' }
  ]);
  const [condition, setCondition] = useState<'AND' | 'OR'>('AND');
  
  const manualForm = useForm<ManualSegmentForm>();
  const aiForm = useForm<AISegmentForm>();
  
  const addRule = () => {
    setRules([...rules, { field: 'totalSpent', operator: '>', value: '' }]);
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
  
  const handleManualSubmit = manualForm.handleSubmit(data => {
    // In a real app, this would call the API endpoint
    const segmentPayload = {
      userId: 'user123', // Would come from auth context in real app
      segmentName: data.segmentName,
      rules: {
        condition,
        rules
      }
    };
    
    console.log('Submitting manual segment:', segmentPayload);
    
    // Mock API call
    toast.loading('Creating segment...', { duration: 1500 });
    
    // Simulate successful API response
    setTimeout(() => {
      toast.success('Segment created successfully!');
      navigate('/preview-audience');
    }, 1500);
  });
  
  const handleAISubmit = aiForm.handleSubmit(data => {
    // In a real app, this would call the API endpoint
    const aiPayload = {
      userId: 'user123', // Would come from auth context in real app
      segmentName: data.segmentName,
      prompt: data.prompt
    };
    
    console.log('Submitting AI segment:', aiPayload);
    
    // Mock API call
    toast.loading('Generating segment with AI...', { duration: 2500 });
    
    // Simulate successful API response
    setTimeout(() => {
      toast.success('AI segment created successfully!');
      navigate('/preview-audience');
    }, 2500);
  });
  
  return (
    <div className="page-container max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Segment Builder</h1>
        <p className="text-gray-600">Create targeted audience segments for your campaigns.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Create Segment</CardTitle>
          <CardDescription>Define who you want to target with your campaign.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Rule Builder</TabsTrigger>
              <TabsTrigger value="ai">AI Generator</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual" className="mt-6">
              <form onSubmit={handleManualSubmit} className="space-y-6">
                <div className="form-group">
                  <label htmlFor="segmentName" className="input-label">Segment Name</label>
                  <Input
                    id="segmentName"
                    placeholder="High Value Customers"
                    {...manualForm.register('segmentName', { required: 'Segment name is required' })}
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
                    <Select value={condition} onValueChange={(value) => setCondition(value as 'AND' | 'OR')}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">ALL of the conditions</SelectItem>
                        <SelectItem value="OR">ANY of the conditions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3 border rounded-md p-4">
                    {rules.map((rule, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-4">
                          <Select
                            value={rule.field}
                            onValueChange={(value) => updateRule(index, 'field', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="totalSpent">Total Spent</SelectItem>
                              <SelectItem value="visitCount">Visit Count</SelectItem>
                              <SelectItem value="lastActive">Last Active</SelectItem>
                              <SelectItem value="orderCount">Order Count</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="col-span-3">
                          <Select
                            value={rule.operator}
                            onValueChange={(value) => updateRule(index, 'operator', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value=">">Greater than</SelectItem>
                              <SelectItem value=">=">Greater than or equal</SelectItem>
                              <SelectItem value="<">Less than</SelectItem>
                              <SelectItem value="<=">Less than or equal</SelectItem>
                              <SelectItem value="==">Equal to</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="col-span-4">
                          <Input
                            value={rule.value.toString()}
                            onChange={(e) => updateRule(index, 'value', e.target.value)}
                            placeholder="Value"
                            type={rule.field === 'lastActive' ? 'datetime-local' : 'text'}
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
                  <label htmlFor="aiSegmentName" className="input-label">Segment Name</label>
                  <Input
                    id="aiSegmentName"
                    placeholder="High Value Customers"
                    {...aiForm.register('segmentName', { required: 'Segment name is required' })}
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
                    {...aiForm.register('prompt', { required: 'Prompt is required' })}
                  />
                  {aiForm.formState.errors.prompt && (
                    <span className="text-red-500 text-sm">
                      {aiForm.formState.errors.prompt.message}
                    </span>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    AI will convert your description into targeting rules automatically.
                  </p>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t p-6">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
          
          {activeTab === 'manual' ? (
            <Button onClick={handleManualSubmit} className="gap-1">
              Preview Audience <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleAISubmit} className="gap-1">
              Generate Segment <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default SegmentBuilderPage;
