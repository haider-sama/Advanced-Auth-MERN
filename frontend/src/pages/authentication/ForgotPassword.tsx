import { useState } from "react";
import * as authAPI from "../../api/auth";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiMail } from "react-icons/fi";

const ForgotPassword = () => {
	const [email, setEmail] = useState<string>("");
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await authAPI.forgotPassword(email);
			setIsSubmitted(true);
		} catch (error) {
			console.error("Error sending reset link:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="max-w-md w-full overflow-hidden">
			<div className="p-8">
				<h2 className="text-3xl font-bold mb-6 text-center text-primary bg-clip-text">
					Forgot Password
				</h2>

				{!isSubmitted ? (
					<form onSubmit={handleSubmit}>
						<p className="text-gray-300 mb-6 text-center">
							Enter your email address and we'll send you a link to reset your password.
						</p>
						<div className="mb-4">
							<div className="relative">
								<span className="absolute inset-y-0 left-0 pl-3 flex items-center">
									<FiMail className="h-5 w-5 text-gray-400" />
								</span>
								<input
									type="email"
									placeholder="Email Address"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="border rounded w-full py-2 px-2 font-normal"
								/>
							</div>
						</div>
						<button
							type="submit"
							disabled={isLoading}
							className="text-white mt-4 bg-primary hover:bg-white border 
                            border-gray-300 hover:text-gray-900 focus:ring-4 focus:ring-gray-200 font-medium 
                            rounded-lg text-sm px-4 py-2 sm:px-5 sm:py-3 focus:outline-none w-full"
						>
							{isLoading ? "Sending..." : "Send Reset Link"}
						</button>
					</form>
				) : (
					<div className="text-center">
						<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
							<FiMail className="h-8 w-8 text-white" />
						</div>
						<p className="text-gray-300 mb-6">
							If an account exists for {email}, you will receive a password reset link shortly.
						</p>
					</div>
				)}
			</div>

			<div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
				<Link to="/login" className="text-sm text-gray-900 hover:underline flex items-center">
					<FiArrowLeft className="h-4 w-4 mr-2" /> Back to Login
				</Link>
			</div>
		</div>
	);
};

export default ForgotPassword;
