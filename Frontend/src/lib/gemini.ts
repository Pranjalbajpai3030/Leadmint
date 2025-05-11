
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI('AIzaSyDcLJqcVojK3S8eTcmgzwfrSdQXFJWclGY');

// Get the model
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// Types
interface SegmentRule {
  combinator: 'and' | 'or';
  rules: Rule[];
}

interface Rule {
  field: string;
  operator: string;
  value: string | number;
}

export const parseNaturalLanguageQuery = async (query: string): Promise<SegmentRule> => {
  try {
    const prompt = `
      Convert the following natural language query into CRM segment rules:
      "${query}"
      
      Available fields and their valid operators:
      - lastActiveDaysAgo (>, <, >=, <=, =)
      - totalSpent (>, <, >=, <=, =)
      - lastPurchaseDaysAgo (>, <, >=, <=, =)
      - purchaseCount (>, <, >=, <=, =)
      
      Respond with a JSON object in this format:
      {
        "combinator": "and", // or "or"
        "rules": [
          {
            "field": "fieldName",
            "operator": "operatorSymbol",
            "value": valueAsNumberOrString
          }
        ]
      }
      
      Only return valid JSON, no explanations or text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error("Failed to parse JSON from Gemini response");
  } catch (error) {
    console.error("Error parsing natural language query:", error);
    // Return a default empty rule set
    return {
      combinator: "and",
      rules: []
    };
  }
};

export const generateCampaignMessages = async (goal: string): Promise<string[]> => {
  try {
    const prompt = `
      Generate 3 short, engaging SMS or push notification messages for a marketing campaign with the following goal:
      "${goal}"
      
      Each message should:
      1. Be under 160 characters
      2. Include a clear call to action
      3. Be personalized (use {name} as a placeholder)
      4. Be engaging and concise
      
      Return only the 3 messages as an array in JSON format:
      ["message 1", "message 2", "message 3"]
      
      Do not include any explanations or additional text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error("Failed to parse JSON from Gemini response");
  } catch (error) {
    console.error("Error generating campaign messages:", error);
    return ["Hi {name}, check out our latest offers!", "Hey {name}, we miss you. Come back and shop with us!"];
  }
};

export const generateCampaignPerformanceSummary = async (stats: {
  totalAudience: number;
  delivered: number;
  failed: number;
  segments: Record<string, { count: number; delivered: number }>
}): Promise<string> => {
  try {
    const prompt = `
      Provide a brief, insightful analysis of this campaign performance data:
      
      Total audience size: ${stats.totalAudience}
      Messages delivered: ${stats.delivered}
      Failed deliveries: ${stats.failed}
      
      Segment breakdown:
      ${Object.entries(stats.segments)
        .map(([name, data]) => `- ${name}: ${data.count} recipients, ${data.delivered} delivered`)
        .join("\n")}
      
      Give a 2-3 sentence analysis focusing on:
      1. Overall delivery rate
      2. Any notable segment performance differences
      3. One actionable recommendation for future campaigns
      
      Keep it concise and data-focused.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating campaign performance summary:", error);
    return `Campaign reached ${stats.totalAudience} users with ${stats.delivered} successful deliveries (${Math.round(stats.delivered/stats.totalAudience*100)}% success rate).`;
  }
};
