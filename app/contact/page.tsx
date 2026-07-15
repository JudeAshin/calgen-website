import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
import ContactContent from './contact-content';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with the Calgen team. Send us a message and we\u2019ll respond within 24 hours.',
};

export default function ContactPage() {
  return <ContactContent />;
}