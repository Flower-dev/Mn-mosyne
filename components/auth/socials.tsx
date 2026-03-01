"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

import { APP_ROUTES } from "@/routes";
import { Button } from "../ui/button";

const Socials = () => {
  const handleSocialAuth = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: APP_ROUTES.HOME,
    });
  };

  return (
    <div className="w-full">
      <Button
        size={"lg"}
        type="button"
        variant={"outline"}
        className="w-full justify-center gap-2.5 border-border/60 bg-background/50 font-medium transition-all hover:border-border hover:bg-background hover:shadow-sm"
        onClick={() => handleSocialAuth("google")}
      >
        <FcGoogle className="size-5" /> Continuer avec Google
      </Button>
    </div>
  );
};

export default Socials;