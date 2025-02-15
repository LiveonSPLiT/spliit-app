import { AppRouterOutput } from '@/trpc/routers/_app'
import { PropsWithChildren, createContext, useContext } from 'react'

type Group = NonNullable<AppRouterOutput['groups']['get']['group']>

type GroupContext =
  | { isLoading: false; groupId: string; group: Group }
  | { isLoading: true; groupId: string; group: undefined }

const CurrentFriendContext = createContext<GroupContext | null>(null)

export const useCurrentGroup = () => {
  const context = useContext(CurrentFriendContext)
  if (!context)
    throw new Error(
      'Missing context. Should be called inside a CurrentGroupProvider.',
    )
  return context
}

export const CurrentGroupProvider = ({
  children,
  ...props
}: PropsWithChildren<GroupContext>) => {
  return (
    <CurrentFriendContext.Provider value={props}>
      {children}
    </CurrentFriendContext.Provider>
  )
}
