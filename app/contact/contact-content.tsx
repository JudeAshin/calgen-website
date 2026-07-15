'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2, Clock, MessageSquare, User } from 'lucide-react';
import { PageHero } from '@/components/site/page-hero';
import { Reveal } from '@/components/site/reveal';
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
import { SITE } from '@/lib/site';

export default function ContactContent() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        description="Have a question, feedback, or need help? Send us a message and we\u2019ll get back to you shortly."
      />

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Contact info */}
            <Reveal className="lg:col-span-2">
              <div className="h-full space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Email us</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    For general inquiries and support.
                  </p>
                  <a
                    href={`mailto:${SITE.supportEmail}`}
                    className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
                  >
                    {SITE.supportEmail}
                  </a>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Response time</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We respond within 24 hours, Monday through Friday.
                  </p>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">In-app support</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    For the fastest response, use the support chat inside the Calgen app.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Form */}
            <Reveal className="lg:col-span-3">
              {submitted ? (
                <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center sm:p-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  >
                    <CheckCircle2 className="h-8 w-8" />
                  </motion.div>
                  <h3 className="mt-6 text-2xl font-bold">Message sent!</h3>
                  <p className="mt-3 max-w-sm text-muted-foreground">
                    Thanks for reaching out. We\u2019ve received your message and will respond within
                    24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 rounded-full bg-secondary px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name" className="mb-2 flex items-center gap-2 text-sm font-medium">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Name
                      </Label>
                      <Input id="name" name="name" placeholder="Your name" required />
                    </div>
                    <div>
                      <Label htmlFor="email" className="mb-2 flex items-center gap-2 text-sm font-medium">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Email
                      </Label>
                      <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="mb-2 block text-sm font-medium">
                      Subject
                    </Label>
                    <Select name="subject" required>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General inquiry</SelectItem>
                        <SelectItem value="support">Technical support</SelectItem>
                        <SelectItem value="billing">Billing or payments</SelectItem>
                        <SelectItem value="host">Host application</SelectItem>
                        <SelectItem value="report">Report a user or content</SelectItem>
                        <SelectItem value="feedback">Feedback or feature request</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message" className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us how we can help..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full rounded-full text-base font-semibold shadow-lg shadow-primary/25"
                  >
                    <Send className="h-4 w-4" />
                    Send Message
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    We respond within 24 hours. For urgent issues, use in-app support.
                  </p>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
