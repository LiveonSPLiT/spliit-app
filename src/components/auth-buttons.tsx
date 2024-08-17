"use client";
import { Button, ButtonProps } from '@/components/ui/button'
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { Loader2, LogOut } from 'lucide-react'
import { ReactNode } from 'react'

type Props = {
  loadingContent: ReactNode
  disabled?: boolean;
} & ButtonProps


export function GoogleSignInButton({ loadingContent, disabled, ...props }: Props) {
  
  const handleClick = () => {
    if (!disabled) {
      signIn("google");
    }
  };

  return (
    <Button
      disabled={disabled}
      type="submit"
      onClick={handleClick}
      {...props}
    >
      {disabled ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> {loadingContent}
        </>
      ) : (
        <>
          <Image src="/google.png" alt="Google Logo" width={20} height={20} />
          <span className="ml-4">Continue with Google</span>
        </>
      )}
    </Button>
  );
}

export function CredentialsSignInButton() {
  const handleClick = () => {
    signIn();
  };

  return (
    <Button
      onClick={handleClick}>
      <Image src="/apple.png" alt="Apple Logo" width={20} height={20} />
      <span className="ml-4">Continue with Apple</span>
    </Button>
  );
}

export function LogOutButton() {
  const { status } = useSession();
  const handleClick = () => {
    signOut();
  };

  if (status !== "authenticated") {
    return null; // Return nothing if the user is not authenticated
  }

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      size="icon"
      className="text-primary">
      <LogOut className="h-4 w-4" />
      <span className="sr-only">Logout</span>
    </Button>
  );
}