"use client";

import { SignIn, useSignIn } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const signIn = useSignIn();
  const router = useRouter();

  useEffect(() => {
    if (signIn.isSignedIn) {
      router.push("/form"); // Redirect to the form page after sign-in
    }
  }, [signIn.isSignedIn, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white shadow-md",
          }
        }}
        afterSignInUrl="/form" // Optional, can be removed since we handle it in useEffect
        signUpUrl="/sign-up"
        routing="path"
        path="/sign-in"
        socialButtonsPlacement="bottom"
        socialButtons={["oauth_google"]}
      />
    </div>
  );
}