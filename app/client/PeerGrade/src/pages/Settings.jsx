// This is page for editng user details. For now only name change is the functionality of this page however the intention is to add more functionality in the future. 
// example future functionality could be adding a profile picture, adding a bio, light/dark mode, notificiation preferences, email/password chagne, etc.
import React, { useState, useEffect } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/contexts/contextHooks/useUser";
import { useToast } from "@/components/ui/use-toast";
import { updateProfile } from "@/api/userApi";

const Settings = () => {
	const { toast } = useToast();
	const { user, userLoading, setUserContext } = useUser();
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");

	// Fetch the user data when the user changes
	useEffect(() => {
		if (!userLoading && user) {
			setFirstname(user.firstname || "");
			setLastname(user.lastname || "");
			setEmail(user.email || "");
		}
	}, [user, userLoading]);

	// Handle saving the user profile
	const handleSaveProfile = (e) => {
		e.preventDefault();

		const updatedData = {
			firstname,
			lastname,
			email
		};

		// NEED TO IMPLEMENT A CHECK FOR VERIFYING IF ITS A VALID EMAIL & IF IT BELONGS TO THE USER
		const updateUserProfile = async () => {
			const updatedProfile = await updateProfile(user.userId, updatedData);
			if (updatedProfile.status === "Success") {
				toast({
					title: "Profile Updated",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
							<code className="text-white">
								{JSON.stringify({ firstname, lastname, email }, null, 2)}
							</code>
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

	return (
		<div className="px-6">
			<h1 className="text-3xl font-bold mb-3 ml-3">Settings</h1>
			<div className="flex-grow mt-3">
				<Card>
					<CardHeader>
						<CardTitle>Profile</CardTitle>
						<CardDescription>Manage your personal information</CardDescription>
					</CardHeader>
					<form onSubmit={handleSaveProfile}>
						<CardContent className="space-y-6">
							<div className="flex items-center space-x-4">
								<Avatar className="w-20 h-20">
									<AvatarImage
										src="/placeholder-avatar.jpg"
										alt="User avatar"
									/>
									<AvatarFallback className="text-4xl">
										{firstname.charAt(0)}
										{lastname.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div>
									<h3 className="text-lg font-medium">
										{firstname} {lastname}
									</h3>
									<p className="text-sm text-muted-foreground">{email}</p>
								</div>
							</div>
							<Separator />
							<div className="space-y-4">
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
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button type="submit">Save changes</Button>
						</CardFooter>
					</form>
				</Card>
			</div>
		</div>
	);
};

export default Settings;
