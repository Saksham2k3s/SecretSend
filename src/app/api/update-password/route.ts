import bcrypt from 'bcryptjs';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
export async function POST(request: Request) {
  try {
    await dbConnect();
    const { token, password } = await request.json();
    const userWithToken = await UserModel.findOne({ resetPasswordToken: token });

    // Check token is valid or not
    if (!userWithToken) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found or invalid token",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check for link expiry
    const { verifyCodeExpiry } = userWithToken;

    if (verifyCodeExpiry < new Date()) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Token has expired",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);
    userWithToken.password = hashPassword;
    userWithToken.resetPasswordToken = ''; 
    userWithToken.verifyCodeExpiry = new Date();

    // Save the user

    await userWithToken.save();
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Password changed Successfully!",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error while chaning password:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
