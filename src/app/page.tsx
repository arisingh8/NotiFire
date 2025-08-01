import React from "react";
import Image from "next/image";
import Hero from "./sections/hero"; // Import Hero
import Button from "./components/button";
import Link from "next/link";
import { getUser } from "@/utils/getUser";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const user = await getUser(supabase);
  return (
    <div className="flex flex-col items-center min-h-screen p-8 pt-24 pb-20 gap-16 sm:p-20 font-(family-name:--font-eb-garamond)">
      {/* Hero Section */}
      <Hero />

      {/* Conditional Rendering Example */}
      {user ? (
        <p>Welcome back, {user.email}!</p>
      ) : (
        <p>You are not logged in.</p>
      )}

      {/* Get Started Button */}
      <div className="flex justify-center w-full">
        <Link href="/login">
          <Button variant="primary" size="large" className="font-bold">
            Get Started
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
