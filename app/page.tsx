'use client';

import { motion } from 'framer-motion';
import {
  Phone,
  Search,
  Coins,
  Headphones,
  ShieldCheck,
  BadgeCheck,
  Wallet,
  Activity,
  Star,
  ArrowRight,
  Users,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AppBadge } from '@/components/site/app-badge';
import { PhoneMockup } from '@/components/site/phone-mockup';
import { SectionHeading } from '@/components/site/section-heading';
import { Reveal, Stagger, StaggerItem } from '@/components/site/reveal';
import { SITE } from '@/lib/site';

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <SocialProof />
      <HostCTA />
      <DownloadSection />
    </>
  );
}

function Hero() {
  return (
    <section className="gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" aria-hidden="true" />
      {/* Animated gradient blobs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
        aria-hidden="true"
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-20 top-40 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-24">
        <div className="text-center lg:text-left">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Live now — 1,200+ hosts online
            </span>
          </Reveal>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white text-balance sm:text-5xl lg:text-6xl"
          >
            Talk to Real People,{' '}
            <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">
              Any Time
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70 text-balance lg:mx-0"
          >
            {SITE.name} is a live social calling platform where you can have real voice
            conversations with verified hosts. Browse who&apos;s online, buy coins, and start
            talking in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <AppBadge variant="app-store" />
            <AppBadge variant="play-store" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-8 flex items-center justify-center gap-6 text-sm text-white/60 lg:justify-start"
          >
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>50k+ users</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>4.8 rating</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Verified hosts</span>
            </div>
          </motion.div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    icon: Search,
    title: 'Browse online hosts',
    description: 'See verified hosts who are online right now, filtered by language and rate.',
  },
  {
    icon: Coins,
    title: 'Buy coins',
    description: 'Pick a coin pack that fits you. Coins are added to your wallet instantly.',
  },
  {
    icon: Headphones,
    title: 'Start talking',
    description: 'Tap Call Now and connect with a real person in a live voice conversation.',
  },
];

function HowItWorks() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps to a real conversation"
          description="No waiting, no scheduling. Just pick a host, load your wallet, and talk."
        />

        <Stagger className="mt-14 grid gap-8 md:grid-cols-3" gap={0.15}>
          {STEPS.map((step, i) => (
            <StaggerItem key={step.title}>
              <div className="relative flex flex-col items-center text-center">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                  <step.icon className="h-9 w-9" />
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-lg">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 max-w-xs text-muted-foreground">{step.description}</p>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="absolute right-0 top-10 hidden h-6 w-6 text-primary/40 md:block" />
                )}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: Phone,
    title: 'Live Voice Calls',
    description: 'Crystal-clear, real-time voice calls with no lag. Connect instantly with a tap.',
  },
  {
    icon: BadgeCheck,
    title: 'Verified Hosts',
    description: 'Every host is identity-verified and rated by the community for your safety.',
  },
  {
    icon: Coins,
    title: 'Pay Per Minute',
    description: 'Only pay for the time you talk. No subscriptions, no hidden charges, ever.',
  },
  {
    icon: Wallet,
    title: 'Instant Coin Wallet',
    description: 'Buy coins once and use them across any host. Your balance updates in real time.',
  },
  {
    icon: Activity,
    title: 'Real-Time Online Status',
    description: 'See exactly who is available right now. Green dot means ready to talk.',
  },
  {
    icon: ShieldCheck,
    title: 'Safe & Secure',
    description: 'Calls are encrypted and payments are processed through trusted gateways.',
  },
];

function Features() {
  return (
    <section className="bg-secondary/30 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Features"
          title="Built for real conversations"
          description="Everything you need to connect with real people, safely and effortlessly."
        />

        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" gap={0.08}>
          {FEATURES.map((feature) => (
            <StaggerItem key={feature.title}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                className="group h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  {
    name: 'Rahul S.',
    initials: 'RS',
    color: 'linear-gradient(135deg,#25D366,#00B894)',
    rating: 5,
    quote:
      "I was having a rough night and just wanted someone to talk to. Found a host online in seconds and had the most comforting conversation. Felt human.",
  },
  {
    name: 'Ananya M.',
    initials: 'AM',
    color: 'linear-gradient(135deg,#00B894,#0FB9B1)',
    rating: 5,
    quote:
      'The pay-per-minute model is so fair. I bought a small coin pack and talked for exactly as long as I wanted. No subscription traps.',
  },
  {
    name: 'Vikram J.',
    initials: 'VJ',
    color: 'linear-gradient(135deg,#0FB9B1,#25D366)',
    rating: 4,
    quote:
      'Started as a caller, then became a host. I now earn in my free time just by having conversations. The withdrawal to my bank is instant.',
  },
];

function SocialProof() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Loved by users"
          title="Real stories from real callers"
          description="Thousands of people use Calgen every day to connect, talk, and feel heard."
        />

        <Stagger className="mt-14 grid gap-6 md:grid-cols-3" gap={0.12}>
          {TESTIMONIALS.map((t) => (
            <StaggerItem key={t.name}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-border'
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: t.color }}
                  >
                    {t.initials}
                  </div>
                  <span className="text-sm font-semibold">{t.name}</span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function HostCTA() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="gradient-host relative overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="absolute inset-0 bg-grid opacity-20" aria-hidden="true" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                For Hosts
              </span>
              <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold text-white text-balance sm:text-4xl">
                Earn Money Hosting Calls
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/70 text-balance">
                Set your own rate, go online when you want. Join as a Host today and turn your
                conversations into income.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <a
                  href="/become-a-host"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#04231a]"
                >
                  Join Now
                  <ArrowRight className="h-4 w-4" />
                </a>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Clock className="h-4 w-4" />
                  Start earning within 24 hours
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function DownloadSection() {
  return (
    <section id="download" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/5 to-emerald-500/5 px-6 py-16 text-center sm:px-12">
            <h2 className="text-3xl font-bold text-balance sm:text-4xl">
              Ready to start talking?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground text-balance">
              Download {SITE.appName} today and connect with real people in seconds. Available on
              iOS and Android.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <AppBadge variant="app-store" />
              <AppBadge variant="play-store" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
