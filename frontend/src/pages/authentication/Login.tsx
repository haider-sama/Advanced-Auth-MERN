import { Link, useLocation, useNavigate } from "react-router-dom";
import * as authAPI from "../../api/auth";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";


export type LoginFormData = {
  email: string;
  password: string;
};

const Login = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const location = useLocation();


    const {
      register,
      formState: { errors },
      handleSubmit,
    } = useForm<LoginFormData>();
  
    const mutation = useMutation(authAPI.login, {
      onSuccess: async () => {
        toast.success("Login Successful!");
        await queryClient.invalidateQueries("validateToken");
        navigate(location.state?.from?.pathname || "/account");
      },
      onError: (error: Error) => {
        toast.error(error.message || "An unexpected error occurred");
      },
    });
  
    const onSubmit = handleSubmit((data) => {
      mutation.mutate(data);
    });

    return (
        <div className='justify-center flex my-8'>
        <form className="flex flex-col justify-center gap-5" 
        onSubmit={onSubmit}>
          <h2 className="text-3xl text-center font-bold">Login</h2>
          <label className="text-gray-800 text-sm font-bold flex-1">
            Email
            <input type="email"
            className="border rounded w-full py-2 px-2 font-normal"
            placeholder="Email"
            required
            {...register("email", { required: "This field is required" })}
            ></input>
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </label>

          <label className="text-gray-800 text-sm font-bold flex-1">
            Password
            <input type="password"
            className="border rounded w-full py-2 px-2 font-normal"
            placeholder="Password"
            required
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            ></input>
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </label>

          <div className="flex flex-col items-center justify-between">
            <span className="text-sm mb-4 text-blue-600">
              Not Registered?{" "}
              <Link className="underline hover:no-underline" to="/register">
                Create an account here
              </Link>
            </span>

            <span className="text-sm mb-4 text-blue-600">
              <Link className="hover:underline" to="/forgot-password">
                Forgot Password?
              </Link>
            </span>
            
            <button type="submit"
            className="text-white mt-4 bg-primary hover:bg-white border 
          border-gray-300 hover:text-gray-900 focus:ring-4 focus:ring-gray-200 font-medium 
            rounded-lg text-sm px-4 py-2 sm:px-5 sm:py-3 focus:outline-none w-full">
              Login
            </button>
          </div>
      </form>
      </div>
    );
}

export default Login;