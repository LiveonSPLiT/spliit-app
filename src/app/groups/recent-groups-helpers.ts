import { z } from 'zod'

export const recentGroupsSchema = z.array(
  z.object({
    id: z.string().min(1),
    name: z.string(),
  }),
)

export const starredGroupsSchema = z.array(z.string())
export const archivedGroupsSchema = z.array(z.string())

export type RecentGroups = z.infer<typeof recentGroupsSchema>
export type RecentGroup = RecentGroups[number]

const STORAGE_KEY = 'recentGroups'
const STARRED_GROUPS_STORAGE_KEY = 'starredGroups'
const ARCHIVED_GROUPS_STORAGE_KEY = 'archivedGroups'
const MIGRATE_STORAGE_KEY = 'migrateRecentGroups'
const MIGRATE_STARRED_GROUPS_STORAGE_KEY = 'migrateStarredGroups'
const MIGRATE_ARCHIVED_GROUPS_STORAGE_KEY = 'migrateArchivedGroups'

export function clearLocalStorageData() {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(STARRED_GROUPS_STORAGE_KEY)
  localStorage.removeItem(ARCHIVED_GROUPS_STORAGE_KEY)
}

export function migrateLocalStorageData() {
  if (localStorage.getItem(STORAGE_KEY))
    localStorage.setItem(
      MIGRATE_STORAGE_KEY,
      JSON.stringify(getRecentGroupsLocalStorage()),
    )

  if (localStorage.getItem(STARRED_GROUPS_STORAGE_KEY))
    localStorage.setItem(
      MIGRATE_STARRED_GROUPS_STORAGE_KEY,
      JSON.stringify(getStarredGroupsLocalStorage()),
    )

  if (localStorage.getItem(ARCHIVED_GROUPS_STORAGE_KEY))
    localStorage.setItem(
      MIGRATE_ARCHIVED_GROUPS_STORAGE_KEY,
      JSON.stringify(getArchivedGroupsLocalStorage()),
    )
  clearLocalStorageData()
}

export async function getRecentGroups() {
  const groupsInMigratedJson = localStorage.getItem(MIGRATE_STORAGE_KEY)
  if (groupsInMigratedJson) {
    const recentGroups = JSON.parse(groupsInMigratedJson) as RecentGroup[]
    recentGroups.forEach((group) => {
      saveRecentGroup(group)
    })
    localStorage.removeItem(MIGRATE_STORAGE_KEY)
  }

  const groupsInStorageJson = localStorage.getItem(STORAGE_KEY)
  const groupsInStorageRaw = groupsInStorageJson
    ? JSON.parse(groupsInStorageJson)
    : []
  const parseResult = recentGroupsSchema.safeParse(groupsInStorageRaw)
  if (groupsInStorageJson) {
    return parseResult.success ? parseResult.data : []
  }

  let response = await fetch('/api/groups?type=recent')
  let recentGroups = await response.json()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recentGroups))

  const parseResultDB = recentGroupsSchema.safeParse(recentGroups)
  return parseResultDB.success ? parseResultDB.data : []
}

export function getRecentGroupsLocalStorage() {
  const groupsInStorageJson = localStorage.getItem(STORAGE_KEY)
  const groupsInStorageRaw = groupsInStorageJson
    ? JSON.parse(groupsInStorageJson)
    : []
  const parseResult = recentGroupsSchema.safeParse(groupsInStorageRaw)
  return parseResult.success ? parseResult.data : []
}

export function saveRecentGroup(group: RecentGroup) {
  const recentGroups = getRecentGroupsLocalStorage()
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([group, ...recentGroups.filter((rg) => rg.id !== group.id)]),
  )

  // Saving a recent group
  fetch('/api/groups', {
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

export function deleteRecentGroup(group: RecentGroup) {
  const recentGroups = getRecentGroupsLocalStorage()
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(recentGroups.filter((rg) => rg.id !== group.id)),
  )

  // Deleting a recent group
  fetch(`/api/groups?type=deleteRecent&groupId=${group.id}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => {
      return data
    })
    .catch((error) => console.error('Error deleting group:', error))
}

export async function getStarredGroups() {
  const groupsInMigratedJson = localStorage.getItem(
    MIGRATE_STARRED_GROUPS_STORAGE_KEY,
  )
  if (groupsInMigratedJson) {
    const starredGroups = JSON.parse(groupsInMigratedJson) as string[]
    starredGroups.forEach((groupId) => {
      starGroup(groupId)
    })
    localStorage.removeItem(MIGRATE_STARRED_GROUPS_STORAGE_KEY)
  }

  const starredGroupsJson = localStorage.getItem(STARRED_GROUPS_STORAGE_KEY)
  const starredGroupsRaw = starredGroupsJson
    ? JSON.parse(starredGroupsJson)
    : []
  const parseResult = starredGroupsSchema.safeParse(starredGroupsRaw)
  if (starredGroupsJson) {
    return parseResult.success ? parseResult.data : []
  }

  // Fetching starred groups
  let response = await fetch('/api/groups?type=starred')
  let starredGroups = await response.json()
  localStorage.setItem(
    STARRED_GROUPS_STORAGE_KEY,
    JSON.stringify(starredGroups),
  )

  const parseResultDB = starredGroupsSchema.safeParse(starredGroups)
  return parseResultDB.success ? parseResultDB.data : []
}

export function getStarredGroupsLocalStorage() {
  const starredGroupsJson = localStorage.getItem(STARRED_GROUPS_STORAGE_KEY)
  const starredGroupsRaw = starredGroupsJson
    ? JSON.parse(starredGroupsJson)
    : []
  const parseResult = starredGroupsSchema.safeParse(starredGroupsRaw)
  return parseResult.success ? parseResult.data : []
}

export function starGroup(groupId: string) {
  const starredGroups = getStarredGroupsLocalStorage()
  localStorage.setItem(
    STARRED_GROUPS_STORAGE_KEY,
    JSON.stringify([...starredGroups, groupId]),
  )

  // Starring a group
  fetch('/api/groups', {
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

export function unstarGroup(groupId: string) {
  const starredGroups = getStarredGroupsLocalStorage()
  localStorage.setItem(
    STARRED_GROUPS_STORAGE_KEY,
    JSON.stringify(starredGroups.filter((g) => g !== groupId)),
  )

  // Unstarring a group
  fetch(`/api/groups?type=unstar&groupId=${groupId}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => {
      return data
    })
    .catch((error) => console.error('Error unstarring group:', error))
}

export async function getArchivedGroups() {
  const groupsInMigratedJson = localStorage.getItem(
    MIGRATE_ARCHIVED_GROUPS_STORAGE_KEY,
  )
  if (groupsInMigratedJson) {
    const archivedGroups = JSON.parse(groupsInMigratedJson) as string[]
    archivedGroups.forEach((groupId) => {
      archiveGroup(groupId)
    })
    localStorage.removeItem(MIGRATE_ARCHIVED_GROUPS_STORAGE_KEY)
  }

  const archivedGroupsJson = localStorage.getItem(ARCHIVED_GROUPS_STORAGE_KEY)
  const archivedGroupsRaw = archivedGroupsJson
    ? JSON.parse(archivedGroupsJson)
    : []
  const parseResult = archivedGroupsSchema.safeParse(archivedGroupsRaw)
  if (archivedGroupsJson) {
    return parseResult.success ? parseResult.data : []
  }

  // Fetching archived groups
  let response = await fetch('/api/groups?type=archived')
  let archivedGroups = await response.json()
  localStorage.setItem(
    ARCHIVED_GROUPS_STORAGE_KEY,
    JSON.stringify(archivedGroups),
  )

  const parseResultDB = archivedGroupsSchema.safeParse(archivedGroups)
  return parseResultDB.success ? parseResultDB.data : []
}

export function getArchivedGroupsLocalStorage() {
  const archivedGroupsJson = localStorage.getItem(ARCHIVED_GROUPS_STORAGE_KEY)
  const archivedGroupsRaw = archivedGroupsJson
    ? JSON.parse(archivedGroupsJson)
    : []
  const parseResult = archivedGroupsSchema.safeParse(archivedGroupsRaw)
  return parseResult.success ? parseResult.data : []
}

export function archiveGroup(groupId: string) {
  const archivedGroups = getArchivedGroupsLocalStorage()
  localStorage.setItem(
    ARCHIVED_GROUPS_STORAGE_KEY,
    JSON.stringify([...archivedGroups, groupId]),
  )

  // Archiving a group
  fetch('/api/groups', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'archive', groupId: groupId }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data
    })
    .catch((error) => console.error('Error archiving group:', error))
}

export function unarchiveGroup(groupId: string) {
  const archivedGroups = getArchivedGroupsLocalStorage()
  localStorage.setItem(
    ARCHIVED_GROUPS_STORAGE_KEY,
    JSON.stringify(archivedGroups.filter((g) => g !== groupId)),
  )

  // Unarchiving a group
  fetch(`/api/groups?type=unarchive&groupId=${groupId}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => {
      return data
    })
    .catch((error) => console.error('Error unarchiving group:', error))
}
