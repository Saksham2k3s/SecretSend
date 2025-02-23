import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import ResetPasswordEmail from "../../emails/resetPasswordEmail";

export async function sendResetPasswordOTP(
  email: string,
  username: string,
  frontendURL: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "send.sakshamtech.xyz",
      to: email,
      subject: "SecretSend Verification Code",
      react: ResetPasswordEmail({ username, url: frontendURL }),
    });
    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
