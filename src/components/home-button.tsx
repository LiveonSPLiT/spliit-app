"use client";

import { useSession } from "next-auth/react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GoogleSignInButton } from "@/components/auth-buttons";
import { useState, useEffect } from 'react';

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
      <GoogleSignInButton 
      loadingContent="Continue with Google"
      disabled={!isPageLoaded} />
    );
}
