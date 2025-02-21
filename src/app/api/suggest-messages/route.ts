import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY: any = process.env.GIMINI_API_KEY;

export async function POST(req: Request) {
  const contextId = new Date().getTime(); // Unique identifier for variation

  const prompt = `Generate three **completely fresh and unique** open-ended questions in the format: 
  "Question 1 || Question 2 || Question 3". These questions are for an anonymous social platform and 
  should encourage fun, thoughtful, and engaging conversations. 

  Avoid repetition from previous responses and include creative topics.  
  Example categories: hobbies, future aspirations, hypothetical scenarios, travel, fun challenges.  
  Context ID: ${contextId}.`;

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 1.2,  // More creativity and variation
        topP: 0.9,        
        maxOutputTokens: 200, // Limit output length
      },
    });

    const result = await model.generateContent(prompt);

    return NextResponse.json(
      { messages: result.response.text() },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error occurred:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
