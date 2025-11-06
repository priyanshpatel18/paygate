"use client";
import { motion } from "framer-motion";

export default function BillingPage() {
  return (
    <div className="h-screen bg-background overflow-auto">
      <div className="p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Billing</h1>
            <p className="text-muted-foreground">
              Manage your subscription and payment details
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Beta Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 bg-card border border-border rounded-xl p-6 text-center"
            >
              <h2 className="text-2xl font-bold mb-2">Free During Beta</h2>
              <p className="text-sm text-muted-foreground mb-4 max-w-2xl mx-auto">
                Paygate is currently free for all beta users. No charges, no credit card required. 
                Help us improve the platform and enjoy unlimited API monetization.
              </p>
              <div className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-lg">
                <span className="text-sm font-medium text-primary">Beta Access Active</span>
              </div>
            </motion.div>

            {/* Future Pricing */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Future Pricing</h2>
              <div className="space-y-4">
                <div className="pb-3 border-b border-border">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-medium text-sm">Platform Fee</span>
                    <span className="text-2xl font-bold">5%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Per transaction after beta
                  </p>
                </div>

                <div className="pb-3 border-b border-border">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-medium text-sm">Monthly Base</span>
                    <span className="text-2xl font-bold">$29</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    API hosting & infrastructure
                  </p>
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-medium text-sm">Free Tier</span>
                    <span className="text-2xl font-bold">$100</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    First $100/month remains free
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Beta Benefits */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <h2 className="text-lg font-semibold mb-4">What You Get Now</h2>
              <div className="space-y-2">
                {[
                  "Unlimited APIs",
                  "Unlimited Transactions",
                  "Real-time Analytics",
                  "Priority Support",
                  "Early Feature Access",
                ].map((benefit) => (
                  <div
                    key={benefit}
                    className="group py-2.5 border-b border-border last:border-0 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">
                        {benefit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-muted/50 border border-border rounded-lg p-4 text-center"
          >
            <p className="text-xs text-muted-foreground leading-relaxed">
              Beta users will be notified 30 days before any pricing changes take effect. 
              Your feedback helps shape the future of Paygate.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}