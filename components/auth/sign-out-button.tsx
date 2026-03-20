"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SignOutButton({ iconOnly = false }: { iconOnly?: boolean }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <Button
      variant="ghost"
      size={iconOnly ? "icon-sm" : "sm"}
      className={
        iconOnly
          ? "text-muted-foreground"
          : "w-full justify-start gap-3 px-3 text-muted-foreground"
      }
      onClick={handleSignOut}
      title="Sign out"
    >
      <LogOut className="size-4 shrink-0" />
      {!iconOnly && "Sign out"}
    </Button>
  );
}

