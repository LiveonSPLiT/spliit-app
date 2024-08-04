import { useToast } from '@/components/ui/use-toast'
import { ExpenseFormValues } from '@/lib/schemas'
import { LocateFixed, MapPinOff } from 'lucide-react'
import { AsyncButton } from './async-button'
import { Map } from './map'
import { Button } from './ui/button'
import { useTranslations } from 'next-intl'

type Props = {
  location: ExpenseFormValues['location']
  updateLocation: (location: ExpenseFormValues['location']) => void
}

export function ExpenseLocationInput({ location, updateLocation }: Props) {
  const { toast } = useToast()
  const t = useTranslations('ExpenseForm')

  async function getCoordinates(): Promise<GeolocationPosition> {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
  }

  async function setCoordinates(): Promise<undefined> {
    try {
      const { latitude, longitude } = (await getCoordinates()).coords
      updateLocation({ latitude, longitude })
    } catch (error) {
      console.error(error)
      toast({
        title: t('locationField.toast.title'),
        description: t('locationField.toast.description'),
        variant: 'destructive',
      })
    }
  }

  function unsetCoordinates() {
    updateLocation(null)
  }

  return (
    <>
      <Map location={location} updateLocation={updateLocation} />
      <div className="flex gap-2">
        <AsyncButton
          type="button"
          variant="secondary"
          loadingContent="Getting location…"
          action={setCoordinates}
        >
          <LocateFixed className="w-4 h-4 mr-2" />
          {t('locationField.buttonLabel')}
        </AsyncButton>
        {location && (
          <Button
            size="default"
            variant="outline"
            type="button"
            onClick={unsetCoordinates}
          >
            <MapPinOff className="w-4 h-4 mr-2" />
            {t('locationField.removeButtonLabel')}
          </Button>
        )}
      </div>
    </>
  )
}
