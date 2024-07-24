import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { resendVerificationEmail } from "@/api/authApi";
import { LoaderCircle } from "lucide-react"

const ResendVerifEmailCard = ({ onSwitchToLogin }) => {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const handleInputChange = (e) => {
		const { value } = e.target;
		setEmail(value);
		setError(""); // Clear error when user starts typing
	};

	const validateEmail = (email) => {
		const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return re.test(String(email).toLowerCase());
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!validateEmail(email)) {
			setError("Please enter a valid email address.");
			return;
		}

		setIsLoading(true);

		try {
			const response = await resendVerificationEmail(email);
			if (response.status === "Success") {
				setSuccess(true);
			} else {
				setError(response.message);
			}
		} catch (error) {
			setError("An unexpected error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-lg p-8 space-y-8 bg-white shadow-md rounded-lg">
			<CardHeader className="text-center">
				<CardTitle className="text-2xl font-bold">Resend Verification Email</CardTitle>
				<CardDescription className="text-gray-600">
					Please enter your email to resend the verification email
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{success ? (
					<Alert className="bg-green-100 border-green-400 text-green-700">
						<AlertDescription>
							Your verification email has been sent successfully, please check your inbox.
						</AlertDescription>
					</Alert>
				) : (
					<form className="space-y-4" onSubmit={handleSubmit}>
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700"
							>
								Email
							</label>
							<input
								id="email"
								name="email"
								type="email"
								value={email}
								onChange={handleInputChange}
								required
								className={`block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border ${error ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} 
								placeholder="Enter your email"
							/>
						</div>
						{error && <p className="text-red-500 text-sm">{error}</p>}
						<div className="flex justify-center">
							<button
								type="submit"
								className="w-full px-4 py-2 text-sm font-medium text-white bg-[#111827] border border-transparent rounded-md shadow-sm hover:bg-[#374151] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex justify-center items-center"
								disabled={isLoading}
							>
								{isLoading ? <LoaderCircle className="animate-spin h-5 w-5" /> : "Resend Verification Email"}
							</button>
						</div>
					</form>
				)}
			</CardContent>
			<CardFooter className="text-center">
				<p className="text-sm text-gray-600">
					Don't need to resend the verification email?{" "}
					<button
						onClick={onSwitchToLogin}
						className="text-green-600 hover:text-gray-900"
					>
						Back to Login
					</button>
				</p>
			</CardFooter>
		</Card>
	);
};

export default ResendVerifEmailCard;
