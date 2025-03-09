import { z } from 'zod'

export const recentFriendsSchema = z.array(
  z.object({
    id: z.string().min(1),
    name: z.string(),
  }),
)

export const starredFriendsSchema = z.array(z.string())
export const blockedFriendsSchema = z.array(z.string())

export type RecentFriends = z.infer<typeof recentFriendsSchema>
export type RecentFriend = RecentFriends[number]

const STORAGE_KEY = 'recentFriends'
const STARRED_FRIENDS_STORAGE_KEY = 'starredFriends'
const BLOCKED_FRIENDS_STORAGE_KEY = 'blockedFriends'
const MIGRATE_STORAGE_KEY = 'migrateRecentFriends'
const MIGRATE_STARRED_FRIENDS_STORAGE_KEY = 'migrateStarredFriends'
const MIGRATE_BLOCKED_FRIENDS_STORAGE_KEY = 'migrateBlockedFriends'

export function clearLocalStorageDataFriend() {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(STARRED_FRIENDS_STORAGE_KEY)
  localStorage.removeItem(BLOCKED_FRIENDS_STORAGE_KEY)
}

export function migrateLocalStorageDataFriend() {
  if (localStorage.getItem(STORAGE_KEY))
    localStorage.setItem(
      MIGRATE_STORAGE_KEY,
      JSON.stringify(getRecentFriendsLocalStorage()),
    )

  if (localStorage.getItem(STARRED_FRIENDS_STORAGE_KEY))
    localStorage.setItem(
      MIGRATE_STARRED_FRIENDS_STORAGE_KEY,
      JSON.stringify(getStarredFriendsLocalStorage()),
    )

  if (localStorage.getItem(BLOCKED_FRIENDS_STORAGE_KEY))
    localStorage.setItem(
      MIGRATE_BLOCKED_FRIENDS_STORAGE_KEY,
      JSON.stringify(getBlockedFriendsLocalStorage()),
    )
  clearLocalStorageDataFriend()
}

export async function getRecentFriends() {
  const groupsInMigratedJson = localStorage.getItem(MIGRATE_STORAGE_KEY)
  if (groupsInMigratedJson) {
    const recentFriends = JSON.parse(groupsInMigratedJson) as RecentFriend[]
    recentFriends.forEach((group) => {
      saveRecentFriend(group)
    })
    localStorage.removeItem(MIGRATE_STORAGE_KEY)
  }

  const groupsInStorageJson = localStorage.getItem(STORAGE_KEY)
  const groupsInStorageRaw = groupsInStorageJson
    ? JSON.parse(groupsInStorageJson)
    : []
  const parseResult = recentFriendsSchema.safeParse(groupsInStorageRaw)
  if (groupsInStorageJson) {
    return parseResult.success ? parseResult.data : []
  }

  let response = await fetch('/api/friends?type=recent')
  let recentFriends = await response.json()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recentFriends))

  const parseResultDB = recentFriendsSchema.safeParse(recentFriends)
  return parseResultDB.success ? parseResultDB.data : []
}

export function getRecentFriendsLocalStorage() {
  const groupsInStorageJson = localStorage.getItem(STORAGE_KEY)
  const groupsInStorageRaw = groupsInStorageJson
    ? JSON.parse(groupsInStorageJson)
    : []
  const parseResult = recentFriendsSchema.safeParse(groupsInStorageRaw)
  return parseResult.success ? parseResult.data : []
}

export function saveRecentFriend(group: RecentFriend) {
  const recentFriends = getRecentFriendsLocalStorage()
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([
      group,
      ...recentFriends.filter((rg) => rg.id !== group.id),
    ]),
  )

  // Saving a recent group
  fetch('/api/friends', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'saveRecent',
      group: { id: group.id, name: group.name },
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data
    })
    .catch((error) => console.error('Error saving group:', error))
}

export function deleteRecentFriend(group: RecentFriend) {
  const recentFriends = getRecentFriendsLocalStorage()
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(recentFriends.filter((rg) => rg.id !== group.id)),
  )

  // Deleting a recent group
  fetch(`/api/friends?type=deleteRecent&groupId=${group.id}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => {
      return data
    })
    .catch((error) => console.error('Error deleting group:', error))
}

export async function getStarredFriends() {
  const groupsInMigratedJson = localStorage.getItem(
    MIGRATE_STARRED_FRIENDS_STORAGE_KEY,
  )
  if (groupsInMigratedJson) {
    const starredFriends = JSON.parse(groupsInMigratedJson) as string[]
    starredFriends.forEach((groupId) => {
      starFriend(groupId)
    })
    localStorage.removeItem(MIGRATE_STARRED_FRIENDS_STORAGE_KEY)
  }

  const starredFriendsJson = localStorage.getItem(STARRED_FRIENDS_STORAGE_KEY)
  const starredFriendsRaw = starredFriendsJson
    ? JSON.parse(starredFriendsJson)
    : []
  const parseResult = starredFriendsSchema.safeParse(starredFriendsRaw)
  if (starredFriendsJson) {
    return parseResult.success ? parseResult.data : []
  }

  // Fetching starred friends
  let response = await fetch('/api/friends?type=starred')
  let starredFriends = await response.json()
  localStorage.setItem(
    STARRED_FRIENDS_STORAGE_KEY,
    JSON.stringify(starredFriends),
  )

  const parseResultDB = starredFriendsSchema.safeParse(starredFriends)
  return parseResultDB.success ? parseResultDB.data : []
}

export function getStarredFriendsLocalStorage() {
  const starredFriendsJson = localStorage.getItem(STARRED_FRIENDS_STORAGE_KEY)
  const starredFriendsRaw = starredFriendsJson
    ? JSON.parse(starredFriendsJson)
    : []
  const parseResult = starredFriendsSchema.safeParse(starredFriendsRaw)
  return parseResult.success ? parseResult.data : []
}

export function starFriend(groupId: string) {
  const starredFriends = getStarredFriendsLocalStorage()
  localStorage.setItem(
    STARRED_FRIENDS_STORAGE_KEY,
    JSON.stringify([...starredFriends, groupId]),
  )

  // Starring a group
  fetch('/api/friends', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'star', groupId: groupId }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data
    })
    .catch((error) => console.error('Error starring group:', error))
}

export function unstarFriend(groupId: string) {
  const starredFriends = getStarredFriendsLocalStorage()
  localStorage.setItem(
    STARRED_FRIENDS_STORAGE_KEY,
    JSON.stringify(starredFriends.filter((g) => g !== groupId)),
  )

  // Unstarring a group
  fetch(`/api/friends?type=unstar&groupId=${groupId}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => {
      return data
    })
    .catch((error) => console.error('Error unstarring group:', error))
}

export async function getBlockedFriends() {
  const groupsInMigratedJson = localStorage.getItem(
    MIGRATE_BLOCKED_FRIENDS_STORAGE_KEY,
  )
  if (groupsInMigratedJson) {
    const blockedFriends = JSON.parse(groupsInMigratedJson) as string[]
    blockedFriends.forEach((groupId) => {
      blockFriend(groupId)
    })
    localStorage.removeItem(MIGRATE_BLOCKED_FRIENDS_STORAGE_KEY)
  }

  const blockedFriendsJson = localStorage.getItem(BLOCKED_FRIENDS_STORAGE_KEY)
  const blockedFriendsRaw = blockedFriendsJson
    ? JSON.parse(blockedFriendsJson)
    : []
  const parseResult = blockedFriendsSchema.safeParse(blockedFriendsRaw)
  if (blockedFriendsJson) {
    return parseResult.success ? parseResult.data : []
  }

  // Fetching blocked friends
  let response = await fetch('/api/friends?type=blocked')
  let blockedFriends = await response.json()
  localStorage.setItem(
    BLOCKED_FRIENDS_STORAGE_KEY,
    JSON.stringify(blockedFriends),
  )

  const parseResultDB = blockedFriendsSchema.safeParse(blockedFriends)
  return parseResultDB.success ? parseResultDB.data : []
}

export function getBlockedFriendsLocalStorage() {
  const blockedFriendsJson = localStorage.getItem(BLOCKED_FRIENDS_STORAGE_KEY)
  const blockedFriendsRaw = blockedFriendsJson
    ? JSON.parse(blockedFriendsJson)
    : []
  const parseResult = blockedFriendsSchema.safeParse(blockedFriendsRaw)
  return parseResult.success ? parseResult.data : []
}

export function blockFriend(groupId: string) {
  const blockedFriends = getBlockedFriendsLocalStorage()
  localStorage.setItem(
    BLOCKED_FRIENDS_STORAGE_KEY,
    JSON.stringify([...blockedFriends, groupId]),
  )

  // blocking a friend
  fetch('/api/friends', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'block', groupId: groupId }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data
    })
    .catch((error) => console.error('Error blocking group:', error))
}

export function unBlockFriend(groupId: string) {
  const blockedFriends = getBlockedFriendsLocalStorage()
  localStorage.setItem(
    BLOCKED_FRIENDS_STORAGE_KEY,
    JSON.stringify(blockedFriends.filter((g) => g !== groupId)),
  )

  // Unblocking a group
  fetch(`/api/friends?type=unblock&groupId=${groupId}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => {
      return data
    })
    .catch((error) => console.error('Error unblocking group:', error))
}
