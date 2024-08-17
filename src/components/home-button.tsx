"use client";

import { useSession } from "next-auth/react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SignInButton } from "@/components/auth-buttons";
import { useState, useEffect } from 'react';
import Image from "next/image";
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'

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

  if (!isPageLoaded || status === "loading") {
      return (<div className="flex gap-2"><Loader2 className="w-6 h-6 mr-2 animate-spin" /></div>); // Show spinner while page or session is loading
  }

  if (status === "authenticated") {
      return (
        <div className="flex gap-2">
          <Button asChild>
              <Link href="/groups">Go to groups</Link>
          </Button>
          </div>
      );
  }

  return (
    <div className="flex gap-2">
      {/* <SignInButton
          loadingContent="Apple"
          disabled={!isPageLoaded}
          loginType="google"
      >
          <Image src="/apple.png" alt="Apple Logo" width={20} height={20} />
          <span className="ml-4">Apple</span>
      </SignInButton> */}
      <SignInButton
          loadingContent="Google"
          disabled={!isPageLoaded}
          loginType="google"
          variant="secondary"
      >
          <Image src="/google.png" alt="Google Logo" width={20} height={20} />
          <span className="ml-4">Google</span>
      </SignInButton>
      </div>
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