"use client";

import { motion } from "framer-motion";

export default function BillingPage() {
  return (
    <div className="min-h-screen p-6 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Billing</h1>
          <p className="text-muted-foreground">
            Manage your subscription and payment details
          </p>
        </div>

        {/* Beta Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-lg p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-3">Free During Beta</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            PayGate is currently free for all beta users. No charges, no credit card required.
            Help us improve the platform and enjoy unlimited API monetization.
          </p>
          <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
            <span className="text-sm font-medium">Beta Access</span>
          </div>
        </motion.div>

        {/* Future Pricing Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Future Pricing</h2>
          
          <div className="space-y-6">
            <div className="pb-4 border-b border-border">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-medium">Platform Fee</span>
                <span className="text-2xl font-bold">5%</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Per transaction after beta period ends
              </p>
            </div>

            <div className="pb-4 border-b border-border">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-medium">Monthly Base</span>
                <span className="text-2xl font-bold">$29</span>
              </div>
              <p className="text-sm text-muted-foreground">
                For API hosting and infrastructure
              </p>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-medium">Free Tier</span>
                <span className="text-2xl font-bold">$100</span>
              </div>
              <p className="text-sm text-muted-foreground">
                First $100 in revenue each month will remain free
              </p>
            </div>
          </div>
        </motion.div>

        {/* Beta Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold mb-4">What You Get Now</h2>
          
          <div className="space-y-3">
            <div className="py-2 border-b border-border">
              <span className="font-medium">Unlimited APIs</span>
            </div>
            <div className="py-2 border-b border-border">
              <span className="font-medium">Unlimited Transactions</span>
            </div>
            <div className="py-2 border-b border-border">
              <span className="font-medium">Real-time Analytics</span>
            </div>
            <div className="py-2 border-b border-border">
              <span className="font-medium">Priority Support</span>
            </div>
            <div className="py-2">
              <span className="font-medium">Early Feature Access</span>
            </div>
          </div>
        </motion.div>

        {/* Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-muted-foreground"
        >
          <p>
            Beta users will be notified 30 days before any pricing changes take effect.
            Your feedback helps shape the future of PayGate.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}