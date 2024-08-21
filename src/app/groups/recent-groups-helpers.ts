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

export function clearLocalStorageData(){
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(STARRED_GROUPS_STORAGE_KEY)
  localStorage.removeItem(ARCHIVED_GROUPS_STORAGE_KEY)
}

export async function getRecentGroups() {

  const groupsInStorageJson = localStorage.getItem(STORAGE_KEY)
  const groupsInStorageRaw = groupsInStorageJson
    ? JSON.parse(groupsInStorageJson)
    : []
  const parseResult = recentGroupsSchema.safeParse(groupsInStorageRaw)
  if (groupsInStorageJson){
    return parseResult.success ? parseResult.data : []
  }

  let response = await fetch('/api/groups?type=recent');
  let recentGroups = await response.json();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recentGroups));

 const parseResultDB = recentGroupsSchema.safeParse(recentGroups)
 return parseResultDB.success ? parseResultDB.data : []
}

function getRecentGroupsLocalStorage(){
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
    body: JSON.stringify({ type: 'saveRecent', group: { id: group.id, name: group.name } }),
  })
    .then((response) => response.json())
    .then((data) => {return data})
    .catch((error) => console.error('Error saving group:', error));

  
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
    .then((data) => {return data})
    .catch((error) => console.error('Error deleting group:', error));

}

export function getStarredGroups() {

  const starredGroupsJson = localStorage.getItem(STARRED_GROUPS_STORAGE_KEY)
  const starredGroupsRaw = starredGroupsJson
    ? JSON.parse(starredGroupsJson)
    : []
  const parseResult = starredGroupsSchema.safeParse(starredGroupsRaw)
  if (starredGroupsJson){
    return parseResult.success ? parseResult.data : []
  }

  // Fetching starred groups
  let starredGroupsRawDB = fetch('/api/groups?type=starred')
  .then((response) => response.json())
  .then((starredGroups) => {
    localStorage.setItem(STARRED_GROUPS_STORAGE_KEY, JSON.stringify(starredGroups));
    return starredGroups
  })
  .catch((error) => console.error('Error fetching starred groups:', error));

  const parseResultDB = starredGroupsSchema.safeParse(starredGroupsRawDB)
  return parseResultDB.success ? parseResultDB.data : []
  
}

export function starGroup(groupId: string) {

  const starredGroups = getStarredGroups()
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
    .then((data) => {return data})
    .catch((error) => console.error('Error starring group:', error));

}

export function unstarGroup(groupId: string) {

  const starredGroups = getStarredGroups()
  localStorage.setItem(
    STARRED_GROUPS_STORAGE_KEY,
    JSON.stringify(starredGroups.filter((g) => g !== groupId)),
  )

  // Unstarring a group
  fetch(`/api/groups?type=unstar&groupId=${groupId}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => {return data})
    .catch((error) => console.error('Error unstarring group:', error));

}

export function getArchivedGroups() {

  const archivedGroupsJson = localStorage.getItem(ARCHIVED_GROUPS_STORAGE_KEY)
  const archivedGroupsRaw = archivedGroupsJson
    ? JSON.parse(archivedGroupsJson)
    : []
  const parseResult = archivedGroupsSchema.safeParse(archivedGroupsRaw)
  if (archivedGroupsJson){
    return parseResult.success ? parseResult.data : []
  }

  // Fetching archived groups
  let archivedGroupsRawDB = fetch('/api/groups?type=archived')
  .then((response) => response.json())
  .then((archivedGroups) => {
    localStorage.setItem(ARCHIVED_GROUPS_STORAGE_KEY, JSON.stringify(archivedGroups));
    return archivedGroups
  })
  .catch((error) => console.error('Error fetching archived groups:', error));

  const parseResultDB = archivedGroupsSchema.safeParse(archivedGroupsRawDB)
  return parseResultDB.success ? parseResultDB.data : []
  
}

export function archiveGroup(groupId: string) {

  const archivedGroups = getArchivedGroups()
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
    .then((data) => {return data})
    .catch((error) => console.error('Error archiving group:', error));

}

export function unarchiveGroup(groupId: string) {

  const archivedGroups = getArchivedGroups()
  localStorage.setItem(
    ARCHIVED_GROUPS_STORAGE_KEY,
    JSON.stringify(archivedGroups.filter((g) => g !== groupId)),
  )

  // Unarchiving a group
  fetch(`/api/groups?type=unarchive&groupId=${groupId}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => {return data})
    .catch((error) => console.error('Error unarchiving group:', error));

}
