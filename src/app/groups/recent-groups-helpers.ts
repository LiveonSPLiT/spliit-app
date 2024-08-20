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

export function getRecentGroups() {

  // Fetching recent groups
fetch('/api/groups?type=recent')
  .then((response) => response.json())
  .then((recentGroups) => console.log('Fetched recent groups:', recentGroups))
  .catch((error) => console.error('Error fetching recent groups:', error));


  const groupsInStorageJson = localStorage.getItem(STORAGE_KEY)
  const groupsInStorageRaw = groupsInStorageJson
    ? JSON.parse(groupsInStorageJson)
    : []
  const parseResult = recentGroupsSchema.safeParse(groupsInStorageRaw)
  return parseResult.success ? parseResult.data : []
}

export function saveRecentGroup(group: RecentGroup) {

  // Saving a recent group
fetch('/api/groups', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'saveRecent', group: { id: group.id, name: group.name } }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error('Error saving group:', error));

  const recentGroups = getRecentGroups()
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([group, ...recentGroups.filter((rg) => rg.id !== group.id)]),
  )
}

export function deleteRecentGroup(group: RecentGroup) {

  // Deleting a recent group
fetch(`/api/groups?type=deleteRecent&groupId=${group.id}`, {
  method: 'DELETE',
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error('Error deleting group:', error));

  const recentGroups = getRecentGroups()
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(recentGroups.filter((rg) => rg.id !== group.id)),
  )
}

export function getStarredGroups() {

  // Fetching starred groups
fetch('/api/groups?type=starred')
.then((response) => response.json())
.then((starredGroups) => console.log('Fetched starred groups:', starredGroups))
.catch((error) => console.error('Error fetching starred groups:', error));

  const starredGroupsJson = localStorage.getItem(STARRED_GROUPS_STORAGE_KEY)
  const starredGroupsRaw = starredGroupsJson
    ? JSON.parse(starredGroupsJson)
    : []
  const parseResult = starredGroupsSchema.safeParse(starredGroupsRaw)
  return parseResult.success ? parseResult.data : []
}

export function starGroup(groupId: string) {

  // Starring a group
fetch('/api/groups', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'star', groupId: groupId }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error('Error starring group:', error));

  const starredGroups = getStarredGroups()
  localStorage.setItem(
    STARRED_GROUPS_STORAGE_KEY,
    JSON.stringify([...starredGroups, groupId]),
  )
}

export function unstarGroup(groupId: string) {

  // Unstarring a group
fetch(`/api/groups?type=unstar&groupId=${groupId}`, {
  method: 'DELETE',
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error('Error unstarring group:', error));



  const starredGroups = getStarredGroups()
  localStorage.setItem(
    STARRED_GROUPS_STORAGE_KEY,
    JSON.stringify(starredGroups.filter((g) => g !== groupId)),
  )
}

export function getArchivedGroups() {

  // Fetching archived groups
fetch('/api/groups?type=archived')
.then((response) => response.json())
.then((archivedGroups) => console.log('Fetched archived groups:', archivedGroups))
.catch((error) => console.error('Error fetching archived groups:', error));

  const archivedGroupsJson = localStorage.getItem(ARCHIVED_GROUPS_STORAGE_KEY)
  const archivedGroupsRaw = archivedGroupsJson
    ? JSON.parse(archivedGroupsJson)
    : []
  const parseResult = archivedGroupsSchema.safeParse(archivedGroupsRaw)
  return parseResult.success ? parseResult.data : []
}

export function archiveGroup(groupId: string) {

  // Archiving a group
fetch('/api/groups', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'archive', groupId: groupId }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error('Error archiving group:', error));

  const archivedGroups = getArchivedGroups()
  localStorage.setItem(
    ARCHIVED_GROUPS_STORAGE_KEY,
    JSON.stringify([...archivedGroups, groupId]),
  )
}

export function unarchiveGroup(groupId: string) {

  // Unarchiving a group
fetch(`/api/groups?type=unarchive&groupId=${groupId}`, {
  method: 'DELETE',
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error('Error unarchiving group:', error));

  const archivedGroups = getArchivedGroups()
  localStorage.setItem(
    ARCHIVED_GROUPS_STORAGE_KEY,
    JSON.stringify(archivedGroups.filter((g) => g !== groupId)),
  )
}
