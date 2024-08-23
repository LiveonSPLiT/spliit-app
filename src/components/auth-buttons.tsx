'use client'
import {
  clearLocalStorageData,
  migrateLocalStorageData,
} from '@/app/groups/recent-groups-helpers'
import { Button, ButtonProps } from '@/components/ui/button'
import { Loader2, LogOut } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { ReactNode } from 'react'

type SignInProps = {
  loadingContent: ReactNode
  disabled?: boolean
  loginType: string
} & ButtonProps

export function SignInButton({
  children,
  loadingContent,
  disabled,
  loginType,
  ...props
}: SignInProps) {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/groups'

  const handleClick = () => {
    if (!disabled) {
      migrateLocalStorageData()
      signIn(loginType, { callbackUrl })
    }
  }

  return (
    <Button disabled={disabled} type="submit" onClick={handleClick} {...props}>
      {disabled ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> {loadingContent}
        </>
      ) : (
        children
      )}
    </Button>
  )
}

export function LogOutButton() {
  const { status } = useSession()
  const handleClick = () => {
    clearLocalStorageData()
    signOut({ callbackUrl: '/' }) // Redirects to the homepage after logging out
  }

  if (status !== 'authenticated') {
    return null // Return nothing if the user is not authenticated
  }

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      size="icon"
      className="text-primary"
    >
      <LogOut className="h-4 w-4" />
      <span className="sr-only">Logout</span>
    </Button>
  )
}
