import type { Metadata } from 'next';
import PricingContent from './pricing-content';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Buy coin packs for Calgen voice calls. Choose from Starter, Popular, Value, and Premium packs. Plus, learn how hosts earn 50% revenue share.',
};

export default function PricingPage() {
  return <PricingContent />;
}
