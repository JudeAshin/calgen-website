'use client';

import { motion } from 'framer-motion';
import { Phone, Star, Coins, Signal } from 'lucide-react';

export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[280px] sm:w-[320px]">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="relative rounded-[2.75rem] border-[10px] border-neutral-900 bg-neutral-900 shadow-2xl">
          <div className="absolute left-1/2 top-0 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-neutral-900" />
          <div className="relative h-[560px] overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#04231a] to-[#0a3d2c]">
            <div className="flex items-center justify-between px-5 pt-4 text-[0.7rem] text-white/70">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <Signal className="h-3 w-3" />
                <span>5G</span>
                <span className="ml-1">100%</span>
              </div>
            </div>
            <div className="px-5 pt-6">
              <p className="text-xs font-medium text-primary">Online Now</p>
              <h3 className="mt-1 text-lg font-bold text-white">Talk to someone</h3>
            </div>
            <div className="mt-4 space-y-3 px-5">
              {HOSTS.map((h, i) => (
                <motion.div
                  key={h.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur-sm"
                >
                  <div className="relative">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ background: h.color }}
                    >
                      {h.initials}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#0a3d2c] bg-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{h.name}</p>
                    <div className="flex items-center gap-1 text-[0.7rem] text-white/60">
                      <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                      <span>{h.rating}</span>
                      <span>&middot;</span>
                      <span>{h.lang}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-primary/20 px-2 py-1 text-[0.7rem] font-semibold text-primary">
                    <Coins className="h-3 w-3" />
                    {h.rate}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="absolute bottom-6 left-5 right-5">
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30"
              >
                <Phone className="h-4 w-4" />
                Start a Call
              </motion.div>
            </div>
          </div>
        </div>
        <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-primary/20 blur-3xl" />
      </motion.div>
    </div>
  );
}

const HOSTS = [
  { name: 'Aarav', initials: 'AA', rating: '4.9', lang: 'Hindi', rate: '2/min', color: 'linear-gradient(135deg,#25D366,#00B894)' },
  { name: 'Priya', initials: 'PR', rating: '4.8', lang: 'Tamil', rate: '3/min', color: 'linear-gradient(135deg,#00B894,#0FB9B1)' },
  { name: 'Kabir', initials: 'KB', rating: '5.0', lang: 'English', rate: '1/min', color: 'linear-gradient(135deg,#0FB9B1,#25D366)' },
];