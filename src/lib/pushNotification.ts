'use server'

import { env } from '@/lib/env'
import webpush from 'web-push'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function subscribeUser(sub: any, email: string) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: {
        pushSubscription: sub,
        notificationPref: 'BOTH',
      },
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: 'Subscription failed' };
  }
}

export async function unsubscribeUser(email: string) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: {
        pushSubscription: Prisma.JsonNull,
        notificationPref: 'EMAIL',
      },
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: 'Unsubscription failed' };
  }
}

export async function sendNotification(subscription: any, title: string, message: string, url: string) {

  webpush.setVapidDetails(
    'mailto:hello@liveonsplit.com',
    env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
    env.VAPID_PRIVATE_KEY || ''
  )

  if (subscription.keys && subscription.endpoint) {
    try {
      await webpush.sendNotification(
        subscription,
        JSON.stringify({
          title,
          body: message,
          icon: '/android-chrome-192x192.png',
          url,
        })
      )
  
      return { success: true }
    } catch (error) {
      console.error('Error sending push notification:', error)
      return { success: false, error: 'Failed to send notification' }
    }
  }
}
