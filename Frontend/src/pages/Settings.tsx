
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences.</p>
      </div>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API Access</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={user?.displayName || ''} disabled />
                <p className="text-xs text-muted-foreground">
                  Name is managed through your Google account
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email || ''} disabled />
                <p className="text-xs text-muted-foreground">
                  Email is managed through your Google account
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" placeholder="Enter your company name" />
              </div>
              
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Manage your connected accounts and services.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.1711 8.36788H17.4998V8.33329H9.99984V11.6666H14.7094C14.0223 13.607 12.1761 14.9999 9.99984 14.9999C7.23859 14.9999 4.99984 12.7612 4.99984 9.99996C4.99984 7.23871 7.23859 4.99996 9.99984 4.99996C11.2744 4.99996 12.4344 5.48079 13.317 6.26621L15.6736 3.90954C14.1886 2.52204 12.1969 1.66663 9.99984 1.66663C5.39775 1.66663 1.6665 5.39788 1.6665 9.99996C1.6665 14.602 5.39775 18.3333 9.99984 18.3333C14.6019 18.3333 18.3332 14.602 18.3332 9.99996C18.3332 9.44121 18.2757 8.89579 18.1711 8.36788Z" fill="#FFC107"/>
                    <path d="M2.62744 6.12121L5.36536 8.12913C6.10619 6.29496 7.90036 4.99996 9.99994 4.99996C11.2745 4.99996 12.4345 5.48079 13.3171 6.26621L15.6737 3.90954C14.1887 2.52204 12.197 1.66663 9.99994 1.66663C6.74077 1.66663 3.91869 3.47371 2.62744 6.12121Z" fill="#FF3D00"/>
                    <path d="M10.0001 18.3333C12.1514 18.3333 14.1059 17.5095 15.5851 16.17L13.008 13.9875C12.1432 14.6452 11.0865 15.0009 10.0001 15C7.83257 15 5.99174 13.6179 5.29924 11.6883L2.58174 13.7829C3.86091 16.4817 6.71341 18.3333 10.0001 18.3333Z" fill="#4CAF50"/>
                    <path d="M18.1713 8.36788H17.5V8.33329H10V11.6666H14.7096C14.3809 12.5946 13.7889 13.3888 13.0067 13.9879L13.0079 13.9871L15.585 16.1696C15.4083 16.3317 18.3333 14.1667 18.3333 10C18.3333 9.44121 18.2758 8.89579 18.1713 8.36788Z" fill="#1976D2"/>
                  </svg>
                  <div>
                    <p className="text-sm font-medium">Google</p>
                    <p className="text-xs text-muted-foreground">Authentication and SSO</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                  Connected
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you want to receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Campaign Reports</p>
                    <p className="text-sm text-muted-foreground">Receive daily and weekly campaign performance reports</p>
                  </div>
                  <Switch id="campaign-reports" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Delivery Failures</p>
                    <p className="text-sm text-muted-foreground">Get notified when message delivery fails</p>
                  </div>
                  <Switch id="delivery-failures" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System Updates</p>
                    <p className="text-sm text-muted-foreground">Receive notifications about system updates and new features</p>
                  </div>
                  <Switch id="system-updates" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>Manage your API keys and access credentials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex gap-2">
                  <Input id="api-key" value="••••••••••••••••••••••••••••••" readOnly className="font-mono flex-1" />
                  <Button variant="outline">Copy</Button>
                  <Button variant="outline">Regenerate</Button>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Your API key grants full access to your account. Do not share it with others.</p>
                <p className="mt-2">Last used: 2 days ago</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

import { Badge } from "@/components/ui/badge";

export default Settings;
