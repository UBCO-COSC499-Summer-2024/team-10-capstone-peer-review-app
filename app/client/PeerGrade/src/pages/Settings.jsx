import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '@/lib/redux/hooks/userSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const Settings = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  const [selectedTab, setSelectedTab] = useState('profile');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [urls, setUrls] = useState(currentUser?.urls || ['', '']);

  const handleSaveProfile = () => {
    dispatch(updateUser({ username, email, bio, urls }));
    // Add any additional logic, like API calls, if needed
  };

  return (
    <div className="w-screen mx-5 p-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="max-w-5xl mx-auto">
        <TabsList className="flex justify-between mb-6">
          <TabsTrigger value="profile"><Button variant="outline">Profile</Button></TabsTrigger>
          <TabsTrigger value="account"><Button variant="outline">Account</Button></TabsTrigger>
          <TabsTrigger value="notifications"><Button variant="outline">Notifications</Button></TabsTrigger>
          <TabsTrigger value="privacy"><Button variant="outline">Privacy</Button></TabsTrigger>
          <TabsTrigger value="integrations"><Button variant="outline">Integrations</Button></TabsTrigger>
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
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <Input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                  />
                  <p className="text-xs text-gray-500 mt-1">This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                  <p className="text-xs text-gray-500 mt-1">You can manage verified email addresses in your email settings.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <Textarea 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    placeholder="I own a computer." 
                  />
                  <p className="text-xs text-gray-500 mt-1">You can @mention other users and organizations to link to them.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">URLs</label>
                  {urls.map((url, index) => (
                    <Input
                      key={index}
                      type="url"
                      value={url}
                      onChange={(e) => {
                        const newUrls = [...urls];
                        newUrls[index] = e.target.value;
                        setUrls(newUrls);
                      }}
                      placeholder={`https://example${index === 0 ? '' : index}.com`}
                      className="mb-2"
                    />
                  ))}
                  <p className="text-xs text-gray-500 mt-1">Add links to your website, blog, or social media profiles.</p>
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
							<CardTitle>Integrations</CardTitle>
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
