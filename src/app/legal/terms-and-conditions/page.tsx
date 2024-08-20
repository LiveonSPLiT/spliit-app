import { FeedbackModal } from '@/components/feedback-button/feedback-button'
import { Button } from '@/components/ui/button'
import { env } from '@/lib/env'

export default function TermsAndConditions() {
    return (
      <main className="flex-1 w-full max-w-screen-md mx-auto my-8 px-4">
      <div>
        <h1 className="text-4xl font-extrabold mt-4 mb-8">Terms & Conditions</h1>
        <div className="mb-12 prose dark:prose-invert">


        <div>
      <p><strong>Effective Date:</strong> 06 Aug, 2024</p>
      <div className="border-t py-1 flex" />
      
      <h2>1. Introduction</h2>
      <p>These Terms & Conditions (&quot;Terms&quot;) govern your use of our bill-splitting SPLiT app (&quot;the App&quot;). By accessing or using the App, you agree to be bound by these Terms.</p>

      <h2>2. Use of the App</h2>
      <p>The App is provided for personal, non-commercial use only. You agree not to use the App for any unlawful purpose or in any way that could damage the App or its users.</p>

      <h2>3. Account Responsibility</h2>
      <p>You are responsible for maintaining the confidentiality of your account information, including your email and any other credentials. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.</p>

      <h2>4. Data and Privacy</h2>
      <p>We only collect your name and email address to facilitate the functionality of the App. We do not provide any data restoration, backup, or recovery services. You acknowledge and agree that we are not liable for any loss of data.</p>

      <h2>5. Termination</h2>
      <p>We reserve the right to terminate your access to the App at any time, without notice, for any reason, including but not limited to violations of these Terms.</p>

      <h2>6. Limitation of Liability</h2>
      <p>To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or in connection with your use of the App.</p>

      <h2>7. Governing Law</h2>
      <p>These Terms are governed by and construed in accordance with the laws of Jharkahnd-India, without regard to its conflict of law principles.</p>

      <h2>8. Changes to the Terms</h2>
      <p>We may update these Terms from time to time. Any changes will be posted on this page, and the effective date will be updated accordingly.</p>

      <h2>9. Contact Us</h2>
      <p>If you have any questions about these Terms & Conditions, please contact us at {' '}
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