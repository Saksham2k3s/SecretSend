import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  await dbConnect();
  const { username, textContent, messageType, audioBase64 } =
    await request.json();
  // Validate input
  if (
    !username ||
    !messageType ||
    (messageType === "text" && !textContent) ||
    (messageType === "audio" && !audioBase64)
  ) {
    return Response.json(
      { message: "Invalid request data", success: false },
      { status: 400 }
    );
  }

  try {
    const user = await UserModel.findOne({ username }).exec();
    if (!user) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // Check if the user is accepting messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        { message: "User is not accepting messages", success: false },
        { status: 403 } // 403 Forbidden status
      );
    }

    let content = "";
    if (messageType === "text") {
      content = textContent;
    } else if (messageType === "audio" && audioBase64) {
      // Convert Base64 to Buffer
      const base64Data = audioBase64.replace(/^data:audio\/\w+;base64,/, "");
      const audioBuffer = Buffer.from(audioBase64, "base64");
      // Upload to Cloudinary
      const uploadResponse: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: "secret-send-audio", resource_type: "auto" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(audioBuffer);
      });

      if (
        !uploadResponse ||
        typeof uploadResponse !== "object" ||
        !uploadResponse.url
      ) {
        return Response.json(
          { message: "Failed to upload audio", success: false },
          { status: 500 }
        );
      }

      content = uploadResponse.secure_url;
    } else {
      return Response.json(
        { message: "Invalid message type", success: false },
        { status: 400 }
      );
    }

    const newMessage = {
      content,
      createdAt: new Date(),
      messageType: messageType,
    };

    // Push the new message to the user's messages array
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      { message: "Message sent successfully", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding message:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
