
import axios from 'axios';
import { auth } from './firebase';
import * as mockApi from './mockApi';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Replace with your actual API URL in production
});

// Add auth token to requests if user is logged in
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastActiveDaysAgo: number;
  totalSpent: number;
  lastPurchaseDaysAgo: number;
  purchaseCount: number;
}

export interface Campaign {
  id: string;
  name: string;
  createdAt: string;
  segmentRules: SegmentRule;
  message: string;
  audienceSize: number;
  stats: {
    sent: number;
    delivered: number;
    failed: number;
  };
}

export interface SegmentRule {
  combinator: 'and' | 'or';
  rules: Rule[];
}

export interface Rule {
  field: string;
  operator: string;
  value: string | number;
}

// Mock data flag - set to false when a real API is available
const USE_MOCK_DATA = true;

// API functions
export const getCustomers = async (): Promise<Customer[]> => {
  if (USE_MOCK_DATA) {
    return mockApi.getCustomers();
  }

  try {
    const response = await api.get('/customers');
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
};

export const getCampaigns = async (): Promise<Campaign[]> => {
  if (USE_MOCK_DATA) {
    return mockApi.getCampaigns();
  }

  try {
    const response = await api.get('/campaigns');
    return response.data;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }
};

export const createCampaign = async (campaign: Omit<Campaign, 'id' | 'createdAt' | 'stats'>): Promise<Campaign> => {
  if (USE_MOCK_DATA) {
    return mockApi.createCampaign(campaign);
  }

  try {
    const response = await api.post('/campaigns', campaign);
    return response.data;
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
};

export const getSegmentPreview = async (segmentRules: SegmentRule): Promise<number> => {
  if (USE_MOCK_DATA) {
    return mockApi.getSegmentPreview(segmentRules);
  }

  try {
    const response = await api.post('/segments/preview', { segmentRules });
    return response.data.count;
  } catch (error) {
    console.error('Error fetching segment preview:', error);
    return 0;
  }
};

export const parseNaturalLanguage = async (query: string): Promise<SegmentRule> => {
  if (USE_MOCK_DATA) {
    return mockApi.parseNaturalLanguage(query);
  }

  try {
    const response = await api.post('/ai/parse-query', { query });
    return response.data;
  } catch (error) {
    console.error('Error parsing natural language:', error);
    throw error;
  }
};

export const generateCampaignMessages = async (goal: string): Promise<string[]> => {
  if (USE_MOCK_DATA) {
    return mockApi.generateMessages(goal);
  }

  try {
    const response = await api.post('/ai/generate-messages', { goal });
    return response.data.messages;
  } catch (error) {
    console.error('Error generating campaign messages:', error);
    throw error;
  }
};

export const getCampaignPerformance = async (campaignId: string): Promise<string> => {
  if (USE_MOCK_DATA) {
    return mockApi.getCampaignPerformance(campaignId);
  }

  try {
    const response = await api.get(`/ai/campaign-performance/${campaignId}`);
    return response.data.summary;
  } catch (error) {
    console.error('Error getting campaign performance:', error);
    throw error;
  }
};
