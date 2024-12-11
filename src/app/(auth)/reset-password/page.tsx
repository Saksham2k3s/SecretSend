"use client";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { resetPass } from "@/schemas/reset-password";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";

import React, { useEffect, useState } from "react";

function ResetPassword() {
  const { toast } = useToast();
  const [email, setEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (errorMessage) {
      toast({
        description: errorMessage,
        title: "Error",
        variant: "destructive",
      });
    }
  }, [errorMessage, toast]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email using Zod schema
    const emailValidation = resetPass.safeParse({ email });
    if (!emailValidation.success) {
      // Display all validation errors via toast
      setErrorMessage(emailValidation?.error.issues[0].message);
      return;
    } else {
      try {
        setIsSubmitting(true);
        const response = await axios.post<ApiResponse>(`/api/reset-password`, {
          email: email,
        });
        toast({
          description: response.data.message,
          title: "Success",
        });
        setEmail("");
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          description:
            axiosError.response?.data.message ||
            "An error occurred. Please try again.",
          title: "Verification Failed",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-2xl mb-6">
            Reset Your Password
          </h1>
          <p className="mb-4">
            Enter your email address, and we’ll send you a password reset link.
          </p>
        </div>
        <form onSubmit={handleEmailSubmit}>
          <div className="flex flex-col gap-5">
            {/* Input field */}
            <input
              type="text"
              placeholder="Enter your email"
              className="w-full py-1 px-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Submit button */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
