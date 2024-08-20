import { FeedbackModal } from '@/components/feedback-button/feedback-button'
import { Button } from '@/components/ui/button'
import { env } from '@/lib/env'

export default function PrivacyPolicy() {
    return (
        <main className="flex-1 w-full max-w-screen-md mx-auto my-8 px-4">
      <div>
        <h1 className="text-4xl font-extrabold mt-4 mb-8">Privacy Policy</h1>
        <div className="mb-12 prose dark:prose-invert">



        <div>
      <p><strong>Effective Date:</strong> 06 Aug, 2024</p>
      <div className="border-t py-1 flex" />
      
      <h2>1. Introduction</h2>
      <p>This Privacy Policy outlines how we collect, use, and protect the personal information of users of our bill-splitting SPLiT app (&quot;the App&quot;). The App is a non-profit project created by individuals and is not associated with any commercial entity.</p>

      <h2>2. Information We Collect</h2>
      <p><strong>Personal Information:</strong> We collect only the name and email address of our users. No other personal information is collected.</p>
      <p><strong>Data Storage:</strong> Your personal information is stored on AWS RDS and S3 servers. All data is encrypted at rest, but not in transit.</p>

      <h2>3. Use of Information</h2>
      <p>We use your name and email address solely for the purpose of facilitating the functionality of the App (e.g., splitting bills, managing groups). We do not sell, share, or use your data for any analytics or marketing purposes.</p>

      <h2>4. Data Retention</h2>
      <p>We do not retain your data for any longer than necessary to provide the services of the App. Due to resource limitations, we cannot offer data restoration, backups, or recovery services.</p>

      <h2>5. Data Security</h2>
      <p>We use encryption to protect your data at rest. While we take reasonable steps to protect your information, we cannot guarantee its absolute security.</p>

      <h2>6. Changes to this Privacy Policy</h2>
      <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the effective date will be updated accordingly.</p>

      <h2>7. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at {' '}
      <a href="mailto:liveonsplit@gmail.com">liveonsplit@gmail.com</a> or use <FeedbackModal donationUrl={env.STRIPE_DONATION_LINK}>
                  <Button variant="link" className="text-base -mx-4 -my-4">
                    our feedback form
                  </Button>
                </FeedbackModal>.</p>
    
                
    </div>
          




        </div>
      </div>
      </main>
    )
}