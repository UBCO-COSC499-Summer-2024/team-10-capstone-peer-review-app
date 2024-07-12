import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useUser } from "@/contexts/contextHooks/useUser";
import { useToast } from '@/components/ui/use-toast';
import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { updateProfile } from '@/api/userApi';

const Settings = () => {
  const { toast } = useToast();
	const { user, userLoading, setUserContext } = useUser();
  const [selectedTab, setSelectedTab] = useState('profile');
  const [activeSection, setActiveSection] = useState('profile');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!userLoading && user) {
        setFirstname(user.firstname || '');
        setLastname(user.lastname || '');
        setEmail(user.email || '');
    }
  }, [user, userLoading]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    
    const updatedData = {
			firstname,
      lastname,
      email
		};

    // NEED TO IMPLEMENT A CHECK MAYBE FOR VERIFYING IF ITS A VALID EMAIL
    
		const updateUserProfile = async () => {
      const updatedProfile = await updateProfile(user.userId, updatedData);
      // setUser(updatedProfile.data);
      if (updatedProfile.status === "Success") {
        toast({
          title: "Profile Updated",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify({ firstname, lastname, email }, null, 2)}</code>
            </pre>
          ),
          variant: "positive"
        });
        await setUserContext();
      } else {
        console.error("Failed to update profile");
			}
		};

		updateUserProfile();
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveProfile}>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
                    <AvatarFallback className='text-4xl'>{firstname.charAt(0)}{lastname.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">{firstname} {lastname}</h3>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>
                </div>
                <Separator />
                <div className='space-y-4'>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstname">First name</Label>
                      <Input 
                        id="firstname"
                        value={firstname} 
                        onChange={(e) => setFirstname(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastname">Last name</Label>
                      <Input 
                        id="lastname"
                        value={lastname} 
                        onChange={(e) => setLastname(e.target.value)} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                    <p className='text-sm text-gray-500'>Note: This ideally would require e-mail verification for the user to be able to change their e-mail address.</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Save changes</Button>
              </CardFooter>
            </form>
          </Card>
        );
      case 'account':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
                <p className="text-sm text-muted-foreground mt-1">This is the name that will be displayed on your profile and in emails.</p>
              </div>
              <div>
                <Label htmlFor="dob">Date of birth</Label>
                <Input id="dob" type="date" />
                <p className="text-sm text-muted-foreground mt-1">Your date of birth is used to calculate your age.</p>
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Select>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">This is the language that will be used in the dashboard.</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'appearance':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="font">Font</Label>
                <Select>
                  <SelectTrigger id="font">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="manrope">Manrope</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">Set the font you want to use in the dashboard.</p>
              </div>
              <div>
                <Label>Theme</Label>
                <div className="flex space-x-4 mt-2">
                  <RadioGroup defaultValue="light" orientation="horizontal">
                    <div className='flex flex-row space-x-2'>
                      <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded border border-gray-200 flex items-center justify-center mb-2">Light</div>
                        <RadioGroupItem value="light" id="light" />
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded border border-gray-200 bg-gray-900 text-white flex items-center justify-center mb-2">Dark</div>
                        <RadioGroupItem value="dark" id="dark" />
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Select the theme for the dashboard.</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'notifications':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Notify me about...</Label>
                <RadioGroup defaultValue="all">
                  <div className="flex items-center space-x-2 mt-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">All new messages</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="direct" id="direct" />
                    <Label htmlFor="direct">Direct messages and mentions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="none" />
                    <Label htmlFor="none">Nothing</Label>
                  </div>
                </RadioGroup>
              </div>
              <Separator />
              <div>
                <Label>Email Notifications</Label>
                <div className="space-y-4 mt-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="communication">Communication emails</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about your account activity.</p>
                    </div>
                    <Switch id="communication" className='bg-gray-300' />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="marketing">Marketing emails</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about new products, features, and more.</p>
                    </div>
                    <Switch id="marketing" className='bg-gray-300' />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="social">Social emails</Label>
                      <p className="text-sm text-muted-foreground">Receive emails for friend requests, follows, and more.</p>
                    </div>
                    <Switch id="social" className='bg-gray-300' />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="security">Security emails</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about your account security.</p>
                    </div>
                    <Switch id="security" defaultChecked className='bg-gray-300' />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 'display':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Display</CardTitle>
              <CardDescription>Manage your display settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Display settings content goes here.</p>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="px-6">
      <h1 className="text-3xl font-bold mb-3 ml-3">Settings</h1>      
      <div className="flex">
        <Menubar className="w-48 flex-shrink-0 space-y-1" orientation="vertical">
          {['profile', 'account', 'appearance', 'notifications', 'display'].map((section) => (
            <MenubarMenu key={section}>
              <MenubarTrigger 
                className={`w-full text-left px-4 py-2 rounded-full ${activeSection === section ? 'bg-muted text-accent-foreground mx-1' : ''}`} 
                onClick={() => setActiveSection(section)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </MenubarTrigger>
            </MenubarMenu>
          ))}
        </Menubar>
      </div>
      <div className="flex-grow mt-3">
          {renderContent()}
        </div>
    </div>
  );
};

export default Settings;