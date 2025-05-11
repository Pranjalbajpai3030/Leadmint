
import { Campaign, Customer } from './api';

// Generate random customers
export const generateCustomers = (count: number): Customer[] => {
  const customers: Customer[] = [];
  const names = ['John Smith', 'Mary Johnson', 'David Lee', 'Sarah Williams', 'Michael Brown', 'Jessica Davis', 'Robert Miller', 'Jennifer Wilson', 'Thomas Moore', 'Lisa Taylor'];
  
  for (let i = 0; i < count; i++) {
    const id = `cust-${i + 1000}`;
    const name = names[Math.floor(Math.random() * names.length)];
    const lastActiveDaysAgo = Math.floor(Math.random() * 90);
    const totalSpent = Math.floor(Math.random() * 50000) + 500;
    const lastPurchaseDaysAgo = Math.floor(Math.random() * 120);
    const purchaseCount = Math.floor(Math.random() * 20) + 1;
    
    customers.push({
      id,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      phone: `+1${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 9000) + 1000}`,
      lastActiveDaysAgo,
      totalSpent,
      lastPurchaseDaysAgo,
      purchaseCount,
    });
  }
  
  return customers;
};

// Generate random campaigns
export const generateCampaigns = (count: number): Campaign[] => {
  const campaigns: Campaign[] = [];
  const names = [
    'Summer Sale Reactivation', 
    'High Value Customer Retention', 
    'Abandoned Cart Recovery', 
    'New Product Launch', 
    'Loyalty Program Promotion',
    'Winter Holiday Special',
    'Birthday Rewards',
    'Feedback Request',
    'VIP Customer Appreciation',
    'Flash Sale Announcement'
  ];
  
  for (let i = 0; i < count; i++) {
    const id = `camp-${i + 1000}`;
    const name = names[i % names.length];
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString();
    const audienceSize = Math.floor(Math.random() * 2000) + 500;
    const deliveryRate = 0.85 + Math.random() * 0.1; // Between 85% and 95%
    const delivered = Math.floor(audienceSize * deliveryRate);
    const failed = audienceSize - delivered;
    
    campaigns.push({
      id,
      name,
      createdAt,
      segmentRules: {
        combinator: Math.random() > 0.5 ? 'and' : 'or',
        rules: [
          { field: 'lastActiveDaysAgo', operator: '>', value: 30 },
          { field: 'totalSpent', operator: '>', value: 5000 }
        ],
      },
      message: `Hi {name}, we've missed you! Come back and enjoy 15% off your next purchase with code WELCOME15.`,
      audienceSize,
      stats: {
        sent: audienceSize,
        delivered,
        failed,
      },
    });
  }
  
  // Sort campaigns by createdAt in descending order (most recent first)
  return campaigns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Generate mock data
export const customers = generateCustomers(100);
export const campaigns = generateCampaigns(10);
