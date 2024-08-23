import { Link, useNavigate } from 'react-router-dom';
import * as auth from '../../api/auth';
import { useQueryClient, useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import PasswordStrengthMeter from '../../components/account/PasswordMeter';
import { useState } from 'react';

export type RegisterFormData = {
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();


  const mutation = useMutation((data: RegisterFormData) => {
    const registrationData: auth.RegisterData = {
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
    };

    return auth.register(registrationData);
  }, {
    onSuccess: async () => {
      toast.success('Registration successful! Please check your email to confirm your account.');
      await queryClient.invalidateQueries('validateToken');
      toast('Waiting for email confirmation...', {
        icon: '✉️',
        duration: 10000,
      });
      navigate('/verify-email');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
      toast.error(errorMessage);
    },
  });

  // Watch the password field value to pass to the PasswordStrengthMeter
  const passwordValue = watch('password', '');

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className='justify-center flex my-8'>
      <form className="flex flex-col justify-center gap-5" onSubmit={onSubmit}>
        <h2 className="text-3xl text-center font-bold">Create Account</h2>

        <label className="text-gray-800 text-sm font-bold flex-1">
          Email
          <input
            className="border rounded w-full py-2 px-2 font-normal"
            placeholder="Email"
            required
            {...register('email', { required: 'This field is required' })}
          />
          {errors.email && <span className="text-red-500">{errors.email.message}</span>}
        </label>

        <label className="text-gray-800 text-sm font-bold flex-1">
          Phone Number
          <input
            className="border rounded w-full py-2 px-2 font-normal"
            placeholder="Phone Number"
            required
            {...register('phoneNumber', { required: 'This field is required' })}
          />
          {errors.phoneNumber && <span className="text-red-500">{errors.phoneNumber.message}</span>}
        </label>

        <label className="text-gray-800 text-sm font-bold flex-1">
          Password
          <input
            type="password"
            className="border rounded w-full py-2 px-2 font-normal"
            placeholder="Password"
            required
            {...register('password', { required: 'This field is required' })}
          />
          {errors.password && <span className="text-red-500">{errors.password.message}</span>}
          <PasswordStrengthMeter password={passwordValue} />
        </label>

        <label className="text-gray-800 text-sm font-bold flex-1">
          Confirm Password
          <input
            type="password"
            className="border rounded w-full py-2 px-2 font-normal"
            placeholder="Confirm Password"
            required
            {...register('confirmPassword', {
              validate: (val) => {
                if (!val) {
                  return 'This field is required';
                } else if (watch('password') !== val) {
                  return 'Your passwords do not match';
                }
              },
            })}
          />
          {errors.confirmPassword && (
            <span className="text-red-500">{errors.confirmPassword.message}</span>
          )}
        </label>

        <div className="flex flex-col items-center justify-between">
          <span className="text-sm mb-4 text-blue-600">
            Already Registered?{' '}
            <Link className="underline hover:no-underline" to="/login">
              Login here
            </Link>
          </span>
          <button
            type="submit"
            className="text-white mt-4 bg-primary hover:bg-white border 
            border-gray-300 hover:text-gray-900 focus:ring-4 focus:ring-gray-200 font-medium 
            rounded-lg text-sm px-4 py-2 sm:px-5 sm:py-3 focus:outline-none w-full"
          >
            {mutation.isLoading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
