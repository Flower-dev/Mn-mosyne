"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SignOutButton({ iconOnly = false }: { iconOnly?: boolean }) {
  return (
    <Button
      variant="ghost"
      size={iconOnly ? "icon-sm" : "sm"}
      className={
        iconOnly
          ? "text-muted-foreground"
          : "w-full justify-start gap-3 px-3 text-muted-foreground"
      }
      onClick={() => signOut({ callbackUrl: "/" })}
      title="Sign out"
    >
      <LogOut className="size-4 shrink-0" />
      {!iconOnly && "Sign out"}
    </Button>
  );
}
