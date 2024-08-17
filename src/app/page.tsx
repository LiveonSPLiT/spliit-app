import { FeedbackModal } from '@/components/feedback-button/feedback-button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { env } from '@/lib/env'
import {
  BarChartHorizontalBig,
  CircleDollarSign,
  Divide,
  FileImage,
  FolderTree,
  List,
  LucideIcon,
  Repeat2,
  ShieldX,
  Users,
} from 'lucide-react'
import { ReactNode } from 'react'
import { HomeButton } from '@/components/home-button'

export default function HomePage() {
  return (
    <main>
      <section className="py-16 md:py-24 lg:py-32">
        <div className="container flex max-w-screen-md flex-col items-center gap-4 text-center">
          <h1 className="!leading-none font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl landing-header py-2">
            Share <strong>Expenses</strong> <br /> with <strong>Friends</strong>{' '}
            & <strong>Family</strong>
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Welcome to <strong>SPLiT</strong> App! <br />
            <span style={{ display: 'block', textAlign: 'center' }}>
              Friends · Groups <br />
            </span>
          </p>
          <div className="flex gap-2">
              <HomeButton/>
          </div>
        </div>
      </section>
      <section className="bg-slate-50 dark:bg-card py-16 md:py-24 lg:py-32">
        <div className="p-4 flex mx-auto max-w-screen-md flex-col items-center text-center">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p
            className="mt-2 md:mt-3 leading-normal text-muted-foreground sm:text-lg sm:leading-7"
            style={{ textWrap: 'balance' } as any}
          >
            SPLiT is a minimalist application to track and share expenses with
            your friends and family.
          </p>
          <div className="mt-8 md:mt-6 w-full grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 text-left">
            <Feature
              Icon={Users}
              name="Groups"
              description="Create a group for a travel, an event, a gift…"
            />
            <Feature
              Icon={List}
              name="Expenses"
              description="Create and list expenses in your group."
            />
            <Feature
              Icon={FolderTree}
              name="Categories"
              description="Assign categories to your expenses."
            />
            <Feature
              Icon={FileImage}
              name="Receipts"
              description="Attach receipt images to expenses."
            />
            <Feature
              Icon={Repeat2}
              name="Recurring"
              description="Create recurring expenses."
              beta
            />
            <Feature
              Icon={Divide}
              name="Advanced split"
              description="Split expenses by percentage, shares or amount."
            />
            <Feature
              Icon={BarChartHorizontalBig}
              name="Balances"
              description="Visualize how much each participant spent."
            />
            <Feature
              Icon={CircleDollarSign}
              name="Reimbursements"
              description="Optimize money transfers between participants."
            />
            <Feature
              Icon={ShieldX}
              name="No ads"
              description="No account. No limitation. No problem."
            />
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 lg:py-32">
        <div className="p-4 flex mx-auto max-w-screen-md flex-col items-center text-center">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Frequently Asked Questions
          </h2>
          <div className="text-left px-4 flex flex-col gap-4 max-w-screen-md mx-auto w-full mt-8">
            <Accordion type="multiple">
              <Answer
                id="free-to-use"
                question={
                  <>
                    Is <strong>SPLiT</strong> free to use?
                  </>
                }
              >
                Yes, you can use SPLiT for free, without any limitation! Note
                that in the future, we might add premium features, but we’ll
                never put essential features behind a paywall.
              </Answer>
              <Answer
                id="differences"
                question={
                  <>
                    What differentiates <strong>SPLiT</strong> from other
                    similar services?
                  </>
                }
              >
                SPLiT is more minimalist than Splitwise or Tricount, and you
                don’t need to create any user account to use it, nor will you
                see any ads. It offers similar features, but we’re still working
                on some of them.
              </Answer>
              <Answer id="data" question={<>How is my data stored?</>}>
                All the data you enter on SPLiT (groups, expenses…) is stored in
                a PostgreSQL database hosted by{' '}
                <a target="_blank" href="https://aws.amazon.com/">
                  AWS
                </a>{' '}
                (same as the web application itself). For now, the data is only
                encrypted in rest not in transit, but we’re trying to find the
                best way to add encryption without impacting the user experience
                too much.
              </Answer>
              <Answer
                id="feedback"
                question={
                  <>
                    What is the best way to give feedback or suggest a feature?
                  </>
                }
              >
                You can give us feedback by using{' '}
                <FeedbackModal donationUrl={env.STRIPE_DONATION_LINK}>
                  <Button variant="link" className="text-base -mx-4 -my-4">
                    our feedback form
                  </Button>
                </FeedbackModal>
                . We’ll receive it by email and will keep you update, if you
                want to provide your email. This way, all our contributors will
                see it and will be able to give their insight.
              </Answer>
              <Answer
                id="contribute"
                question={<>I use SPLiT and like it. How can I contribute?</>}
              >
                <p>You can contribute to SPLiT by several ways.</p>
                <ul>
                  <li>
                    You can share it with your community on social media to let
                    them know about us,
                  </li>
                  <li>
                    You can{' '}
                    <FeedbackModal
                      donationUrl={env.STRIPE_DONATION_LINK}
                      defaultTab="support"
                    >
                      <Button
                        variant="link"
                        className="text-base text-pink-600 -mx-4 -my-4"
                      >
                        support our hosting costs
                      </Button>
                    </FeedbackModal>{' '}
                    by sponsoring us or donating a small amount,
                  </li>
                </ul>
              </Answer>
            </Accordion>
          </div>
        </div>
      </section>
    </main>
  )
}

function Answer({
  id,
  question,
  children,
}: {
  id: string
  question: ReactNode
  children: ReactNode
}) {
  return (
    <AccordionItem value={id}>
      <AccordionTrigger className="text-left text-lg">
        <span>{question}</span>
      </AccordionTrigger>
      <AccordionContent className="prose dark:prose-invert">
        {children}
      </AccordionContent>
    </AccordionItem>
  )
}

function Feature({
  name,
  Icon,
  description,
  beta = false,
}: {
  name: ReactNode
  Icon: LucideIcon
  description: ReactNode
  beta?: boolean
}) {
  return (
    <div className="bg-card border rounded-md p-4 flex flex-col gap-2 relative">
      {beta && (
        <Badge className="absolute top-4 right-4 bg-pink-700 hover:bg-pink-600 dark:bg-pink-500 dark:hover:bg-pink-600">
          Beta
        </Badge>
      )}
      <Icon className="w-8 h-8" />
      <div>
        <strong>{name}</strong>
      </div>
      <div
        className="text-sm text-muted-foreground"
        style={{ textWrap: 'balance' } as any}
      >
        {description}
      </div>
    </div>
  )
}
