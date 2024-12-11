import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import ResetPasswordEmail from "../../emails/resetPasswordEmail";

export async function sendResetPasswordOTP(
  username: string,
  frontendURL: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "sakshamshrivastav58@gmail.com",
      subject: "SecretSend Verification Code",
      react: ResetPasswordEmail({ username, url: frontendURL }),
    });
    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
