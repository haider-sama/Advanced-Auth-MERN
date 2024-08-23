import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import toast from "react-hot-toast";
import * as authAPI from "../../api/auth";

const ResetPassword = () => {
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { token } = useParams<{ token: string }>();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			alert("Passwords do not match");
			return;
		}

		setIsLoading(true);
		try {
			if (token) {
				await authAPI.resetPassword(token, password);
				toast.success("Password reset successfully, redirecting to login page...");
				setTimeout(() => {
					navigate("/login");
				}, 2000);
			} else {
				toast.error("Invalid token, please try again.");
			}
		} catch (error: any) {
			console.error(error);
			toast.error(error.message || "Error resetting password");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='max-w-md w-full overflow-hidden'>
			<div className='p-8'>
				<h2 className='text-3xl font-bold mb-6 text-center text-primary'>
					Reset Password
				</h2>

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-gray-900 text-sm font-bold mb-2" htmlFor="new-password">
							New Password
						</label>
						<div className="flex items-center border rounded w-full py-2 px-3 bg-gray-700 text-white">
							<FaLock className="mr-3" />
							<input
								id="new-password"
								type="password"
								placeholder="New Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="border rounded w-full py-2 px-2 font-normal"
							/>
						</div>
					</div>

					<div className="mb-6">
						<label className="block text-gray-900 text-sm font-bold mb-2" htmlFor="confirm-password">
							Confirm New Password
						</label>
						<div className="flex items-center border rounded w-full py-2 px-3 bg-gray-700 text-white">
							<FaLock className="mr-3" />
							<input
								id="confirm-password"
								type="password"
								placeholder="Confirm New Password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								className="border rounded w-full py-2 px-2 font-normal"
							/>
						</div>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className='text-white mt-4 bg-primary hover:bg-white border 
                        border-gray-300 hover:text-gray-900 focus:ring-4 focus:ring-gray-200 font-medium 
                        rounded-lg text-sm px-4 py-2 sm:px-5 sm:py-3 focus:outline-none w-full'
					>
						{isLoading ? "Resetting..." : "Set New Password"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default ResetPassword;
