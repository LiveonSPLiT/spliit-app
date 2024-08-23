import { getResend } from '@/lib/resend'
import { getEmailsByGroupId } from '@/lib/userGroupsHelper'
import { env } from 'process'
import { EmailTemplate } from '@/components/email-template'
import { headers } from 'next/headers'
import parser from 'ua-parser-js';

interface Activity {
  name: string;
  actions: string;
}

function getClientDeviceInfo() {
  const headerList = headers()
  const userAgent = headerList.get('user-agent') || ""
  const ua = parser(userAgent);

  const browserName = ua.browser.name;
  const deviceType = ua.device.type || 'Desktop';
  const deviceName = ua.device.vendor || ua.os.name;

  return {
    browserName,
    deviceType,
    deviceName,
  };
}

export async function sendActivityEmails(groupId: string, activity: Activity): Promise<void> {
    const users = await getEmailsByGroupId(groupId);
    const resend = getResend()
  
    if (users.length === 0) {
      console.log('No emails found for the provided groupId.');
      return;
    }
    if (!resend || !env.FEEDBACK_EMAIL_FROM ) {
      console.warn(
        'Resend is not properly configured. Update email won’t be sent.',
      )
      return
    }
    for (const { email, name } of users) {
      await resend.emails.send({
        from: env.FEEDBACK_EMAIL_FROM,
        to: email,
        subject: `${name} updated on ${activity.name}`,
        react: EmailTemplate({emailPreview:""})
      })
    }
  
  console.log('Emails sent successfully to all recipients.');
}

export async function sendEmailLogin(userName: string, userEmail: string) {
  const resend = getResend()
  const deviceInfo = getClientDeviceInfo();
  
  if (!resend || !env.FEEDBACK_EMAIL_FROM ) {
    console.warn(
      'Resend is not properly configured. Update email won’t be sent.',
    )
    return
  }
  await resend.emails.send({
    from: env.FEEDBACK_EMAIL_FROM,
    to: userEmail || "",
    subject: "New login to your SPLiT account",
    react: EmailTemplate({
      emailPreview:`- For ${userName}'s SPLiT account ${userEmail}`,
      emailTitle:"New sign-in to your SPLiT account",
      emailMessage:`There was a new login to your SPLiT account from the following 
      device: ${deviceInfo.browserName} - ${deviceInfo.deviceName} (${deviceInfo.deviceType}).
      We're sending this note to confirm that it was you. 
      If you recently logged into your SPLiT account, you can safely ignore this email.`,
      isButtonVisible:false
    })
  })
  
}