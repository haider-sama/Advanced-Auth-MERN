import { Request, Response } from "express";
import generateToken from "../utils/generateToken";
import User from "../models/user";
import { generateVerificationToken } from "../utils/tokenUtils";
import { 
  sendPasswordResetEmail,
  sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
} from "../utils/emailService";
import { uploadImage } from "../utils/uploadImage";
import multer from "multer";

export async function register(req: Request, res: Response) {
  const { email, phoneNumber, password } = req.body;

  try {
    if (!email || !password || !phoneNumber) {
			throw new Error("All fields are required");
		}

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      email,
      phoneNumber,
      password,
      createdAt: new Date(),
      lastOnline: new Date(), // Initially set to current date/time
      isEmailVerified: false,
      verificationToken: generateVerificationToken(),
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    const token = user.verificationToken as string;
    // await sendVerificationEmail(user.email, token);
    console.log("Verification Token:", token);

    if (user) {
      generateToken(res, user._id);

      res.status(201).json({
        _id: user._id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isEmailVerified: user.isEmailVerified,
        verificationToken: user.verificationToken,
        verificationTokenExpiresAt: user.verificationTokenExpiresAt,
        success: true,
			  message: "User created successfully",
      });
    } else {
      res.status(500).json({ message: 'Something went wrong while registering user' });
    }

  } catch (err: any) {
    console.error('Registration Error:', err.message);
    res.status(500).json({ message: 'Something went wrong while registering user' });
  }
};


export async function login (req: Request, res: Response) {
    const { email, password } = req.body;

    try  {
    const user = await User.findOne({ email });
  
    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
  
      res.status(200).json({
        _id: user._id,
        email: user.email,
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('Something went wrong while logging user');
    }
};

export async function logout (req: Request, res: Response) {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export async function getUserProfile (req: Request, res: Response) {
  const userId = req.userId;

  try {
      const user = await User.findById(userId).select("-password");

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      res.json(user);

    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: "Error while fetching user" });
    }
};

export async function updateUserProfile (req: Request, res: Response) {
  const { userId } = req.params;
  const { firstName, lastName, phoneNumber, address, city, country } = req.body;

  try {
    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.address = address || user.address;
    user.city = city || user.city;
    user.country = country || user.country;

    // Save updated user
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Cannot save User. Server error' });
  }
};

export async function fetchAllUsers (req: Request, res: Response) {
  try {
    const users = await User.find().select('-password'); // Exclude password field from the result
    res.json(users);
  } catch (error: any) {
    console.error("Error while fetching users:", error);
    res.status(500).json({ message: "Error while fetching users" });
  }
};

export async function fetchUserById (req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password'); // Exclude password field from the result

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error: any) {
    console.error("Error while fetching user:", error);
    res.status(500).json({ message: "Error while fetching user" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
	const { code } = req.body;

	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}
    

		user.isEmailVerified = true;
		user.verificationToken = null;
		user.verificationTokenExpiresAt = null;
		await user.save();

		// Respond with the specific fields you want to include in the response
		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				_id: user._id,
				email: user.email,
				phoneNumber: user.phoneNumber,
				isEmailVerified: user.isEmailVerified,
				// Exclude the password from the response
				password: undefined,
			},
		});
	} catch (error: any) {
		console.log("Cannot verify email ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const forgotPassword = async (req: Request, res: Response) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate Reset Token
		const resetToken = generateVerificationToken();
		const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error: any) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const resetPassword = async (req: Request, res: Response) => {

	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		// // Update password
		// const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = password;
    user.resetPasswordToken = null;
		user.resetPasswordExpiresAt = null;
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error: any) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5mb
  },
});

export const uploadSingleAvatar = upload.single("avatar");

export const uploadAvatar = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const avatarURL = await uploadImage(req.file);
    const user = await User.findByIdAndUpdate(userId, { avatarURL }, { new: true });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
};

