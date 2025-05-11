
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Trash2, Check, RefreshCcw } from 'lucide-react';
import { getSegmentPreview, parseNaturalLanguage, SegmentRule, Rule } from '@/lib/api';
import { parseNaturalLanguageQuery } from '@/lib/gemini';

// Field options for rule builder
const fieldOptions = [
  { value: 'lastActiveDaysAgo', label: 'Days Since Last Active' },
  { value: 'totalSpent', label: 'Total Amount Spent' },
  { value: 'lastPurchaseDaysAgo', label: 'Days Since Last Purchase' },
  { value: 'purchaseCount', label: 'Number of Purchases' },
];

const operatorOptions = [
  { value: '>', label: 'Greater Than' },
  { value: '<', label: 'Less Than' },
  { value: '=', label: 'Equal To' },
  { value: '>=', label: 'Greater Than or Equal To' },
  { value: '<=', label: 'Less Than or Equal To' },
];

const SegmentBuilder = () => {
  const [segmentName, setSegmentName] = useState('');
  const [activeTab, setActiveTab] = useState('builder');
  const [segmentRules, setSegmentRules] = useState<SegmentRule>({
    combinator: 'and',
    rules: [{ field: 'lastActiveDaysAgo', operator: '>', value: 30 }],
  });
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  const [audienceSize, setAudienceSize] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [nlParsingError, setNlParsingError] = useState('');

  const handleAddRule = () => {
    setSegmentRules(prev => ({
      ...prev,
      rules: [
        ...prev.rules,
        { field: 'lastActiveDaysAgo', operator: '>', value: 30 }
      ],
    }));
  };

  const handleRemoveRule = (index: number) => {
    setSegmentRules(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  const handleRuleChange = (index: number, field: keyof Rule, value: string | number) => {
    setSegmentRules(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => {
        if (i === index) {
          return { ...rule, [field]: value };
        }
        return rule;
      }),
    }));
  };

  const handleCombinatorChange = (value: 'and' | 'or') => {
    setSegmentRules(prev => ({
      ...prev,
      combinator: value,
    }));
  };

  const handlePreviewAudience = async () => {
    setIsPreviewLoading(true);
    try {
      const size = await getSegmentPreview(segmentRules);
      setAudienceSize(size);
    } catch (error) {
      console.error('Error fetching preview:', error);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleNaturalLanguageSubmit = async () => {
    if (!naturalLanguageQuery) return;
    
    setIsLoading(true);
    setNlParsingError('');
    
    try {
      // Use Gemini to parse the natural language query
      const parsedRules = await parseNaturalLanguageQuery(naturalLanguageQuery);
      setSegmentRules(parsedRules);
      setActiveTab('builder');
      
      // Preview the audience size
      const size = await getSegmentPreview(parsedRules);
      setAudienceSize(size);
    } catch (error) {
      console.error('Error parsing natural language query:', error);
      setNlParsingError('Failed to parse your query. Please try different wording.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Segment</h1>
        <p className="text-muted-foreground">Define the audience for your campaign.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Segment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Segment Name</Label>
            <Input 
              id="name" 
              placeholder="e.g., High-value inactive customers" 
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="builder">Rule Builder</TabsTrigger>
              <TabsTrigger value="natural">Natural Language</TabsTrigger>
            </TabsList>
            
            <TabsContent value="builder" className="space-y-4 pt-4">
              <div className="mb-4 flex items-center gap-2">
                <Label>Combine rules with:</Label>
                <div className="flex rounded-md overflow-hidden border">
                  <Button
                    type="button"
                    variant={segmentRules.combinator === 'and' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCombinatorChange('and')}
                    className="rounded-none"
                  >
                    AND
                  </Button>
                  <Button
                    type="button"
                    variant={segmentRules.combinator === 'or' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCombinatorChange('or')}
                    className="rounded-none"
                  >
                    OR
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground ml-2">
                  {segmentRules.combinator === 'and' 
                    ? 'Customers must match all conditions' 
                    : 'Customers must match any condition'}
                </span>
              </div>
              
              <div className="space-y-3 segment-builder">
                {segmentRules.rules.map((rule, index) => (
                  <div key={index} className="flex flex-wrap gap-3 items-center p-3 border rounded-md bg-gray-50">
                    <div className="min-w-[180px]">
                      <Select
                        value={rule.field}
                        onValueChange={(value) => handleRuleChange(index, 'field', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="min-w-[180px]">
                      <Select
                        value={rule.operator}
                        onValueChange={(value) => handleRuleChange(index, 'operator', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent>
                          {operatorOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Input
                      type="number"
                      value={rule.value}
                      onChange={(e) => handleRuleChange(index, 'value', e.target.value)}
                      className="w-32"
                    />
                    
                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      onClick={() => handleRemoveRule(index)}
                      disabled={segmentRules.rules.length <= 1}
                      className="ml-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddRule}
                className="mt-2"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Rule
              </Button>
            </TabsContent>
            
            <TabsContent value="natural" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="nl-query">Describe your audience in plain language</Label>
                <Textarea
                  id="nl-query"
                  placeholder="e.g., Customers who haven't purchased in the last 6 months and have spent over ₹5000"
                  value={naturalLanguageQuery}
                  onChange={(e) => setNaturalLanguageQuery(e.target.value)}
                  className="min-h-[100px]"
                />
                {nlParsingError && (
                  <p className="text-sm text-destructive mt-1">{nlParsingError}</p>
                )}
                <Button
                  type="button"
                  onClick={handleNaturalLanguageSubmit}
                  className="mt-2"
                  disabled={isLoading || !naturalLanguageQuery}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Parse Query
                </Button>
              </div>
              <div className="bg-muted p-4 rounded-md">
                <h4 className="text-sm font-medium mb-2">Examples you can try:</h4>
                <ul className="text-sm space-y-2">
                  <li>"Customers inactive for 3 months who spent more than ₹10,000"</li>
                  <li>"People who made at least 5 purchases and were active in the last 30 days"</li>
                  <li>"High-value customers who haven't purchased in the last 60 days"</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gray-50 border-t">
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviewAudience}
              size="sm"
              disabled={isPreviewLoading || segmentRules.rules.length === 0}
            >
              {isPreviewLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="mr-2 h-4 w-4" />
              )}
              Preview Audience
            </Button>
            {audienceSize !== null && (
              <Badge variant="secondary" className="ml-2">
                {audienceSize.toLocaleString()} customers match
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
            >
              Save Segment
            </Button>
            <Button
              type="button"
            >
              Create Campaign
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SegmentBuilder;
