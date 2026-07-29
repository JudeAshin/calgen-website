'use client';

import { motion } from 'framer-motion';
import {
  UserPlus,
  Search,
  Coins,
  PhoneCall,
  Headphones,
  Star,
  Send,
  CheckCircle2,
  Power,
  Radio,
  Wallet,
  Banknote,
  ArrowRight,
} from 'lucide-react';
import { PageHero } from '@/components/site/page-hero';
import { SectionHeading } from '@/components/site/section-heading';
import { Reveal, Stagger, StaggerItem } from '@/components/site/reveal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const CALLER_STEPS = [
  { icon: UserPlus, title: 'Get started instantly', description: 'Verify your email to log in and start using Calgen. No separate signup required.' }  ,
  { icon: Search, title: 'Browse online hosts', description: 'See verified hosts available right now, filtered by language, rate, and rating.' },
  { icon: Coins, title: 'Buy a coin pack', description: 'Pick a coin pack that fits your budget. Coins land in your wallet instantly.' },
  { icon: PhoneCall, title: 'Tap Call Now', description: 'Hit the call button on any online host to start a live voice call instantly.' },
  { icon: Headphones, title: 'Talk and pay per minute', description: 'Coins deduct per minute based on the host\u2019s rate. Talk for as long as you want.' },
  { icon: Star, title: 'Rate the host after', description: 'Leave a rating after the call to help the community find great hosts.' },
];

const HOST_STEPS = [
  { icon: Send, title: 'Register as a host', description: 'After email verification, you can apply as a host from your account or start the host registration process directly.' },
  { icon: CheckCircle2, title: 'Complete profile',   description: 'Add your photo, bio, and languages to get started. Your initial rate is set at 1.5 gems per minute, and you can increase it later based on your performance and ratings.'},
  { icon: Power, title: 'Go online', description: 'Toggle yourself online whenever you\u2019re ready to take calls.' },
  { icon: Radio, title: 'Receive calls', description: 'Callers see you online and tap to connect. Accept and start talking.' },
  { icon: Wallet, title: 'Earn coins', description: 'You earn 50% of every coin spent on your calls, tracked in real time.' },
  { icon: Banknote, title: 'Withdraw earnings', description: 'Cash out your earnings to your bank account anytime, no waiting.' },
];

const FAQS = [
  {
    q: 'What are coins and gems?',
    a: 'Coins are Caligen’s in-app currency for callers. You can buy coin packs with real money and spend coins per minute on voice calls with hosts. Gems are the earning currency for hosts, which they receive from completed calls and can convert into real money.',
  },
  {
    q: 'How much does a call cost?',
    a: 'The cost depends on the host\u2019s per-minute rate. Most hosts charge 3 coin per minute, but some set higher rates. You always see the rate before you call, and you only pay for the minutes you actually talk.',
  },
  {
    q: 'How do hosts earn?',
    a: 'Hosts earn 1.5 gems per minute for every completed call. Callers pay 3 coins per minute, and host earnings are tracked in real time. Hosts can convert their gems into real money and withdraw their earnings.',
  },
  {
    q: 'Is it safe?',
    a: 'Yes. Every host is identity-verified before going live. All calls are encrypted, payments are processed through trusted gateways, and users can report or block anyone at any time.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept all major credit and debit cards, UPI, and popular mobile wallets through our payment partner Razorpay. Available methods may vary by region.',
  },
  {
    q: 'Can I get a refund?',
    a: 'Coin purchases are non-refundable except where required by law. If you experience a technical issue during a call that drops the connection, any coins deducted for the lost time are automatically credited back to your wallet.',
  },
  {
    q: 'How do I become a host?',
    a: 'You can become a host by filling out the application form on the Become a Host page, or by installing the Caligen app and completing the host onboarding process. Once your profile and verification are complete, you can go online and start receiving calls.',
  },
  {
    q: 'What happens when my coins run out?',
    a: 'If you run out of coins mid-call, the call will end automatically. You can buy a new coin pack at any time to continue talking or start a new call.',
  },
];

export default function HowItWorksContent() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="How Calgen works"
        description="Whether you want to talk or earn, getting started is simple. Here’s the full flow for both callers and hosts."      />

      <FlowSection
        eyebrow="For Callers"
        title="Start a conversation in 6 steps"
        description="From sign-up to your first call, here's everything you do as a caller."
        steps={CALLER_STEPS}
      />

      <FlowSection
        eyebrow="For Hosts"
        title="Start earning in 6 steps"
        description="Turn your time into income. Here's the path from application to your first payout."
        steps={HOST_STEPS}
        alternate
      />

      <FAQSection />
    </>
  );
}

function FlowSection({
  eyebrow,
  title,
  description,
  steps,
  alternate = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  steps: { icon: typeof UserPlus; title: string; description: string }[];
  alternate?: boolean;
}) {
  return (
    <section className={alternate ? 'bg-secondary/30 py-20 sm:py-24' : 'py-20 sm:py-24'}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" gap={0.08}>
          {steps.map((step, i) => (
            <StaggerItem key={step.title}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                className="relative h-full rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <span className="text-3xl font-bold text-primary/20">{i + 1}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
                {i < steps.length - 1 && (
                  <ArrowRight className="absolute right-5 top-6 hidden h-5 w-5 text-primary/30 lg:block" />
                )}
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        <Reveal className="mt-12">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
