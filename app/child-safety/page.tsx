import { PageHero } from '@/components/site/page-hero';
import { Reveal } from '@/components/site/reveal';

export default function ChildSafetyPage() {
  return (
    <>
      <PageHero
        eyebrow="Safety"
        title="Child Safety Standards"
        description="Calgen is committed to protecting children and preventing child sexual abuse and exploitation."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="space-y-8">

              <p className="text-base leading-relaxed text-muted-foreground">
                Calgen has zero tolerance for child sexual abuse, exploitation,
                grooming, trafficking, or any content that depicts, promotes,
                or facilitates child sexual abuse material (CSAM).
              </p>

              <div>
                <h2 className="text-2xl font-bold">
                  1. Age Restrictions
                </h2>

                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Calgen is strictly intended for users who are 18 years of age
                  or older. Individuals under 18 are not permitted to create
                  accounts or use any part of the platform.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  2. Zero-Tolerance Policy
                </h2>

                <p className="mt-4 text-muted-foreground leading-relaxed">
                  We prohibit any content, behavior, communication, or activity
                  involving child sexual abuse, exploitation, grooming,
                  trafficking, or any form of sexualization of minors.
                </p>

                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Any account found engaging in such activities will be
                  permanently banned and may be reported to relevant law
                  enforcement authorities and child protection organizations.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  3. Reporting and Moderation
                </h2>

                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Users can report inappropriate behavior, content, profiles,
                  messages, or calls through our reporting system.
                </p>

                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Reports involving minors, suspected exploitation, grooming,
                  or child sexual abuse are treated with the highest priority
                  and reviewed immediately.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  4. Enforcement Actions
                </h2>

                <ul className="mt-4 ml-6 list-disc space-y-2 text-muted-foreground">
                  <li>Immediate suspension or permanent account termination.</li>
                  <li>Removal of violating content.</li>
                  <li>Preservation of evidence where legally required.</li>
                  <li>Reporting to law enforcement authorities when appropriate.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  5. Compliance
                </h2>

                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Calgen complies with applicable child safety laws, Google Play
                  Child Safety Standards policies, and relevant regulations
                  concerning child protection and online safety.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  6. Contact Information
                </h2>

                <p className="mt-4 text-muted-foreground leading-relaxed">
                  For child safety concerns, reports, or compliance inquiries,
                  please contact:
                </p>

                <div className="mt-4 rounded-xl border p-4">
                  <p><strong>Email:</strong> support.calgen@gmail.com</p>
                  <p><strong>Company:</strong> Calgen Technologies</p>
                  <p><strong>Response Time:</strong> Within 48 hours</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  7. Last Updated
                </h2>

                <p className="mt-4 text-muted-foreground">
                  June 2026
                </p>
              </div>

            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}