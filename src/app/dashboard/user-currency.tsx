'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { trpc } from '@/trpc/client'
import { Save } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { subscribeUser } from '@/lib/pushNotification'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { set } from 'date-fns'

type CurrencyProps = {
  userEmail: string
  currency: string
  notificationPrefre: string
  loading: boolean
  onCurrencyUpdate: (newCurrency: string) => void
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
 
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
 
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function Currency({
  userEmail,
  currency,
  notificationPrefre,
  loading,
  onCurrencyUpdate,
}: CurrencyProps) {
  const { mutateAsync } = trpc.dashboard.updateUserCurrency.useMutation()
  const [loadingData, setLoadingData] = useState(loading)
  const [currencyValue, setCurrencyValue] = useState(currency)
  const [isSaving, setIsSaving] = useState(false)
  const t = useTranslations('Dashboard')

  const [isSupported, setIsSupported] = useState(false)
  const [notificationPrefrence, setNotificationPrefrence] = useState(notificationPrefre)
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  )

  async function registerServiceWorker() {
    let registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
    let sub = await registration.pushManager.getSubscription()
    registration = await navigator.serviceWorker.ready
    sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
      ),
    })
    setSubscription(sub)
    const serializedSub = JSON.parse(JSON.stringify(sub))
    if(notificationPrefrence !== 'EMAIL') {
      await subscribeUser(serializedSub, userEmail)
    }
  }

  useEffect(() => {
    setCurrencyValue(currency)
    setNotificationPrefrence(notificationPrefre)
  }, [currency, notificationPrefre])

  useEffect(() => {
    setLoadingData(loading)
  }, [loading])

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])

  const updateUserCurrency = async () => {
    if (!currencyValue.trim()) return
    setIsSaving(true)

    try {
      const response = await mutateAsync({
        email: userEmail,
        currency: currencyValue,
        pushSubscription: JSON.parse(JSON.stringify(subscription)),
        notificationPref: notificationPrefrence,
      })
      onCurrencyUpdate(response.currency)
    } catch (error) {
      console.error('Error updating currency:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{t('Currency.title')}</CardTitle>
        <CardDescription>{t('Currency.description')}</CardDescription>
      </CardHeader>

      {loadingData ? (
        <CardContent>
          <Skeleton className="h-8 w-3/4" />
        </CardContent>
      ) : (
        <CardContent className="grid sm:grid-cols-6 gap-4">
          <div className="flex-1 col-start-1 col-end-3">
            <Input
              className="flex-1 col-span-2"
              value={currencyValue}
              onChange={(e) => setCurrencyValue(e.target.value)}
              placeholder={t('Currency.CurrencyField.placeholder')}
            />
            <span className="text-sm text-gray-500">
              {t('Currency.CurrencyField.description')}
            </span>
          </div>
          <div className="flex-1 col-start-3 col-end-5">
          <Select
                              onValueChange={(value) => {
                                setNotificationPrefrence(value)
                              }}
                              defaultValue={notificationPrefrence}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={t(`Currency.NotificationField.selection.both`)} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="BOTH">
                                  {t(`Currency.NotificationField.selection.both`)}
                                </SelectItem>
                                <SelectItem value="PUSH">
                                  {t(`Currency.NotificationField.selection.push`)}
                                </SelectItem>
                                <SelectItem value="EMAIL">
                                  {t(`Currency.NotificationField.selection.email`)}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <span className="text-sm text-gray-500">
              {t('Currency.NotificationField.description')}
            </span>
                            </div>
          <Button
            onClick={updateUserCurrency}
            disabled={isSaving}
            className="col-end-7"
          >
            <Save className="w-4 h-4 mr-2" />{' '}
            {t(
              isSaving
                ? 'Currency.CurrencyField.saving'
                : 'Currency.CurrencyField.save',
            )}
          </Button>
        </CardContent>
      )}
    </Card>
  )
}
