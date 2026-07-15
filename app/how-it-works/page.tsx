import type { Metadata } from 'next';
import HowItWorksContent from './how-it-works-content';

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'Learn how Calgen works for callers and hosts. Step-by-step guides for both user types, plus answers to common questions.',
};

export default function HowItWorksPage() {
  return <HowItWorksContent />;
}