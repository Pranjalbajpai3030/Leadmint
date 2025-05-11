
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { Moon, Sun, Mail, Bell, UserCheck, Languages } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [theme, setTheme] = useState("light");
  const [aiTone, setAiTone] = useState("professional");
  const [smartScheduling, setSmartScheduling] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dashboardNotifications, setDashboardNotifications] = useState(true);
  const [autoApproval, setAutoApproval] = useState(false);
  const [language, setLanguage] = useState("en");
  
  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!');
  };
  
  const handleLogoutAllSessions = () => {
    toast.loading('Logging out all sessions...', { duration: 1500 });
    
    setTimeout(() => {
      toast.success('All sessions have been terminated');
    }, 1500);
  };
  
  return (
    <div className="page-container max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">Configure your application preferences and account settings.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how Xeno CRM looks for you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="theme" className="text-base">Theme</Label>
                <p className="text-sm text-gray-500">Choose between light and dark mode</p>
              </div>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light" className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                  </SelectItem>
                  <SelectItem value="dark" className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                  </SelectItem>
                  <SelectItem value="system">System Default</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="language" className="text-base">Language</Label>
                <p className="text-sm text-gray-500">Choose your preferred language</p>
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en" className="flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    <span>English</span>
                  </SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>AI Preferences</CardTitle>
            <CardDescription>Configure the AI assistant behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ai-tone" className="text-base">AI Tone</Label>
                <p className="text-sm text-gray-500">Set the tone for AI-generated content</p>
              </div>
              <Select value={aiTone} onValueChange={setAiTone}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select AI tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smart-scheduling" className="text-base">Smart Scheduling</Label>
                <p className="text-sm text-gray-500">Automatically schedule campaigns for optimal engagement</p>
              </div>
              <Switch 
                id="smart-scheduling" 
                checked={smartScheduling}
                onCheckedChange={setSmartScheduling}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-approval" className="text-base">Auto Approval</Label>
                <p className="text-sm text-gray-500">Automatically approve AI-generated content</p>
              </div>
              <Switch 
                id="auto-approval" 
                checked={autoApproval}
                onCheckedChange={setAutoApproval}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage how and when you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive campaign reports and alerts via email</p>
                </div>
              </div>
              <Switch 
                id="email-notifications" 
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <Label htmlFor="dashboard-notifications" className="text-base">Dashboard Notifications</Label>
                  <p className="text-sm text-gray-500">Show notifications in the dashboard</p>
                </div>
              </div>
              <Switch 
                id="dashboard-notifications" 
                checked={dashboardNotifications}
                onCheckedChange={setDashboardNotifications}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your account security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <UserCheck className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-base font-medium">Account Sessions</p>
                  <p className="text-sm text-gray-500">Logout from all devices except this one</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogoutAllSessions}>
                Logout All Sessions
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end mt-4">
          <Button variant="outline" className="mr-2">Cancel</Button>
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
