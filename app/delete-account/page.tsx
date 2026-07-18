'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import { PageHero } from '@/components/site/page-hero';
import { Reveal } from '@/components/site/reveal';

export default function DeleteAccountPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmed?: string;
  }>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (!confirmed) {
      newErrors.confirmed =
        'Please confirm that you understand this action is permanent.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = () => {
    if (!validate()) return;

    const ok = window.confirm(
      'Are you sure you want to delete your account?\n\nThis action is permanent and cannot be undone.'
    );

    if (!ok) return;

    // Backend will be integrated later.
    setSuccess(true);
  };

  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Delete My Account"
        description="Request permanent deletion of your Calgen account."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

          <Reveal>
            <div className="rounded-2xl border p-8 shadow-sm">

              {!success ? (
                <>
                  <p className="text-muted-foreground leading-7">
                    We're sorry to see you leave.
                  </p>

                  <p className="mt-4 text-muted-foreground leading-7">
                    Deleting your account will permanently remove your profile,
                    wallet information, preferences, and personal data associated
                    with your Calgen account. This action cannot be undone.
                  </p>

                  <div className="mt-8 space-y-6">

                    <div>
                      <label className="mb-2 block font-medium">
                        Email Address
                      </label>

                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border px-4 py-3"
                        placeholder="you@example.com"
                      />

                      {errors.email && (
                        <p className="mt-2 text-sm text-red-500">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block font-medium">
                        Password
                      </label>

                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border px-4 py-3"
                        placeholder="Enter your password"
                      />

                      {errors.password && (
                        <p className="mt-2 text-sm text-red-500">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={confirmed}
                          onChange={(e) => setConfirmed(e.target.checked)}
                          className="mt-1"
                        />

                        <span className="text-sm text-muted-foreground">
                          I understand that deleting my account is permanent
                          and cannot be undone.
                        </span>
                      </label>

                      {errors.confirmed && (
                        <p className="mt-2 text-sm text-red-500">
                          {errors.confirmed}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleDelete}
                      className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
                    >
                      DELETE MY ACCOUNT
                    </button>

                  </div>

                  <div className="mt-12 rounded-xl bg-muted p-6">
                    <h2 className="text-lg font-semibold">
                      Important Notes
                    </h2>

                    <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
                      <li>
                        Account deletion is permanent and cannot be reversed.
                      </li>

                      <li>
                        Please make sure you have backed up any important
                        information before proceeding.
                      </li>

                      <li>
                        Some information may be retained where required by law
                        or for fraud prevention purposes.
                      </li>

                      <li>
                        If you have any active subscriptions or pending
                        transactions, ensure they are completed before
                        requesting deletion.
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
                  <h2 className="text-2xl font-bold text-green-700">
                    Request Submitted Successfully
                  </h2>

                  <p className="mt-4 text-muted-foreground">
                    Your account deletion request has been received.
                  </p>

                  <p className="mt-2 text-muted-foreground">
                    Our team will process your request and permanently remove
                    your account and associated personal data after verification.
                  </p>

                  <p className="mt-2 text-muted-foreground">
                    If this request was made by mistake, please contact our
                    support team immediately.
                  </p>
                </div>
              )}

            </div>
          </Reveal>

        </div>
      </section>
    </>
  );
}