'use client'


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button, ButtonProps } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'
import { Save } from 'lucide-react'
import { trpc } from '@/trpc/client'
import { useState, useEffect } from 'react'

type CurrencyProps = {
    userEmail: string
    currency: string
    onCurrencyUpdate: (newCurrency: string) => void
  }

export function Currency ({userEmail, currency, onCurrencyUpdate }: CurrencyProps) {
    const { mutateAsync } = trpc.dashboard.updateUserCurrency.useMutation()
    const [currencyValue, setCurrencyValue] = useState(currency)
    const [isSaving, setIsSaving] = useState(false)
    const t = useTranslations('Dashboard')
    
    useEffect(() => {
      setCurrencyValue(currency)
      }, [currency])

    const updateUserCurrency = async () => {
        if (!currencyValue.trim()) return
        setIsSaving(true)
    
        try {
            const response = await mutateAsync({ email: userEmail, currency: currencyValue })
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
            <CardContent className="grid sm:grid-cols-3 gap-6">
                <div className="flex-1 col-span-2">
                  <Input className="flex-1 col-span-2" 
                    value={currencyValue}
                    onChange={(e) => setCurrencyValue(e.target.value)}
                    placeholder={t('Currency.CurrencyField.placeholder')} />
                  <span className="text-sm text-gray-500">{t('Currency.CurrencyField.description')}</span>
                </div>
              <Button onClick={updateUserCurrency} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />{' '}
                {t(isSaving ? 'Currency.CurrencyField.saving' : 'Currency.CurrencyField.save')}
              </Button>
            </CardContent>
    </Card>
)}