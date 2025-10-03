import Image from "next/image";
import React from "react";
import SignInFormClient from "@/features/components/signin-form-client";

const SignInPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8">
      <Image src="/logo.svg" alt="Logo Image" width={300} height={300} />
      <SignInFormClient />
    </div>
  );
};

export default SignInPage;