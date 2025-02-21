"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/components/ui/use-toast";

type VoiceInputModalProps = {
  username: any;
  closeModal: () => void;
};

function VoiceInputModal({ username, closeModal }: VoiceInputModalProps) {
  const [isRecording, setIsRecording] = useState(false);;
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Start Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to access microphone. Please check your permissions.",
        variant: "destructive",
      });
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendVoiceMessage = async (base64Audio: string) => {
    try {
      const apiResponse = await axios.post<ApiResponse>("/api/send-message", {
        username,
        audioBase64: base64Audio,
        messageType: "audio",
      });
      if (apiResponse.data.success) {
        toast({ title: "Success", description: "Message sent successfully!" });
        setAudioUrl(null);
        closeModal()
        
      } else {
        toast({
          title: "Error",
          description: apiResponse.data.message || "Failed to send voice note.",
          variant: "destructive",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || `Failed to send message to ${username}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!audioUrl) {
      toast({ title: "Error", description: "No voice note recorded.", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();

      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = async () => {
        let base64Audio = reader.result as string;
        if (!base64Audio) {
          toast({ title: "Error", description: "Failed to process audio.", variant: "destructive" });
          setLoading(false);
          return;
        }

        // Remove the base64 prefix if needed
        base64Audio = base64Audio.replace(/^data:audio\/\w+;base64,/, "");

        sendVoiceMessage(base64Audio);
      };
    } catch (error) {
      console.error("Error sending voice note:", error);
      toast({ title: "Error", description: "Failed to send voice note. Try again.", variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <>
          <div className="flex flex-col items-center space-y-4">
            {audioUrl ? (
              <audio controls src={audioUrl} className="w-full rounded"></audio>
            ) : (
              <p>{isRecording ? "Recording..." : "Press Start to record your voice note."}</p>
            )}

            <div className="flex space-x-4">
              {!isRecording ? (
                <Button onClick={startRecording}>Start Recording</Button>
              ) : (
                <Button variant="destructive" onClick={stopRecording}>
                  Stop Recording
                </Button>
              )}
            </div>

            {audioUrl && (
              <Button onClick={handleSendMessage} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  "Send Voice Note"
                )}
              </Button>
            )}
          </div>
    </>
  );
}

export default VoiceInputModal;