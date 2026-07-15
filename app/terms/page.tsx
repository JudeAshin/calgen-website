import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import { PageHero } from '@/components/site/page-hero';
import { Reveal } from '@/components/site/reveal';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Read the Calgen Terms of Service covering eligibility, acceptable use, coin purchases, host obligations, platform fees, and account termination.',
};

const SECTIONS = [
  {
    n: '1',
    title: 'Agreement to Terms',
    body: [
      `These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the Calgen mobile application and related services (the &ldquo;Service&rdquo;) operated by ${SITE.company} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By creating an account or using the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service.`,
    ],
  },
  {
    n: '2',
    title: 'Eligibility',
    body: [
      'You must be at least 18 years old to use Calgen. By using the Service, you represent and warrant that you meet this age requirement and are legally able to form a binding contract. Hosts must additionally complete identity verification before going online.',
    ],
  },
  {
    n: '3',
    title: 'Acceptable Use',
    body: [
      'You agree to use the Service lawfully and respectfully. You will not:',
      ['3.1 Harass, threaten, or abuse other users or hosts.', '3.2 Share another person\u2019s personal or contact information without consent.', '3.3 Use the Service for any illegal, fraudulent, or harmful purpose.', '3.4 Attempt to reverse-engineer, hack, or disrupt the Service.', '3.5 Create multiple accounts to circumvent bans or restrictions.', '3.6 Record calls without the other party\u2019s consent where required by law.'],
    ],
  },
  {
    n: '4',
    title: 'Prohibited Content',
    body: [
      'The following are strictly prohibited on Calgen:',
      ['4.1 Sexual or explicit content, including requests for sexual services.', '4.2 Hate speech, discrimination, or harassment based on race, religion, gender, or sexual orientation.', '4.3 Promotion of violence, self-harm, or illegal activities.', '4.4 Spam, advertising, or solicitation of business outside the platform.', '4.5 Impersonation of another person or entity.'],
      'Violations may result in immediate account termination and, where applicable, reporting to authorities.',
    ],
  },
  {
    n: '5',
    title: 'Coin Purchases and Refunds',
    body: [
      'Coins are a virtual currency with no cash value outside the Service. When you purchase coins, the transaction is final.',
      ['5.1 Coin purchases are non-refundable except where required by applicable law.', '5.2 If a call drops due to a technical issue on our end, coins deducted for the lost time are automatically credited back.', '5.3 Coins do not expire for 12 months from the date of purchase, unless otherwise stated at the time of purchase.', '5.4 We reserve the right to adjust coin pack pricing and bonus structures at any time. Existing coin balances are not affected.'],
    ],
  },
  {
    n: '6',
    title: 'Host Obligations',
    body: [
      'If you are approved as a host, you agree to:',
      ['6.1 Provide accurate identity information and maintain the confidentiality of your account.', '6.2 Conduct calls professionally and respectfully.', '6.3 Not solicit payments or contact outside the platform.', '6.4 Go offline if you are unable to take calls in good faith.', '6.5 Report any inappropriate behavior from callers to support.'],
    ],
  },
  {
    n: '7',
    title: 'Platform Fees and Revenue Share',
    body: [
      'Calgen operates on a revenue-share model:',
      ['7.1 Hosts earn 50% of every coin spent on their calls.', '7.2 The remaining 50% is retained by Calgen as a platform fee, covering payment processing, infrastructure, and service maintenance.', '7.3 Hosts are responsible for any taxes applicable to their earnings.', '7.4 We may change the revenue share percentage with 30 days\u2019 notice. Existing earnings are not affected.'],
    ],
  },
  {
    n: '8',
    title: 'Account Termination',
    body: [
      'You may delete your account at any time from the app settings. We may suspend or terminate your account if you:',
      ['8.1 Violate these Terms or our Community Guidelines.', '8.2 Engage in fraudulent, abusive, or harmful behavior.', '8.3 Fail identity verification or provide false information.', '8.4 Become insolvent or cease to operate (for business accounts).'],
      'Upon termination, any unused coins are forfeited except where required by law.',
    ],
  },
  {
    n: '9',
    title: 'Intellectual Property',
    body: [
      'The Service, including its design, logo, features, and software, is owned by Calgen Technologies and protected by intellectual property laws. You may not copy, modify, or distribute any part of the Service without our written permission. Content you create (such as your bio) remains yours, but you grant us a license to display it within the Service.',
    ],
  },
  {
    n: '10',
    title: 'Disclaimer of Warranties',
    body: [
      'The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, express or implied. We do not guarantee that the Service will be uninterrupted, error-free, or secure. Your use of the Service is at your own risk.',
    ],
  },
  {
    n: '11',
    title: 'Limitation of Liability',
    body: [
      'To the fullest extent permitted by law, Calgen Technologies and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, arising from your use of the Service. Our total liability for any claim shall not exceed the amount you paid us in the 12 months preceding the claim.',
    ],
  },
  {
    n: '12',
    title: 'Changes to These Terms',
    body: [
      'We may update these Terms from time to time. We will notify you of significant changes through the app or via email. Your continued use of the Service after changes take effect constitutes acceptance of the updated Terms.',
    ],
  },
  {
    n: '13',
    title: 'Contact Us',
    body: [
      `If you have questions about these Terms, contact us at ${SITE.contactEmail}.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        description={`Last updated: January 1, 2025. These Terms govern your use of the Calgen platform.`}
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Please read these Terms carefully before using Calgen. By creating an account or using
              the Service, you agree to be bound by these Terms. If you do not agree, please do not
              use the Service.
            </p>
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
