"use client";

import { authClient } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";

import { Button } from "../ui/button";

const Socials = () => {
  const handleSocialAuth = () => {
    authClient.signIn.social({
      provider: "google",
      callbackURL: "/app",
    });
  };

  return (
    <div className="w-full">
      <Button
        size={"lg"}
        type="button"
        variant={"outline"}
        className="w-full justify-center gap-2.5 border-border/60 bg-background/50 font-medium transition-all hover:border-border hover:bg-background hover:shadow-sm"
        onClick={handleSocialAuth}
      >
        <FcGoogle className="size-5" /> Continuer avec Google
      </Button>
    </div>
  );
};

export default Socials;
