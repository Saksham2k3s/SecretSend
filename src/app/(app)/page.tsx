'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Send Anonymous Feedback, Safely.
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            SecretSend lets you share your thoughts without revealing your identity.
          </p>

          <Button
            className="mt-6 text-lg px-6 py-3 bg-purple-600 hover:bg-purple-700"
            asChild
          >
            <Link href="/send">Send Your Secret Anonymously</Link>
          </Button>
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
            <CarouselPrevious className=' text-black ' />
            <CarouselNext className='text-black' />
          </Carousel>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        Crafted with ❤️ by{' '}
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