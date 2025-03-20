'use server'
import { env } from '@/lib/env'
import { getEmailsByFriendId } from '@/lib/userFriendsHelper'
import { getEmailsByGroupId, getGroup } from '@/lib/userGroupsHelper'
import { ActivityType } from '@prisma/client'
import { headers } from 'next/headers'
import parser from 'ua-parser-js'

function getClientDeviceInfo() {
  const headerList = headers()
  const userAgent = headerList.get('user-agent') || ''
  const ua = parser(userAgent)

  const browserName = ua.browser.name
  const deviceType = ua.device.type || 'Desktop'
  const deviceName = ua.device.vendor || ua.os.name

  return {
    browserName,
    deviceType,
    deviceName,
  }
}

export async function sendActivityEmails(
  groupId: string,
  activityType: string,
  participantId?: string,
  expenseId?: string,
  expenseName?: string,
) {
  const group = await getGroup(groupId)
  const users =
    group?.type === 'DUAL_MEMBER'
      ? await getEmailsByFriendId(groupId)
      : await getEmailsByGroupId(groupId)
  const groupName = group?.name
  const participant =
    participantId !== null && group !== null
      ? group.participants.find((p) => p.id === participantId)
      : undefined
  const participantName = participant?.name || 'Someone'
  const publicUrl = env.NEXT_PUBLIC_BASE_URL || 'https://liveonsplit.com'

  if (users.length === 0) {
    console.log('No emails found for the provided groupId.')
    return
  }

  // Initialize variables for subject and email message
  let subject = ''
  let message = ''
  let emailButtonHeaderText = ''
  let emailButtonLabel = ''
  let emailButtonLink = ''
  let emailTitle = ''
  let emailButtonFooterText = ''

  // Set subject and message based on the activity type & group type
  if (activityType === ActivityType.UPDATE_GROUP) {
    if (group?.type === 'MULTI_MEMBER') {
      subject = `${participantName} updated the group: ${groupName}`
      message = `${participantName} has made changes to the group "${groupName}". Visit the group for more details.`
      emailTitle = 'Group Update Notification'
      emailButtonHeaderText = 'View Group on SPLiT'
      emailButtonLabel = 'Go to Group'
      emailButtonLink = `${publicUrl}/groups/${groupId}`
      emailButtonFooterText = 'Thank you for being part of the group.'
    } else if (group?.type === 'DUAL_MEMBER') {
      subject = `${participantName} updated your shared expenses: ${groupName}`
      message = `${participantName} has made changes to your shared expenses "${groupName}". Visit the SPLiT for more details.`
      emailTitle = 'Shared Expenses Update Notification'
      emailButtonHeaderText = 'View Shared Expenses on SPLiT'
      emailButtonLabel = 'Go to Shared Expenses'
      emailButtonLink = `${publicUrl}/friends/${groupId}`
      emailButtonFooterText = 'Thank you for sharing expenses.'
    }
  } else if (
    activityType === ActivityType.CREATE_GROUP ||
    activityType === ActivityType.ADD_FRIEND
  ) {
    if (group?.type === 'MULTI_MEMBER') {
      subject = `${participantName} created a new group: ${groupName}`
      message = `${participantName} has created a new group "${groupName}". Click the button below to join or view the group.`
      emailTitle = 'New Group Created'
      emailButtonHeaderText = 'Join Group on SPLiT'
      emailButtonLabel = 'Go to Group'
      emailButtonLink = `${publicUrl}/groups/${groupId}`
      emailButtonFooterText = 'Be part of the new group.'
    } else if (group?.type === 'DUAL_MEMBER') {
      subject = `${participantName} added you on SPLiT`
      message = `${participantName} added you on SPLiT to share expenses". Click the button below to view the shared expenses.`
      emailTitle = 'Welcome to SPLiT'
      emailButtonHeaderText = 'Join to Share Expenses on SPLiT'
      emailButtonLabel = 'Go to Shared Expenses'
      emailButtonLink = `${publicUrl}/friends/${groupId}`
      emailButtonFooterText = 'Thank you for joining SPLiT.'
    }
  } else if (activityType === ActivityType.CREATE_EXPENSE) {
    if (group?.type === 'MULTI_MEMBER') {
      subject = `${participantName} created a new expense: ${expenseName}`
      message = `${participantName} has added a new expense "${expenseName}" in the group "${groupName}". Click the button below to view the expense details.`
      emailTitle = 'New Expense Created'
      emailButtonHeaderText = 'View Expense on SPLiT'
      emailButtonLabel = 'See Expense Details'
      emailButtonLink = `${publicUrl}/groups/${groupId}/expenses/${expenseId}/edit`
      emailButtonFooterText = 'Keep track of your group expenses.'
    } else if (group?.type === 'DUAL_MEMBER') {
      subject = `${participantName} created a new expense: ${expenseName}`
      message = `${participantName} has added a new expense "${expenseName}" in your shared expenses. Click the button below to view the expense details.`
      emailTitle = 'New Expense Created'
      emailButtonHeaderText = 'View Expense on SPLiT'
      emailButtonLabel = 'See Expense Details'
      emailButtonLink = `${publicUrl}/friends/${groupId}/expenses/${expenseId}/edit`
      emailButtonFooterText = 'Keep track of your shared expenses.'
    }
  } else if (activityType === ActivityType.UPDATE_EXPENSE) {
    if (group?.type === 'MULTI_MEMBER') {
      subject = `${participantName} updated the expense: ${expenseName}`
      message = `${participantName} has made changes to the expense "${expenseName}" in the group "${groupName}". Click the button below to see the updates.`
      emailTitle = 'Expense Updated'
      emailButtonHeaderText = 'View Updated Expense on SPLiT'
      emailButtonLabel = 'Check Changes'
      emailButtonLink = `${publicUrl}/groups/${groupId}/expenses/${expenseId}/edit`
      emailButtonFooterText = 'Keep your group finances organized.'
    } else if (group?.type === 'DUAL_MEMBER') {
      subject = `${participantName} updated the expense: ${expenseName}`
      message = `${participantName} has made changes to the expense "${expenseName}" in your shared expenses. Click the button below to see the updates.`
      emailTitle = 'Expense Updated'
      emailButtonHeaderText = 'View Updated Expense on SPLiT'
      emailButtonLabel = 'Check Changes'
      emailButtonLink = `${publicUrl}/friends/${groupId}/expenses/${expenseId}/edit`
      emailButtonFooterText = 'Keep your shared finances organized.'
    }
  } else if (activityType === ActivityType.DELETE_EXPENSE) {
    if (group?.type === 'MULTI_MEMBER') {
      subject = `${participantName} deleted the expense: ${expenseName}`
      message = `${participantName} has deleted the expense "${expenseName}" from the group "${groupName}".`
      emailTitle = 'Expense Deleted'
      emailButtonHeaderText = 'View Group on SPLiT'
      emailButtonLabel = 'Go to Group'
      emailButtonLink = `${publicUrl}/groups/${groupId}`
      emailButtonFooterText = 'Stay updated with group activities.'
    } else if (group?.type === 'DUAL_MEMBER') {
      subject = `${participantName} deleted the expense: ${expenseName}`
      message = `${participantName} has deleted the expense "${expenseName}" from your shared expenses.`
      emailTitle = 'Expense Deleted'
      emailButtonHeaderText = 'View Shared Expenses on SPLiT'
      emailButtonLabel = 'Go to Shared Expenses'
      emailButtonLink = `${publicUrl}/friends/${groupId}`
      emailButtonFooterText = 'Stay updated with shared activities.'
    }
  }

  for (const { email, name } of users) {
    let response = await fetch(`${env.NODEMAILER_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject,
        emailPreview: message,
        emailTitle: `Hey ${name}, ${emailTitle}`,
        isButtonVisible: true,
        emailButtonHeaderText,
        emailButtonLable: emailButtonLabel,
        emailMessage: message,
        emailButtonLink,
        emailButtonFooterText,
      }),
    })
    let isMailSend = await response.json()
  }

  console.log('Emails sent successfully to all recipients.')
}

export async function sendEmailLogin(userName: string, userEmail: string) {
  const deviceInfo = getClientDeviceInfo()

  let response = await fetch(`${env.NODEMAILER_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: userEmail,
      subject: 'New sign-in to your SPLiT account',
      emailPreview: `- For ${userName}'s SPLiT account ${userEmail}`,
      emailTitle: 'New sign-in to your SPLiT account',
      emailMessage: `There was a new login to your SPLiT account from the following 
        device: ${deviceInfo.browserName} - ${deviceInfo.deviceName} (${deviceInfo.deviceType}).
        We're sending this note to confirm that it was you. 
        If you recently logged into your SPLiT account, you can safely ignore this email.`,
      isButtonVisible: false,
    }),
  })
  let isMailSend = await response.json()
}
