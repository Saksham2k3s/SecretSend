"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { ReactEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const [searchUsername, setSearchUsername] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleClick = async (e: any) => {
    e.preventDefault();

    if (!searchUsername.trim()) return;

    try {
      const res = await axios.get<ApiResponse>("/api/find-user-by-username", {
        params: {
          username: searchUsername.trim(),
        },
      });

      if (res.data.success) {
        router.push(`/u/${searchUsername}`);
      }
    } catch (error) {
      console.error("Error checking username:", error);
      toast({
        title: "Not Found",
        description: "User not found",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Send Anonymous Feedback, Safely.
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            SecretSend lets you share your thoughts without revealing your
            identity.
          </p>
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <Button className="text-black mt-4" variant="outline">
                  Send Your Secret Anonymously
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Send a Silent Whisper</DialogTitle>
                  <DialogDescription>
                    Enter the username of the person youd like to reach out to.
                    No names. No pressure. Just your honest thoughts — delivered
                    safely.
                  </DialogDescription>
                </DialogHeader>

                <Input
                  id="username"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  name="username"
                  defaultValue="Pedro Duarte"
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleClick} type="submit">
                    Find
                  </Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        </section>

        {/* Carousel for Messages */}
        <section className="text-center mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Need Inspiration? Here’s What Others Are Saying:
          </h2>

          <Carousel
            plugins={[Autoplay({ delay: 2500 })]}
            className="w-full max-w-lg md:max-w-xl"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Mail className="flex-shrink-0" />
                      <div>
                        <p>{message.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className=" text-black " />
            <CarouselNext className="text-black" />
          </Carousel>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        Crafted with ❤️ by{" "}
        <Link
          href="https://sakshamportfolio2k3.netlify.app"
          className="underline"
          target="_blank"
        >
          Saksham
        </Link>
      </footer>
    </>
  );
}
