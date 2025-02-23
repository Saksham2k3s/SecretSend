import { sendResetPasswordOTP } from "@/helpers/sendResetPasswordEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import crypto from "crypto"
export async function POST(request: Request) {
  console.log("Inside reset password");
  await dbConnect();

  try {
    const { email } = await request.json();
    const userByEmail = await UserModel.findOne({ email: email });
    if (!userByEmail) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    const resetPasswordToken = crypto.randomBytes(32).toString('hex');
    userByEmail.verifyCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);
    userByEmail.resetPasswordToken = resetPasswordToken;
    await userByEmail.save();
    // change it according to need
    const FRONTEND_URL = `${process.env.FRONTEND_URL}/reset-password/${resetPasswordToken}`
    // Send verification code
    const emailResponse = await sendResetPasswordOTP(
      email,
      userByEmail.username,
      FRONTEND_URL
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Reset Password Request Received. Please verify your account first.',
        username: userByEmail.username
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error While reset password:", error);
    return Response.json(
      {
        success: false,
        message: "Network Error",
      },
      { status: 500 }
    );
  }
}
