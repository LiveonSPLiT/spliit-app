"use client";

import { useSession } from "next-auth/react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SignInButton } from "@/components/auth-buttons";
import { useState, useEffect } from 'react';
import Image from "next/image";
import { useTranslations } from 'next-intl'

export function HomeButton() {
    const { data: session, status } = useSession();
    const [isPageLoaded, setIsPageLoaded] = useState(false);
  
    useEffect(() => {
      const handlePageLoad = () => {
        setIsPageLoaded(true);
      };
  
      if (document.readyState === "complete") {
        handlePageLoad();
      } else {
        window.addEventListener("load", handlePageLoad);
      }
  
      return () => {
        window.removeEventListener("load", handlePageLoad);
      };
    }, []);
  
    if (status === "authenticated") {
      return (
        <Button asChild>
          <Link href="/groups">Go to groups</Link>
        </Button>
      );
    }
  
    return (
      <SignInButton 
      loadingContent="Continue with Google"
      disabled={!isPageLoaded} loginType="google">
        <Image src="/google.png" alt="Google Logo" width={20} height={20} />
        <span className="ml-4">Continue with Google</span>
      </SignInButton>
    );
}

export function NavGroupButton() {
  const t = useTranslations()
  const { status } = useSession();

  if (status !== "authenticated") {
    return null; // Return nothing if the user is not authenticated
  }

  return (
    <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="-my-3 text-primary"
                >
                <Link href="/groups">{t('Header.groups')}</Link>
              </Button>
  );
}