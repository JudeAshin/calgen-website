'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  IndianRupee,
  Zap,
  BadgeCheck,
  Sparkles,
  MapPin,
  CheckCircle2,
  Send,
  User,
  Mail,
  Phone,
  Languages,
  FileText,
} from 'lucide-react';
import { PageHero } from '@/components/site/page-hero';
import { SectionHeading } from '@/components/site/section-heading';
import { Reveal, Stagger, StaggerItem } from '@/components/site/reveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LANGUAGES } from '@/lib/site';

const BENEFITS = [
  { icon: Clock, title: 'Set your own hours', description: 'Go online and offline whenever you want. You\u2019re in full control of your schedule.' },
  { icon: IndianRupee, title: 'Earn \u20B9100\u2013\u20B9300 per hour', description: 'A realistic earning range based on your rate and time online. The more you talk, the more you earn.' },
  { icon: Zap, title: 'Instant payouts', description: 'Withdraw your earnings to your bank account anytime. No minimum balance, no waiting.' },
  { icon: BadgeCheck, title: 'Verified community', description: 'Join a trusted network of identity-verified hosts and callers.' },
  { icon: Sparkles, title: 'No experience needed', description: 'If you enjoy conversation, you\u2019re qualified. We provide onboarding tips to help you succeed.' },
  { icon: MapPin, title: 'Work from anywhere', description: 'All you need is a phone and a stable internet connection. Earn from home or on the go.' },
];

const REQUIREMENTS = [
  'Must be 18 years or older',
  'Valid government-issued ID for verification',
  'Stable internet connection',
  'A smartphone with a working microphone',
];

export default function BecomeAHostContent() {
  return (
    <>
      <PageHero
        eyebrow="Become a Host"
        title="Turn Your Time Into Income"
        description="Join Calgen as a host and earn money by having real conversations. Flexible hours, instant payouts, and total control over your schedule."
      >
        <a
          href="#apply"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-[1.03]"
        >
          Apply Now
          <Send className="h-4 w-4" />
        </a>
      </PageHero>

      <BenefitsSection />
      <RequirementsSection />
      <ApplicationForm />
    </>
  );
}

function BenefitsSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why host with us"
          title="Everything you need to earn on your terms"
        />

        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" gap={0.08}>
          {BENEFITS.map((benefit) => (
            <StaggerItem key={benefit.title}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                className="group h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function RequirementsSection() {
  return (
    <section className="bg-secondary/30 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Requirements" title="What you need to get started" />
        <Reveal className="mt-10">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <ul className="space-y-4">
              {REQUIREMENTS.map((req) => (
                <li key={req} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-base">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ApplicationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [languages, setLanguages] = useState<string[]>([]);

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="apply" className="py-20 sm:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Apply now" title="Host application form" />

        {submitted ? (
          <Reveal className="mt-10">
            <div className="rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center sm:p-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                <CheckCircle2 className="h-8 w-8" />
              </motion.div>
              <h3 className="mt-6 text-2xl font-bold">Application received!</h3>
              <p className="mt-3 text-muted-foreground">
                Thanks for applying to become a Calgen host. Our team will review your application
                and reach out within 24 hours to verify your identity and get you online.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setLanguages([]);
                }}
                className="mt-6 rounded-full bg-secondary px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Submit another application
              </button>
            </div>
          </Reveal>
        ) : (
          <Reveal className="mt-10">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Full name" icon={User} id="name">
                  <Input id="name" name="name" placeholder="Your name" required />
                </FormField>
                <FormField label="Email" icon={Mail} id="email">
                  <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                </FormField>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Phone number" icon={Phone} id="phone">
                  <Input id="phone" name="phone" type="tel" placeholder="+91 98765 43210" required />
                </FormField>
                <FormField label="Gender" id="gender">
                  <Select name="gender" required>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Languages className="h-4 w-4 text-muted-foreground" />
                  Language(s) you speak
                </Label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        languages.includes(lang)
                          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                          : 'bg-secondary text-foreground hover:bg-primary/10 hover:text-primary'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                {languages.length > 0 && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Selected: {languages.join(', ')}
                  </p>
                )}
              </div>

              <FormField label="Short bio" icon={FileText} id="bio">
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us a bit about yourself and why you'd make a great host..."
                  rows={4}
                  required
                />
              </FormField>

              <Button
                type="submit"
                size="lg"
                className="w-full rounded-full text-base font-semibold shadow-lg shadow-primary/25"
              >
                <Send className="h-4 w-4" />
                Submit Application
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                By submitting, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function FormField({
  label,
  icon: Icon,
  id,
  children,
}: {
  label: string;
  icon?: typeof User;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id} className="mb-2 flex items-center gap-2 text-sm font-medium">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        {label}
      </Label>
      {children}
    </div>
  );
}
