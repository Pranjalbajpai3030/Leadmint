
import { Campaign, Customer, SegmentRule } from './api';
import { customers, campaigns } from './mockData';
import { parseNaturalLanguageQuery, generateCampaignMessages, generateCampaignPerformanceSummary } from './gemini';

// Mock API functions that return promises to simulate async behavior
export const getCustomers = (): Promise<Customer[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(customers);
    }, 500);
  });
};

export const getCampaigns = (): Promise<Campaign[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(campaigns);
    }, 500);
  });
};

export const createCampaign = (campaign: Omit<Campaign, 'id' | 'createdAt' | 'stats'>): Promise<Campaign> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCampaign: Campaign = {
        ...campaign,
        id: `camp-${Math.floor(Math.random() * 9000) + 1000}`,
        createdAt: new Date().toISOString(),
        stats: {
          sent: campaign.audienceSize,
          delivered: Math.floor(campaign.audienceSize * 0.9),
          failed: Math.floor(campaign.audienceSize * 0.1),
        },
      };
      
      campaigns.unshift(newCampaign);
      resolve(newCampaign);
    }, 1000);
  });
};

export const getSegmentPreview = (segmentRules: SegmentRule): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple mock implementation to return between 100 and 2000 customers
      resolve(Math.floor(Math.random() * 1900) + 100);
    }, 800);
  });
};

export const parseNaturalLanguage = async (query: string): Promise<SegmentRule> => {
  try {
    return await parseNaturalLanguageQuery(query);
  } catch (error) {
    console.error('Error parsing natural language:', error);
    throw error;
  }
};

export const generateMessages = async (goal: string): Promise<string[]> => {
  try {
    return await generateCampaignMessages(goal);
  } catch (error) {
    console.error('Error generating messages:', error);
    throw error;
  }
};

export const getCampaignPerformance = async (campaignId: string): Promise<string> => {
  try {
    // Find the campaign
    const campaign = campaigns.find(c => c.id === campaignId);
    
    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }
    
    // Generate mock segment data
    const stats = {
      totalAudience: campaign.audienceSize,
      delivered: campaign.stats.delivered,
      failed: campaign.stats.failed,
      segments: {
        "High spenders": { 
          count: Math.floor(campaign.audienceSize * 0.3), 
          delivered: Math.floor(campaign.stats.delivered * 0.32) 
        },
        "Frequent shoppers": { 
          count: Math.floor(campaign.audienceSize * 0.4), 
          delivered: Math.floor(campaign.stats.delivered * 0.38) 
        },
        "New customers": { 
          count: Math.floor(campaign.audienceSize * 0.3), 
          delivered: Math.floor(campaign.stats.delivered * 0.3) 
        },
      }
    };
    
    return await generateCampaignPerformanceSummary(stats);
  } catch (error) {
    console.error('Error getting campaign performance:', error);
    throw error;
  }
};
