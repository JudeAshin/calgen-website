'use client';

import { motion } from 'framer-motion';
import { Coins, Check, Sparkles, TrendingUp, Banknote } from 'lucide-react';
import { PageHero } from '@/components/site/page-hero';
import { SectionHeading } from '@/components/site/section-heading';
import { Reveal, Stagger, StaggerItem } from '@/components/site/reveal';
import { cn } from '@/lib/utils';

const PACKS = [
  {
    name: 'Starter',
    price: 49,
    coins: 50,
    minutes: '~10 minutes',
    features: ['50 coins', 'Valid for 6 months', 'All payment methods'],
    popular: false,
  },
  {
    name: 'Popular',
    price: 99,
    coins: 110,
    minutes: '~22 minutes',
    features: ['110 coins', '10 bonus coins', 'Valid for 12 months', 'Priority support'],
    popular: true,
  },
  {
    name: 'Value',
    price: 199,
    coins: 250,
    minutes: '~50 minutes',
    features: ['250 coins', '50 bonus coins', 'Valid for 12 months', 'Priority support'],
    popular: false,
  },
  {
    name: 'Premium',
    price: 499,
    coins: 700,
    minutes: '~140 minutes',
    features: ['700 coins', '200 bonus coins', 'Valid for 12 months', 'Priority support', 'Early feature access'],
    popular: false,
  },
];

export default function PricingContent() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Simple, fair coin pricing"
        description="Buy a coin pack, talk for as long as you want. No subscriptions, no hidden fees \u2014 just pay per minute."
      />

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" gap={0.1}>
            {PACKS.map((pack) => (
              <StaggerItem key={pack.name}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                  className={cn(
                    'relative flex h-full flex-col rounded-3xl border-2 bg-card p-6 shadow-sm transition-shadow hover:shadow-xl',
                    pack.popular
                      ? 'border-primary shadow-lg shadow-primary/10'
                      : 'border-border',
                  )}
                >
                  {pack.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold">{pack.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">\u20B9{pack.price}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2">
                    <Coins className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold text-primary">{pack.coins} coins</span>
                    <span className="text-sm text-muted-foreground">&middot; {pack.minutes}</span>
                  </div>
                  <ul className="mt-6 flex-1 space-y-3">
                    {pack.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={cn(
                      'mt-6 w-full rounded-full py-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                      pack.popular
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:scale-[1.02]'
                        : 'bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground',
                    )}
                  >
                    Buy {pack.name}
                  </button>
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mx-auto mt-10 max-w-2xl rounded-2xl bg-secondary/50 p-5 text-center">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">1 coin = 1 minute</span> with most
              hosts. Some hosts charge more based on their rate. You always see the exact rate
              before you call.
            </p>
          </Reveal>
        </div>
      </section>

      <HostEarnings />
    </>
  );
}

function HostEarnings() {
  return (
    <section className="bg-secondary/30 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="For Hosts"
          title="Earn 50% on every call"
          description="A simple, transparent revenue share. No hidden cuts, no surprise fees."
        />

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-3">
          {[
            { icon: TrendingUp, title: '50% revenue share', description: 'You keep half of every coin spent on your calls, tracked in real time.' },
            { icon: Banknote, title: 'Instant payouts', description: 'Withdraw your earnings to your bank account anytime, with no waiting period.' },
            { icon: Sparkles, title: 'Set your own rate', description: 'Choose your per-minute rate based on your experience and availability.' },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-10 max-w-2xl rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
          <p className="text-base leading-relaxed text-foreground">
            Hosts earn <span className="font-semibold text-primary">50% of every coin</span>{' '}
            spent on their calls. Withdraw earnings to your bank account anytime.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
