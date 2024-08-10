// This is the login page for the PeerGrade application. It allows the user to log in, register, or reset their password.
// The login page is divided into different tabs for different sections of the login process (Login, Register, Forgot Password, New Role Request, etc.)
// The tabs are a separate component that is rendered in the login page.

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginCard from "@/components/login/LoginCard";
import ForgotPasswordCard from "@/components/login/ForgotPasswordCard";
import RegisterCard from "@/components/login/RegisterCard";
import NewRoleRequestCard from "@/components/login/NewRoleRequestCard";
import ResendVerifEmailCard from "@/components/login/ResendVerifEmailCard";

import { useUser } from "@/contexts/contextHooks/useUser";

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

const Login = () => {
	const [currentTab, setCurrentTab] = useState("login");

	const navigate = useNavigate();
	const query = useQuery();
	const { user, userLoading } = useUser();

	const forgotPasswordToken = query.get("forgotPasswordToken") || "";

	// If the user has been authenticated, state has been set, and the user tries to access the login page, redirect them to the dashboard
	useEffect(() => {
		if (user) {
			navigate(user.role === "ADMIN" ? "/admin" : "/dashboard");
		}
	}, [user]);

	// If forgot token in found in the url, set the current tab to forgotPassword
	useEffect(() => {
		if (forgotPasswordToken) {
			setCurrentTab("forgotPassword");
		}
	}, [forgotPasswordToken]);

	return (
		<div className="flex items-center justify-center h-full mr-[160px]">
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
						onSwitchToNewVerificationEmail={() => setCurrentTab("newVerificationEmail")}
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
				<TabsContent value="newVerificationEmail">
					<ResendVerifEmailCard onSwitchToLogin={() => setCurrentTab("login")} />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Login;
