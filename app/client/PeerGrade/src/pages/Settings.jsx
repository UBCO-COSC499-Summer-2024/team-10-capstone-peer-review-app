import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

const Settings = () => {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState('profile');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('/api/auth/current-user', { withCredentials: true });
        setCurrentUser(response.data.user);
        setUsername(response.data.user.username || '');
        setEmail(response.data.user.email || '');
        setBio(response.data.user.bio || '');
        setUrl(response.data.user.url || '');
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch current user", variant: "destructive" });
      }
    };

    fetchCurrentUser();
  }, [toast]);

  const handleSaveProfile = async () => {
    try {
      const response = await axios.post('/api/users/update-profile', {
        username, email, bio, url
      }, { withCredentials: true });

      setCurrentUser(response.data.user);
      toast({
        title: "Profile Updated",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify({ username, email, bio, url }, null, 2)}</code>
          </pre>
        ),
        variant: "positive"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating the profile.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-screen mx-5 p-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="max-w-5xl mx-auto">
        <TabsList className="flex justify-between mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="flex flex-col lg:flex-row gap-4 bg-gray-100 p-4 mb-6 rounded-lg">
            <div className="flex flex-col items-center lg:items-start lg:w-1/3">
              <Avatar className="w-32 h-32 bg-gray-200 rounded-full border border-black" />
              <h2 className="text-lg font-semibold mt-4">{currentUser?.firstname} {currentUser?.lastname}</h2>
              <p className="text-gray-500">{currentUser?.description}</p>
            </div>
            <div className="lg:w-2/3">
              <h2 className="text-xl font-semibold mb-4">Profile</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                  <Input 
                    id="username"
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                  />
                  <p className="text-xs text-gray-500 mt-1">This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days.</p>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <Input 
                    id="email"
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                  <p className="text-xs text-gray-500 mt-1">You can manage verified email addresses in your email settings.</p>
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                  <Textarea 
                    id="bio"
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    placeholder="I own a computer." 
                  />
                  <p className="text-xs text-gray-500 mt-1">You can @mention other users and organizations to link to them.</p>
                </div>
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700">URL</label>
                  <Input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="mb-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">Add link to your website, blog, or social media profile.</p>
                </div>
                <Button onClick={handleSaveProfile} className="bg-[#111827] text-white">
                  Save
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Account settings content goes here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Notification settings content goes here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Privacy settings content goes here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Integrations Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Integrations content goes here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  );
};

export default Settings;
