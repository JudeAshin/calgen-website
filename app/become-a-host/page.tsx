import type { Metadata } from 'next';
import BecomeAHostContent from './become-a-host-content';

export const metadata: Metadata = {
  title: 'Become a Host',
  description:
    'Turn your time into income with Calgen. Set your own hours, earn 100-300 per hour, and get instant payouts. Apply to become a host today.',
};

export default function BecomeAHostPage() {
  return <BecomeAHostContent />;
}