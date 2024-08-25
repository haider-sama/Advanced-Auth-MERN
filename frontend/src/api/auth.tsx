import { UserType } from "../../../backend/src/shared/types";
import { LoginFormData } from "../pages/authentication/Login";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

export type RegisterData = {
  email: string;
  phoneNumber: string;
  password: string;
};

export const fetchCurrentUser = async (): Promise<UserType> => {
    const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Error fetching user");
    }
    return res.json();
};

export const fetchUserProfileById = async (userId: string): Promise<UserType> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/users/${userId}`, {
      method: 'GET',
      credentials: 'include', // Include credentials for authentication if needed
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error fetching user');
    }

    return res.json();
  } catch (error) {
    console.error('Error:', error);
    throw error; // Re-throw the error after logging it
  }
};

export const fetchAllUsers = async (): Promise<UserType[]> => {
  const res = await fetch(`${API_BASE_URL}/api/auth/users`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Error fetching users");
  }
  return res.json();
};

export const register = async (formData: RegisterData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Registration Error:', data.message); // Log the error message
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  } catch (error) {
    console.error('Registration Error:', error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

export const login = async (formData: LoginFormData) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
  
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }
    return data;
};

export const logout = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      credentials: "include",
      method: "POST",
    });
  
    if (!response.ok) {
      throw new Error("Error while signing out");
    }
};

export const validateToken = async () => {
    const res = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
      credentials: "include",
    });
  
    if (!res.ok) {
      throw new Error("Invalid Token.");
    }
  
    return res.json();
};

// Fetch the user profile data
export const fetchUserProfile = async () => {
  const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return res.json();
};

export const updateAvatar = async (userId: string, avatarURL: string) => {
  const response = await fetch('/api/auth/update-avatar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, avatarURL }),
  });

  if (!response.ok) {
    throw new Error('Failed to update avatar');
  }
};

export const updateUserProfile = async (userId: string, userData: Partial<UserType>): Promise<UserType> => {
  const res = await fetch(`${API_BASE_URL}/api/auth/profile/${userId}`, {
    method: "PUT",
    credentials: "include",  // Assuming session-based authentication
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to update profile');
  }

  return data;
};

interface User {
  email: string;
  // Add any other fields as needed
}

interface AuthResponse {
  user: User;
  message?: string;
}

export const verifyEmail = async (code: string): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error verifying email");
  }

  return res.json();
};

export const resetPassword = async (token: string, password: string): Promise<{ message: string }> => {
  const res = await fetch(`${API_BASE_URL}/api/auth/reset-password/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error resetting password");
  }

  return res.json();
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error sending reset password email");
  }

  return res.json();
};

export const checkAuth = async (): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE_URL}/api/auth/check-auth`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error('Not authenticated');
  }

  return res.json();
};

export const uploadAvatar = async (file: File): Promise<Response> => {
  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/upload-avatar`, {
      method: 'POST',
      body: formData,
      credentials: 'include', // Include cookies if needed for authentication
    });

    if (!response.ok) {
      throw new Error('Failed to upload avatar');
    }

    return response;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};