import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as authAPI from "../../api/auth";

const RequestEmailVerification: React.FC = () => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (index: number, value: string) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findIndex((digit) => digit === "");
      const focusIndex = lastFilledIndex !== -1 ? lastFilledIndex : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join("");
    setIsLoading(true);
    setError(null);

    try {
      await authAPI.verifyEmail(verificationCode);
      navigate("/");
      toast.success("Email verified successfully");
    } catch (error: any) {
      setError(error.message || "Failed to verify email");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit") as unknown as React.FormEvent);
    }
  }, [code]);

  return (
    <div className="max-w-md w-full overflow-hidden">
      <div className="p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary bg-clip-text">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-600 mb-6">Enter the 6-digit code sent to your email address.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el!)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-yellow-500 focus:outline-none"
              />
            ))}
          </div>
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
          <button
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
            className="text-white mt-4 bg-primary hover:bg-white border 
          border-gray-300 hover:text-gray-900 focus:ring-4 focus:ring-gray-200 font-medium 
            rounded-lg text-sm px-4 py-2 sm:px-5 sm:py-3 focus:outline-none w-full"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestEmailVerification;
