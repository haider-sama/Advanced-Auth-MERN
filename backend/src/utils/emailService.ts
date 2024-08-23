import nodemailer, { SentMessageInfo }  from 'nodemailer';
import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from './emailTemplates';

const sender = 'your-email@example.com'; // Replace with your email

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // This may be necessary for development
  },
});

export const sendVerificationEmail = async (email: string, verificationToken: string): Promise<SentMessageInfo> => {
	const mailOptions = {
		from: sender,
		to: email,
		subject: "Verify your email",
		html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
	};

	try {
		const response = await transporter.sendMail(mailOptions);
		console.log("Verification email sent successfully", response);
		return response;
	} catch (error) {
		console.error("Error sending verification email", error);
		throw new Error(`Error sending verification email: ${error}`);
	}
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<SentMessageInfo> => {
	const mailOptions = {
		from: sender,
		to: email,
		subject: "Welcome to Auth Company",
		html: `<h1>Welcome, ${name}!</h1><p>Thank you for joining Auth Company.</p>`,
	};

	try {
		const response = await transporter.sendMail(mailOptions);
		console.log("Welcome email sent successfully", response);
		return response;
	} catch (error) {
		console.error("Error sending welcome email", error);
		throw new Error(`Error sending welcome email: ${error}`);
	}
};

export const sendPasswordResetEmail = async (email: string, resetURL: string): Promise<SentMessageInfo> => {
	const mailOptions = {
		from: sender,
		to: email,
		subject: "Reset your password",
		html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
	};

	try {
		const response = await transporter.sendMail(mailOptions);
		console.log("Password reset email sent successfully", response);
		return response;
	} catch (error) {
		console.error("Error sending password reset email", error);
		throw new Error(`Error sending password reset email: ${error}`);
	}
};

export const sendResetSuccessEmail = async (email: string): Promise<SentMessageInfo> => {
	const mailOptions = {
		from: sender,
		to: email,
		subject: "Password Reset Successful",
		html: PASSWORD_RESET_SUCCESS_TEMPLATE,
	};

	try {
		const response = await transporter.sendMail(mailOptions);
		console.log("Password reset success email sent successfully", response);
		return response;
	} catch (error) {
		console.error("Error sending password reset success email", error);
		throw new Error(`Error sending password reset success email: ${error}`);
	}
};

