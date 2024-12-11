import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { token } = await request.json();
    const userWithToken = await UserModel.findOne({
      resetPasswordToken: token,
    });

    // Check for user exits with this token
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

    return new Response(
      JSON.stringify({
        success: true,
        message: "Token is valid",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error while validating token:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
