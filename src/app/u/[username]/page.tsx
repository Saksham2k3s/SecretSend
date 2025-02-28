"use client";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle
} from "@/components/ui/dialog";
import VoiceInputModal from "@/components/VoiceMessage";

function Page() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [suggestMessageLoading, setSuggestMessageLoading] =
    useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const { toast } = useToast();
  const { username } = useParams();

  const handleSuggesMessages = async () => {
    setSuggestMessageLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/suggest-messages");
      const messages: any = response.data?.messages;
      const messagesArray = messages?.split("||");
      setSuggestedMessages(messagesArray);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch suggested messages",
        variant: "destructive",
      });
    } finally {
      setSuggestMessageLoading(false);
    }
  };
  const handleSendMessage = async () => {
    try {
      setLoading(true);
      const response = await axios.post<ApiResponse>(`/api/send-message`, {
        username: username,
        textContent: input,
        messageType: 'text'
      });

      toast({
        title: "Success",
        description: "Message send successfully!",
      });

      setInput("");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          `Failed to send message to ${username}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <main className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
        <div className="text-xl font-bold mb-4 flex justify-between">
          Send Anonymous Messages to @{username}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div
                  className="flex flex-col justify-center cursor-pointer hover:bg-gray-200 p-2 rounded-full "
                >
                   <Dialog>
                    <DialogTrigger>
                      <svg
                        data-testid="geist-icon"
                        height="16"
                        stroke-linejoin="round"
                        style={{ color: "currentcolor" }}
                        viewBox="0 0 16 16"
                        width="16"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M8.50098 1.5H7.50098C6.67255 1.5 6.00098 2.17157 6.00098 3V7C6.00098 7.82843 6.67255 8.5 7.50098 8.5H8.50098C9.32941 8.5 10.001 7.82843 10.001 7V3C10.001 2.17157 9.32941 1.5 8.50098 1.5ZM7.50098 0C5.84412 0 4.50098 1.34315 4.50098 3V7C4.50098 8.65685 5.84412 10 7.50098 10H8.50098C10.1578 10 11.501 8.65685 11.501 7V3C11.501 1.34315 10.1578 0 8.50098 0H7.50098ZM7.25098 13.2088V15.25V16H8.75098V15.25V13.2088C11.5607 12.8983 13.8494 10.8635 14.5383 8.18694L14.7252 7.46062L13.2726 7.08673L13.0856 7.81306C12.5028 10.0776 10.4462 11.75 8.00098 11.75C5.55572 11.75 3.49918 10.0776 2.91633 7.81306L2.72939 7.08673L1.27673 7.46062L1.46368 8.18694C2.15258 10.8635 4.44128 12.8983 7.25098 13.2088Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle> 🎤 </DialogTitle>
                      <VoiceInputModal username={username} closeModal={() => setIsModalOpen(false)} />
                    </DialogContent>
                  </Dialog>

                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send Voice Note</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Textarea
          placeholder="Type your message here."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="w-full items-center mt-5 flex justify-center">
          <Button onClick={handleSendMessage}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending
              </>
            ) : (
              "Send"
            )}
          </Button>
        </div>

        {/* Suggest Messages */}

        <div className="mt-5">
          <Button onClick={handleSuggesMessages}>Suggest Messages</Button>
          <div className="text-lg mt-4">
            Click on any message below to select it
          </div>
          <div className="px-4 py-5 border rounded-xl mt-4 ">
            <h2 className="text-2xl font-bold">Messages</h2>

            {suggestMessageLoading && (
              <div className="flex justify-center">
                {" "}
                Generating Messages{" "}
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
              </div>
            )}

            {!suggestMessageLoading &&
              suggestedMessages &&
              suggestedMessages.map((message, idx) => {
                return (
                  <div
                    key={idx}
                    className="border text-center text-lg font-semibold py-2 my-3 rounded-xl cursor-pointer "
                    onClick={() => setInput(message)}
                  >
                    {message}
                  </div>
                );
              })}
          </div>
        </div>
      </main>
    </>
  );
}

export default Page;
