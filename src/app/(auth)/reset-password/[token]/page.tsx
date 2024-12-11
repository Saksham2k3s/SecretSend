"use client";
import { ApiResponse } from "@/types/ApiResponse";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function Page() {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [tokenVerify, setTokenVerify] = useState(false);
  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter()
  // Verify token
  const verifyToken = async (urlToken: string) => {
    setLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-token`, {
        token: urlToken,
      });
      setTokenVerify(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get the token from URL
    const urltoken = pathname.split("/").pop();
    setToken(urltoken as string);
    verifyToken(urltoken as string);
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords are not matching",
      });
    }
    try {
      setIsSubmitting(true);
      const response = await axios.post<ApiResponse>(`/api/update-password`, {
        token: token,
        password: password,
      });
      toast({
        title: "Success",
        description: response.data.message,
      });

      setConfirmPassword("");
      setPassword("");

      // Redirect to login
      router.replace('/sign-in')
    } catch (error) {
      console.log("Inside error", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div>Loading</div>
      ) : (
        <div>
          {tokenVerify ? (
            <div className="flex justify-center items-center min-h-screen bg-gray-800">
              <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                  <h1 className="text-4xl font-extrabold tracking-tight lg:text-2xl mb-6">
                    Reset Your Password
                  </h1>
                  <p className="mb-4">Enter your new password</p>
                </div>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="flex flex-col gap-5">
                    {/* Input field */}
                    <input
                      type="password"
                      placeholder="New password"
                      className="w-full py-1 px-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <input
                      type="password"
                      placeholder="Confirm your password"
                      className="w-full py-1 px-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {/* Submit button */}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Please wait
                        </>
                      ) : (
                        "Change"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div>Page Not Found - The link may be expired or invalid.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Page;
