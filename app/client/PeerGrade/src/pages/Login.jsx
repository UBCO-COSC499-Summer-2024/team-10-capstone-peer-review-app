import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginCard from "@/components/login/LoginCard";
import ForgotPasswordCard from "@/components/login/ForgotPasswordCard";
import RegisterCard from "@/components/login/RegisterCard";
import NewRoleRequestCard from "@/components/login/NewRoleRequestCard";

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

const Login = () => {
	const [currentTab, setCurrentTab] = useState("login");
	const query = useQuery();
	const forgotPasswordToken = query.get("forgotPasswordToken") || "";

	// If forgot token in found in the url, set the current tab to forgotPassword
	useEffect(() => {
		if (forgotPasswordToken) {
			setCurrentTab("forgotPassword");
		}
	}, [forgotPasswordToken]);

	return (
		<main className="flex items-center justify-center min-h-screen mr-[160px]">
			<Tabs
				value={currentTab}
				onValueChange={setCurrentTab}
				className="w-[400px]"
			>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="login">Login</TabsTrigger>
					<TabsTrigger value="register">Register</TabsTrigger>
				</TabsList>
				<TabsContent value="login">
					<LoginCard
						onSwitchToRegister={() => setCurrentTab("register")}
						onSwitchToForgotPassword={() => setCurrentTab("forgotPassword")}
						onSwitchToNewRoleRequest={() => setCurrentTab("newRoleRequest")}
					/>
				</TabsContent>
				<TabsContent value="register">
					<RegisterCard onSwitchToLogin={() => setCurrentTab("login")} />
				</TabsContent>
				<TabsContent value="forgotPassword">
					<ForgotPasswordCard onSwitchToLogin={() => setCurrentTab("login")} />
				</TabsContent>
				<TabsContent value="newRoleRequest">
					<NewRoleRequestCard onSwitchToLogin={() => setCurrentTab("login")} />
				</TabsContent>
			</Tabs>
		</main>
	);
};

export default Login;
