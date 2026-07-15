import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import { PageHero } from '@/components/site/page-hero';
import { Reveal } from '@/components/site/reveal';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read the Calgen privacy policy to understand what data we collect, how we use it, and your rights regarding your personal information.',
};

const SECTIONS = [
  {
    n: '1',
    title: 'Information We Collect',
    body: [
      'We collect information you provide directly to us when you create an account, use our services, or contact us. This includes:',
      ['1.1 Account information: Your name, phone number, and email address.', '1.2 Profile information: Your display name, bio, profile photo, and languages spoken (for hosts).', '1.3 Payment information: Payment method details processed securely through our payment partner. We do not store full card numbers on our servers.', '1.4 Usage data: Information about how you use the app, including call duration, coins spent, and device information.'],
    ],
  },
  {
    n: '2',
    title: 'How We Use Your Information',
    body: [
      'We use the information we collect to:',
      ['2.1 Provide, operate, and maintain the Calgen service.', '2.2 Process transactions and manage your coin wallet.', '2.3 Verify host identities and maintain community safety.', '2.4 Send you service updates, security alerts, and support messages.', '2.5 Monitor and prevent fraud, abuse, and violations of our Terms.', '2.6 Improve our services and develop new features.'],
    ],
  },
  {
    n: '3',
    title: 'Third-Party Services',
    body: [
      'We use trusted third-party services to operate Calgen. Each service has its own privacy policy:',
      ['3.1 Razorpay \u2014 Payment processing and payouts.', '3.2 Agora \u2014 Real-time voice call infrastructure.', '3.3 Firebase \u2014 Analytics, push notifications, and authentication.', '3.4 Cloudinary \u2014 Image storage and processing for profile photos.', '3.5 AWS (Amazon Web Services) \u2014 Cloud hosting and data storage.'],
      'These providers process data on our behalf and are bound by their own privacy and security standards.',
    ],
  },
  {
    n: '4',
    title: 'Data Retention',
    body: [
      'We retain your information for as long as your account is active. If you delete your account, we will remove or anonymize your personal data within 30 days, except where we are legally required to retain it longer. Transaction records may be kept for up to 7 years for legal and accounting purposes.',
    ],
  },
  {
    n: '5',
    title: 'Data Sharing',
    body: [
      'We do not sell your personal data. We may share your information with:',
      ['5.1 Third-party service providers who help us operate the platform (listed above).', '5.2 Law enforcement or government agencies when legally required.', '5.3 Other users, to the extent necessary to facilitate calls (e.g., your display name and online status).'],
    ],
  },
  {
    n: '6',
    title: 'Data Security',
    body: [
      'We take reasonable measures to protect your data, including encryption in transit and at rest, access controls, and regular security reviews. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.',
    ],
  },
  {
    n: '7',
    title: 'Your Rights',
    body: [
      'Depending on your location, you may have the right to:',
      ['7.1 Access the personal data we hold about you.', '7.2 Request correction of inaccurate data.', '7.3 Request deletion of your account and associated data.', '7.4 Opt out of marketing communications.', '7.5 Withdraw consent for data processing where applicable.'],
      'To exercise these rights, contact us at the email listed below.',
    ],
  },
  {
    n: '8',
    title: 'Children\u2019s Privacy',
    body: [
      'Calgen is not intended for anyone under 18. We do not knowingly collect data from minors. If you believe a child has provided us with personal data, please contact us and we will delete it immediately.',
    ],
  },
  {
    n: '9',
    title: 'Changes to This Policy',
    body: [
      'We may update this Privacy Policy from time to time. We will notify you of significant changes through the app or via email. The effective date below indicates when the policy was last updated.',
    ],
  },
  {
    n: '10',
    title: 'Contact Us',
    body: [
      `If you have questions about this Privacy Policy or your data, contact us at ${SITE.contactEmail}.`,
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description={`Last updated: January 1, 2025. This policy describes how ${SITE.company} collects, uses, and protects your information.`}
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed text-muted-foreground">
                This Privacy Policy explains how {SITE.company} (&ldquo;we&rdquo;,
                &ldquo;us&rdquo;, or &ldquo;our&rdquo;) collects, uses, and protects your personal
                information when you use the Calgen mobile application and related services
                (collectively, the &ldquo;Service&rdquo;). By using the Service, you agree to the
                practices described in this policy.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 space-y-10">
            {SECTIONS.map((section) => (
              <Reveal key={section.n}>
                <div>
                  <h2 className="text-xl font-bold sm:text-2xl">
                    {section.n}. {section.title}
                  </h2>
                  <div className="mt-4 space-y-3">
                    {section.body.map((para, i) => (
                      <ContentBlock key={i} para={para} />
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ContentBlock({ para }: { para: string | string[] }) {
  if (Array.isArray(para)) {
    return (
      <ul className="ml-6 space-y-2">
        {para.map((item, i) => (
          <li key={i} className="text-base leading-relaxed text-muted-foreground">
            {item}
          </li>
        ))}
      </ul>
    );
  }
  return <p className="text-base leading-relaxed text-muted-foreground">{para}</p>;
}
