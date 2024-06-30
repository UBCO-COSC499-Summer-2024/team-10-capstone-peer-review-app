import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

const ForgotPasswordCard = ({ onSwitchToLogin }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [emailSent, setEmailSent] = useState(false);
	const [verificationCode, setVerificationCode] = useState("");
	const [error, setError] = useState("");
	const query = useQuery();
	const frgtToken = query.get("frgtToken") || "";
	const [tokenReceived, setTokenReceived] = useState(false);
	const [tokenValid, setTokenValid] = useState(false);
	const [resetSuccessful, setResetSuccessful] = useState(false);
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
	const { toast } = useToast();

	// TODO => Refactor to use apiCalls file instead so we dont have a ton of server calls in the component files
	useEffect(() => {
		if (frgtToken && !password) {
			fetch(`http://localhost:3000/api/auth/confirm-email?token=${frgtToken}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				}
			})
				.then((response) => response.json())
				.then((data) => {
					console.log(data);
					if (data.error && data.error.status === "Server Fail") {
						setTokenValid(false);
					} else {
						console.log(
							`Received token ${frgtToken} was successfully processed.`
						);
						setTokenValid(true);
					}
				})
				.catch((error) => {
					console.error("Verification error:", error);
					setTokenValid(false);
				});
			setTokenReceived(true);
		}
	}, [frgtToken]);

	const handleSubmit = (e) => {
		e.preventDefault();

		if (tokenReceived && tokenValid) {
			if (frgtToken && password) {
				const passwordRegex =
					/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

				if (!passwordRegex.test(password)) {
					setError(
						"Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character."
					);
					return;
				}

				if (password !== confirmPassword) {
					setError("Passwords do not match");
					return;
				} else {
					setError("");
				}

				fetch(
					`http://localhost:3000/api/auth/reset-password?token=${frgtToken}`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							password: password
						})
					}
				)
					.then((response) => response.json())
					.then((data) => {
						console.log(data);
						if (data.error && data.error.status === "Error") {
							setError(data.message);
						} else {
							console.log(
								`Received token ${frgtToken} was successfully processed.`
							);
							toast({
								title: "Success",
								description:
									"Your password was successfully reset! You may now login.",
								variant: "positive"
							});
							navigate("/");
							onSwitchToLogin();
						}
					})
					.catch((error) => {
						console.error("Verification error:", error);
					});
			}
		} else {
			fetch(`http://localhost:3000/api/auth/forgot-password`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					email: email
				})
			})
				.then((response) => response.json())
				.then((data) => {
					console.log(data);
					if (data.error && data.error.status === "Error") {
						setError(data.message);
					} else {
						console.log(
							`Received token ${frgtToken} was successfully processed. Email sent to user.`
						);
						setEmailSent(true);
						setError("");
					}
				})
				.catch((error) => {
					console.error("Email verification error:", error);
					setError("This e-mail does not belong to a registered user.");
				});
		}
	};

	return (
		<div className="relative space-y-2 w-full">
			{tokenReceived && (
				<Alert
					className="absolute top-0 left-0 w-full flex justify-center items-center space-x-2"
					variant={tokenValid ? "success" : "destructive"}
				>
					<div>
						{tokenValid ? (
							<CheckCircleIcon className="h-6 w-6" />
						) : (
							<XCircleIcon className="h-6 w-6" />
						)}
					</div>
					<div>
						<AlertDescription>
							{tokenValid
								? "The token verification was successful! You can now enter your new password."
								: "The reset password link either expired or was invalid. Please try again later."}
						</AlertDescription>
					</div>
				</Alert>
			)}
			<Card className="w-full max-w-lg p-8 space-y-8 bg-white shadow-md rounded-lg">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
					<CardDescription className="text-gray-600">
						{tokenValid
							? "Please enter your new password"
							: "Please enter your e-mail to reset your password"}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{emailSent ? (
						<p className="text-green-500 text-sm">
							An email has been sent to your email address! Please check it for
							a verification link and reset your password there.
						</p>
					) : (
						<form className="space-y-4" onSubmit={handleSubmit}>
							{tokenValid ? (
								<div className="space-y-4">
									<div className="relative">
										<label
											htmlFor="password"
											className="block text-sm font-medium text-gray-700"
										>
											Password:
										</label>
										<input
											id="password"
											name="password"
											type={passwordVisible ? "text" : "password"}
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
											className={`block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border ${error ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
										/>
										<div className="absolute inset-y-0 mt-6 right-0 pr-3 flex items-center">
											<button
												type="button"
												onClick={() => setPasswordVisible(!passwordVisible)}
											>
												{passwordVisible ? (
													<EyeSlashIcon className="h-5 w-5 text-gray-500" />
												) : (
													<EyeIcon className="h-5 w-5 text-gray-500" />
												)}
											</button>
										</div>
									</div>
									<div className="relative">
										<label
											htmlFor="confirmPassword"
											className="block text-sm font-medium text-gray-700"
										>
											Confirm Password:
										</label>
										<input
											id="confirmPassword"
											name="confirmPassword"
											type={confirmPasswordVisible ? "text" : "password"}
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											required
											className={`block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border ${password !== confirmPassword ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
										/>
										<div className="absolute inset-y-0 mt-6 right-0 pr-3 flex items-center">
											<button
												type="button"
												onClick={() =>
													setConfirmPasswordVisible(!confirmPasswordVisible)
												}
											>
												{confirmPasswordVisible ? (
													<EyeSlashIcon className="h-5 w-5 text-gray-500" />
												) : (
													<EyeIcon className="h-5 w-5 text-gray-500" />
												)}
											</button>
										</div>
									</div>
								</div>
							) : (
								<div>
									<label
										htmlFor="email"
										className="block text-sm font-medium text-gray-700"
									>
										Email address
									</label>
									<input
										id="email"
										name="email"
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										className={`block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border ${error ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
									/>
								</div>
							)}
							{error && <p className="text-red-500 text-sm">{error}</p>}
							<div>
								<button
									type="submit"
									className="w-full px-4 py-2 text-sm font-medium text-white bg-[#111827] border border-transparent rounded-md shadow-sm hover:bg-[#374151] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								>
									{tokenValid ? "Submit" : "Send Reset Email"}
								</button>
							</div>
						</form>
					)}
				</CardContent>
				<CardFooter className="text-center">
					<p className="text-sm text-gray-600">
						Don't need to reset your password?{" "}
						<button
							onClick={onSwitchToLogin}
							className="text-green-600 hover:text-gray-900"
						>
							Log in
						</button>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
};

export default ForgotPasswordCard;
