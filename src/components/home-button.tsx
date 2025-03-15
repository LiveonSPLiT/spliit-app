'use client'

import { SignInButton } from '@/components/auth-buttons'
import { NewsButton } from '@/components/news-button'
import { Button } from '@/components/ui/button'
import { Contact, LayoutDashboard, Loader2, Users } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function HomeButton() {
  const t = useTranslations('Dashboard')
  const { data: session, status } = useSession()
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  useEffect(() => {
    const handlePageLoad = () => {
      setIsPageLoaded(true)
    }

    if (document.readyState === 'complete') {
      handlePageLoad()
    } else {
      window.addEventListener('load', handlePageLoad)
    }

    return () => {
      window.removeEventListener('load', handlePageLoad)
    }
  }, [])

  if (!isPageLoaded || status === 'loading') {
    return (
      <div className="flex gap-2">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
      </div>
    ) // Show spinner while page or session is loading
  }

  if (status === 'authenticated') {
    return (
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            {t('title')}
          </Link>
        </Button>
      </div>
    )
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
  )
}

export function NavGroupButton() {
  const t = useTranslations()
  const { status } = useSession()

  if (status !== 'authenticated') {
    return null // Return nothing if the user is not authenticated
  }

  return (
    <Button variant="ghost" size="icon" className="text-primary">
      <Link href="/groups">
        <Users className="h-4 w-4" />
        <span className="sr-only">{t('Header.groups')}</span>
      </Link>
    </Button>
  )
}

export function NavFriendButton() {
  const t = useTranslations()
  const { status } = useSession()

  if (status !== 'authenticated') {
    return null // Return nothing if the user is not authenticated
  }

  return (
    <Button variant="ghost" size="icon" className="text-primary">
      <Link href="/friends">
        <Contact className="h-4 w-4" />
      </Link>
    </Button>
  )
}

export function NavNewsButton() {
  const { status } = useSession()

  if (status !== 'authenticated') {
    return <NewsButton />
  }

  return null // Hide news button if the user is authenticated
}
