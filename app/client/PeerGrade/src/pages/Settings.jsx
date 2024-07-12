import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useUser } from "@/contexts/contextHooks/useUser";
import { useToast } from '@/components/ui/use-toast';
import { updateProfile } from '@/api/userApi';

const Settings = () => {
  const { toast } = useToast();
	const { user, userLoading, setUserContext } = useUser();
  const [selectedTab, setSelectedTab] = useState('profile');
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

	const getInitials = (firstName, lastName) => {
		const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
		const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
		return `${firstInitial}${lastInitial}`;
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
              <Avatar className="w-32 h-32 bg-gray-200 rounded-full border border-black">
								{/* For future development, we can add an avatarUrl to the user object to render a profile picture*/}
								<AvatarImage
									src={user.avatarUrl}
									alt={`${user.firstname} ${user.lastname}`}
								/>
								<AvatarFallback className='text-7xl'>
									{getInitials(user.firstname, user.lastname)}
								</AvatarFallback>
							</Avatar>
              <h2 className="text-lg font-semibold mt-4">{user?.firstname} {user?.lastname}</h2>
            </div>
            <div className="lg:w-2/3">
              <h2 className="text-xl font-semibold mb-4">Profile</h2>
              <form onSubmit={handleSaveProfile} className='space-y-4'>
                <div>
                  <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">First Name</label>
                  <Input 
                    id="firstname"
                    type="text" 
                    value={firstname} 
                    onChange={(e) => setFirstname(e.target.value)} 
                  />
                </div>
                <div>
                  <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <Input 
                    id="lastname"
                    type="text" 
                    value={lastname} 
                    onChange={(e) => setLastname(e.target.value)} 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                  <p className='text-sm text-gray-500'>Note: This ideally would require e-mail verification for the user to be able to change their e-mail address.</p>
                </div>
                <Button type="submit" className="bg-[#111827] text-white">
                  Save
                </Button>
              </form>
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
    </div>
  );
};

export default Settings;
