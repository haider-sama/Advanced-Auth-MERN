export type UserType = {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    city: string;
    country: string;
    avatarURL?: string;
    createdAt: string;
    lastOnline: string; 
    phoneNumber?: string;
    address: string;
    isEmailVerified: boolean;
    resetPasswordToken: string | null,
	resetPasswordExpiresAt: Date | null,
	verificationToken: string | null,
	verificationTokenExpiresAt: Date | null,
    matchPassword: (enteredPassword: string) => Promise<boolean>;
};
  