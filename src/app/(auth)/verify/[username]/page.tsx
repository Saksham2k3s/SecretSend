"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";

export default function VerifyAccount() {
  // Status for input fields
  const [inputArray, setInputArray] = useState(new Array(6).fill(null));
  const [focusIndex, setFocusIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const onSubmit = async (code: string) => {
    setLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: code,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Verification Failed",
        description:
          axiosError.response?.data.message ??
          "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setInputArray(new Array(6).fill(null));
      setLoading(false);
      setFocusIndex(0)
    }
  };

  // useEffect to watch focus index
  useEffect(() => {
    const inputElement = inputRefs.current[focusIndex];
    if (inputElement && typeof inputElement.focus === "function") {
      inputElement.focus();
    }
  }, [focusIndex]);

  // handleChange to handle change in input fields
  const handleChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const newArray = [...inputArray];
    const value = event.target.value;
  
    if (value.length <= 1) {
      newArray[index] = value;
      setInputArray(newArray);

      if (index === newArray.length - 1) {
        const code = newArray.join(""); 
        onSubmit(code);
      }
    }
  
    if (value && index < inputArray.length - 1) {
      setFocusIndex(index + 1);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full flex flex-col justify-center max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <div className=" flex justify-center align-middle gap-4 ">
          {inputArray.map((_, index) => {
            return (
              <input
                className={`p-2 rounded-md h-10 w-10 border border-gray-700 flex justify-center text-center align-middle`}
                key={index}
                type="text"
                maxLength={1}
                value={inputArray[index] ? inputArray[index] : ""}
                onChange={(e) => handleChange(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                readOnly={index !== focusIndex}
              />
            );
          })}
        </div>
        <Button>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Verify"
          )}
        </Button>
      </div>
    </div>
  );
}
