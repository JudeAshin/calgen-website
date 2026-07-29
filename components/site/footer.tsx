import Link from 'next/link';
import { FaInstagram, FaFacebookF, FaXTwitter } from "react-icons/fa6";
import { Logo } from './logo';
import { NAV_LINKS, SITE } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The live social calling platform. Talk to real, verified hosts any time, paying per
              minute with coins.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <SocialLink href="https://www.instagram.com/get.calgen?igsh=NnNlMWtlM3A5OTA%3D&utm_source=qr" label="Instagram">
                <FaInstagram className="h-5 w-5" />
              </SocialLink>
              <SocialLink href="https://x.com/calgen_official?s=11" label="Twitter">
                <FaXTwitter className="h-5 w-5" />
              </SocialLink>
              <SocialLink href="https://www.facebook.com/share/1D1uSmjD3u/?mibextid=wwXIfr" label="LinkedIn">
                <FaFacebookF className="h-5 w-5" />
                </SocialLink>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <ul className="mt-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/privacy-policy" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="mt-4 space-y-3">
              <li className="text-sm text-muted-foreground">{SITE.company}</li>
              <li>
                <a
                  href={`mailto:${SITE.contactEmail}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {SITE.contactEmail}
                </a>
              </li>
              <li>
      <a
        href={`tel:${SITE.phone}`}
        className="text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        {SITE.phone}
      </a>
    </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {SITE.company}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-all hover:scale-110 hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      {children}
    </a>
  );
}