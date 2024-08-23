import { getResend } from '@/lib/resend'
import { getEmailsByGroupId } from '@/lib/userGroupsHelper'
import { env } from 'process'
import { EmailTemplate } from '@/components/email-template'

interface Activity {
  name: string;
  actions: string;
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

  if (!resend || !env.FEEDBACK_EMAIL_FROM ) {
    console.warn(
      'Resend is not properly configured. Update email won’t be sent.',
    )
    return
  }
  await resend.emails.send({
    from: env.FEEDBACK_EMAIL_FROM,
    to: userEmail || "",
    subject: "New login to your SPLiT Account",
    react: EmailTemplate({emailPreview:"New login to your SPLiT Account.!"})
  })
  
}