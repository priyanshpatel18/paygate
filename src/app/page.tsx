'use client';

import AnimatedCounter from '@/components/AnimatedCounter';
import { Button } from '@/components/ui/button';
import { usePrivy } from '@privy-io/react-auth';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const { ready } = usePrivy();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-block px-3 py-1 bg-card border border-border rounded-full mb-8 text-sm text-muted-foreground"
          >
            x402 Payment Gateway
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
          >
            One Line. Instant Revenue.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            Accept Solana payments instantly. No smart contracts, no complexity.
            Just simple pay-per-request monetization.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                className="font-medium gap-2"
                disabled={!ready}
                onClick={() => router.push('/dashboard')}
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                variant="outline"
                className="font-medium"
                onClick={() => window.open('https://x402.gitbook.io/x402', '_blank')}
              >
                View Docs
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-card border border-border rounded-lg p-6 text-left">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FE5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FEBB2C]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C840]" />
                </div>
                <span className="text-xs text-muted-foreground ml-auto">Terminal</span>
              </div>
              <pre className="text-sm">
                <code>
                  <span className="text-muted-foreground"># Your original API</span>{'\n'}
                  <span className="text-foreground">https://myapi.com/endpoint</span>{'\n\n'}
                  <span className="text-muted-foreground"># Wrap it with PayGate</span>{'\n'}
                  <span className="text-foreground">https://paygate.solixdb.xyz/endpoint</span>
                </code>
              </pre>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border"
      >
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold mb-1">
              <AnimatedCounter end={1247} suffix="+" />
            </div>
            <div className="text-sm text-muted-foreground">APIs</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">
              <AnimatedCounter end={523} suffix="K+" />
            </div>
            <div className="text-sm text-muted-foreground">Transactions</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">
              <AnimatedCounter end={99} suffix=".9%" />
            </div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">
              <span className="text-muted-foreground">&lt;</span>
              <AnimatedCounter end={100} suffix="ms" />
            </div>
            <div className="text-sm text-muted-foreground">Response</div>
          </div>
        </div>
      </motion.section>

      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-foreground" />
              <span className="font-semibold text-lg">PayGate</span>
            </div>

            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link
                href="https://github.com/SolixDB/paygate"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                GitHub
              </Link>
              <a
                href="https://twitter.com/solixdb"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Twitter
              </a>
            </div>

            <Button
              variant="link"
              className="flex items-center gap-2 text-sm text-muted-foreground"
              onClick={() => {
                router.push('/status');
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>All systems operational</span>
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2025 PayGate. Powered by x402 Protocol.
          </div>
        </div>
      </footer>
    </div>
  );
}
