
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar, Send, Shield, Mail as MailIcon } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  picture: string;
  lastLogin: string;
  totalCampaigns: number;
  role: string;
  notificationPreferences: {
    campaignComplete: boolean;
    newCustomerSignups: boolean;
    weeklyReports: boolean;
  };
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Mock API call to fetch user profile
    const fetchProfile = () => {
      // In a real app, this would be an API call
      const mockProfile: UserProfile = {
        id: 'user-123',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        picture: 'https://i.pravatar.cc/300',
        lastLogin: '2025-05-11T08:30:00Z',
        totalCampaigns: 35,
        role: 'Administrator',
        notificationPreferences: {
          campaignComplete: true,
          newCustomerSignups: true,
          weeklyReports: false
        }
      };
      
      setProfile(mockProfile);
      setLoading(false);
    };
    
    fetchProfile();
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading) {
    return (
      <div className="page-container flex items-center justify-center h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-24 w-24 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-8 w-48 bg-gray-200 rounded-md mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your account information and preferences.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6 flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={profile?.picture} />
              <AvatarFallback className="text-xl bg-xeno-primary text-primary-foreground">
                {profile?.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <h2 className="text-xl font-semibold mb-1">{profile?.name}</h2>
            <div className="text-gray-600 mb-3">{profile?.email}</div>
            
            <Badge variant="outline" className="bg-xeno-secondary text-xeno-primary mb-6">
              {profile?.role}
            </Badge>
            
            <Button variant="outline" className="w-full mb-2">
              Edit Profile
            </Button>
            <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
              Logout
            </Button>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center border-b pb-4">
                <User className="h-5 w-5 mr-3 text-xeno-primary" />
                <div>
                  <div className="text-sm text-gray-500">Full Name</div>
                  <div className="font-medium">{profile?.name}</div>
                </div>
              </div>
              
              <div className="flex items-center border-b pb-4">
                <MailIcon className="h-5 w-5 mr-3 text-xeno-primary" />
                <div>
                  <div className="text-sm text-gray-500">Email Address</div>
                  <div className="font-medium">{profile?.email}</div>
                </div>
              </div>
              
              <div className="flex items-center border-b pb-4">
                <Calendar className="h-5 w-5 mr-3 text-xeno-primary" />
                <div>
                  <div className="text-sm text-gray-500">Last Login</div>
                  <div className="font-medium">{formatDate(profile?.lastLogin || '')}</div>
                </div>
              </div>
              
              <div className="flex items-center border-b pb-4">
                <Send className="h-5 w-5 mr-3 text-xeno-primary" />
                <div>
                  <div className="text-sm text-gray-500">Total Campaigns</div>
                  <div className="font-medium">{profile?.totalCampaigns}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-3 text-xeno-primary" />
                <div>
                  <div className="text-sm text-gray-500">Role</div>
                  <div className="font-medium">{profile?.role}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        
      </div>
    </div>
  );
};

export default ProfilePage;
