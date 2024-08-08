// This component displays a card with a form to request a new role. 
// It allows the user to enter their email and select the role they'd like to re-request.

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
import { applyForNewRoleRequest } from "@/api/authApi";

const NewRoleRequestCard = ({ onSwitchToLogin }) => {
	const [requestDetails, setRequestDetails] = useState({
		email: "",
		role: ""
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	// Handle input changes in the form
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setRequestDetails((prev) => ({ ...prev, [name]: value }));
		setError(""); // Clear error when user starts typing
	};

	// Validate the email
	const validateEmail = (email) => {
		const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return re.test(String(email).toLowerCase());
	};

	// Handle submitting the form
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!validateEmail(requestDetails.email)) {
			setError("Please enter a valid email address.");
			return;
		}

		if (!requestDetails.role) {
			setError("Please select a role.");
			return;
		}

		setIsLoading(true);

		try {
			const response = await applyForNewRoleRequest(requestDetails);
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
				<CardTitle className="text-2xl font-bold">Request New Role</CardTitle>
				<CardDescription className="text-gray-600">
					Please enter your email and select the role you'd like to request
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{success ? (
					<Alert className="bg-green-100 border-green-400 text-green-700">
						<AlertDescription>
							Your role request has been submitted successfully! An admin will
							review your request.
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
								value={requestDetails.email}
								onChange={handleInputChange}
								required
								className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								placeholder="Enter your email"
							/>
						</div>
						<div>
							<label
								htmlFor="role"
								className="block text-sm font-medium text-gray-700"
							>
								Requested Role
							</label>
							<select
								id="role"
								name="role"
								value={requestDetails.role}
								onChange={handleInputChange}
								required
								className="block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							>
								<option value="">Select a role</option>
								<option value="INSTRUCTOR">Instructor</option>
								<option value="ADMIN">Admin</option>
							</select>
						</div>
						{error && <p className="text-red-500 text-sm">{error}</p>}
						<div>
							<button
								type="submit"
								className="w-full px-4 py-2 text-sm font-medium text-white bg-[#111827] border border-transparent rounded-md shadow-sm hover:bg-[#374151] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								disabled={isLoading}
							>
								{isLoading ? "Submitting..." : "Submit Request"}
							</button>
						</div>
					</form>
				)}
			</CardContent>
			<CardFooter className="text-center">
				<p className="text-sm text-gray-600">
					Don't need to request a new role?{" "}
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

export default NewRoleRequestCard;
