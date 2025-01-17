"use client";

import { SignIn } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if the auth state is loaded and the user is signed in
    if (isLoaded && isSignedIn) {
      console.log("User is signed in, redirecting to home...");
      router.push('/');  // Redirect to home instead of /form
    } else if (isLoaded && !isSignedIn) {
      console.log("User is not signed in, showing sign-in form.");
    }
  }, [isLoaded, isSignedIn, router]);

  // Show nothing while loading to avoid flash of content
  if (!isLoaded) {
    return null;
  }

  // Only show sign in form if user is not signed in
  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-white shadow-md",
            }
          }}
          redirectUrl="/"  // Redirect to home page after sign in
          signUpUrl="/sign-up"
          routing="path"
          path="/sign-in"
        />
      </div>
    );
  }

  return null;
}