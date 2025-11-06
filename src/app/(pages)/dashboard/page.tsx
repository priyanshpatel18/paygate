"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const hasAPIs = false; // Change this based on actual API data

  return (
    <div className="h-screen bg-background overflow-auto">
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              {hasAPIs ? "Welcome back! Here's your overview" : "Start your API monetization journey"}
            </p>
          </div>
          <Button className="gap-2" asChild>
            <Link href="/apis/new">
              <Plus className="w-4 h-4" />
              Add New API
            </Link>
          </Button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-muted-foreground">Total Revenue</span>
                {hasAPIs && <span className="text-xs font-medium text-primary">Live</span>}
              </div>
              <div className="text-2xl md:text-3xl font-bold tracking-tight">$0.00</div>
              <div className="text-xs text-muted-foreground">0.00 SOL</div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground">Active APIs</span>
              <div className="text-2xl md:text-3xl font-bold tracking-tight">0</div>
              <div className="text-xs text-muted-foreground">Monetized endpoints</div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground">Requests Today</span>
              <div className="text-2xl md:text-3xl font-bold tracking-tight">0</div>
              <div className="text-xs text-muted-foreground">No activity yet</div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground">Success Rate</span>
              <div className="text-2xl md:text-3xl font-bold tracking-tight">--</div>
              <div className="text-xs text-muted-foreground">Awaiting data</div>
            </div>
          </div>
        </motion.div>

        {/* Main Content - Charts & Data Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-2xl" />
          <div className="absolute inset-0 bg-card/50 backdrop-blur-3xl rounded-2xl border border-border" />
          
          <div className="relative z-10 p-6 space-y-5">
            <div className="max-w-3xl mx-auto text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                </span>
                Ready to Launch
              </div>

              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Start Monetizing Your APIs
              </h2>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Create your first API endpoint and start earning. Real-time analytics, 
                instant payments, and comprehensive insights await.
              </p>
            </div>

            {/* Preview Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {/* Revenue Chart Preview */}
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">Revenue Overview</h3>
                  <div className="text-xs text-muted-foreground">Coming Soon</div>
                </div>
                <div className="relative h-32 bg-muted/30 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-end justify-around p-4 opacity-30">
                    {[40, 60, 45, 70, 55, 80, 65].map((height, i) => (
                      <div
                        key={i}
                        className="w-8 bg-primary/50 rounded-t"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center space-y-1">
                      <TrendingUp className="w-6 h-6 text-primary mx-auto" />
                      <p className="text-xs text-muted-foreground">Track your earnings</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions Preview */}
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">Recent Transactions</h3>
                  <div className="text-xs text-muted-foreground">Coming Soon</div>
                </div>
                <div className="relative h-32 bg-muted/30 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 space-y-2 p-3 opacity-30">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="h-2 w-24 bg-primary/50 rounded" />
                        <div className="h-2 w-12 bg-primary/50 rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center space-y-1">
                      <div className="w-6 h-6 border-2 border-primary rounded-full mx-auto flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      </div>
                      <p className="text-xs text-muted-foreground">View all transactions</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top APIs Preview */}
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">Top Performing APIs</h3>
                  <div className="text-xs text-muted-foreground">Coming Soon</div>
                </div>
                <div className="relative h-32 bg-muted/30 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 space-y-2 p-3 opacity-30">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-1">
                        <div className="h-2 w-32 bg-primary/50 rounded" />
                        <div className="h-1.5 w-20 bg-primary/30 rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center space-y-1">
                      <div className="text-lg font-bold text-primary">#1</div>
                      <p className="text-xs text-muted-foreground">Rank your best APIs</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics Preview */}
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">Performance Metrics</h3>
                  <div className="text-xs text-muted-foreground">Coming Soon</div>
                </div>
                <div className="relative h-32 bg-muted/30 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-2 gap-2 p-3 opacity-30">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="space-y-1">
                        <div className="h-1.5 w-16 bg-primary/50 rounded" />
                        <div className="h-3 w-12 bg-primary/50 rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold text-primary">99%</div>
                      <p className="text-xs text-muted-foreground">Success rate tracking</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pt-3 space-y-3">
              <Button size="lg" asChild className="gap-2">
                <Link href="/apis/new">
                  <Plus className="w-4 h-4" />
                  Create Your First API
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                All features unlock once you create your first endpoint
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <button
            onClick={() => (window.location.href = "/apis/new")}
            className="group bg-card border border-border rounded-xl p-5 text-left hover:border-primary/30 transition-all duration-300"
          >
            <div className="space-y-2">
              <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
                Add New API
              </h3>
              <p className="text-xs text-muted-foreground">
                Start monetizing another endpoint
              </p>
              <div className="text-xs font-medium text-primary group-hover:translate-x-1 transition-transform inline-block pt-1">
                Get started →
              </div>
            </div>
          </button>

          <button
            onClick={() => (window.location.href = "/analytics")}
            className="group bg-card border border-border rounded-xl p-5 text-left hover:border-primary/30 transition-all duration-300"
          >
            <div className="space-y-2">
              <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
                View Analytics
              </h3>
              <p className="text-xs text-muted-foreground">
                Deep dive into your metrics
              </p>
              <div className="text-xs font-medium text-primary group-hover:translate-x-1 transition-transform inline-block pt-1">
                Explore →
              </div>
            </div>
          </button>

          <button
            onClick={() => (window.location.href = "/settings")}
            className="group bg-card border border-border rounded-xl p-5 text-left hover:border-primary/30 transition-all duration-300"
          >
            <div className="space-y-2">
              <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
                Manage Wallet
              </h3>
              <p className="text-xs text-muted-foreground">
                Update payment preferences
              </p>
              <div className="text-xs font-medium text-primary group-hover:translate-x-1 transition-transform inline-block pt-1">
                Configure →
              </div>
            </div>
          </button>
        </motion.div>
      </div>
    </div>
  );
}