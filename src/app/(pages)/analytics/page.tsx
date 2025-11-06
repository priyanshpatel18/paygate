"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  const [stats] = useState({
    totalAPIs: 0,
    activeAPIs: 0,
    totalRequests: 0,
    totalRevenue: 0,
  });

  const hasAPIs = stats.totalAPIs > 0;

  return (
    <div className="h-screen bg-background overflow-auto">
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-1"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            {hasAPIs
              ? "Comprehensive insights and performance metrics for your APIs"
              : "Create your first API to unlock detailed analytics and performance insights"}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="group bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all duration-300">
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Total Revenue
                </span>
                {hasAPIs && (
                  <span className="text-xs font-medium text-primary">Live</span>
                )}
              </div>
              <div className="text-2xl md:text-3xl font-bold tracking-tight">
                ${stats.totalRevenue.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                {hasAPIs ? "All endpoints" : "Start earning"}
              </div>
            </div>
          </div>

          <div className="group bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all duration-300">
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Total Requests
                </span>
                {hasAPIs && (
                  <span className="text-xs font-medium text-primary">Live</span>
                )}
              </div>
              <div className="text-2xl md:text-3xl font-bold tracking-tight">
                {stats.totalRequests.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {hasAPIs ? `${stats.activeAPIs} active` : "No activity"}
              </div>
            </div>
          </div>

          <div className="group bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all duration-300">
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground">
                Active APIs
              </span>
              <div className="text-2xl md:text-3xl font-bold tracking-tight">
                {stats.activeAPIs}
              </div>
              <div className="text-xs text-muted-foreground">
                of {stats.totalAPIs} total
              </div>
            </div>
          </div>

          <div className="group bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all duration-300">
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground">
                Avg. Revenue
              </span>
              <div className="text-2xl md:text-3xl font-bold tracking-tight">
                $
                {stats.totalAPIs > 0
                  ? (stats.totalRevenue / stats.totalAPIs).toFixed(2)
                  : "0.00"}
              </div>
              <div className="text-xs text-muted-foreground">Per endpoint</div>
            </div>
          </div>
        </motion.div>

        {/* Coming Soon Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5 rounded-2xl" />
          <div className="absolute inset-0 bg-card/50 backdrop-blur-3xl rounded-2xl border border-border" />
          
          <div className="relative z-10 p-6 space-y-5">
            <div className="max-w-3xl mx-auto text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                </span>
                In Development
              </div>

              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Advanced Analytics Suite
              </h2>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Powerful insights to understand your API performance, track revenue trends, 
                and optimize your monetization strategy
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-5xl mx-auto">
              {[
                { title: "Revenue Trends", desc: "Track earnings over time" },
                { title: "Request Analytics", desc: "Monitor usage patterns" },
                { title: "Performance Metrics", desc: "Success & error rates" },
                { title: "Response Times", desc: "Latency monitoring" },
                { title: "Top Consumers", desc: "Most active users" },
                { title: "Geographic Insights", desc: "Traffic sources" },
              ].map((feature) => (
                <motion.div
                  key={feature.title}
                  className="group bg-card/50 backdrop-blur-sm border border-border rounded-lg p-3 hover:border-primary/30 transition-all duration-300"
                >
                  <h3 className="font-semibold mb-0.5 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="text-center pt-2 space-y-2">
              {!hasAPIs ? (
                <>
                  <Button
                    onClick={() => (window.location.href = "/apis/new")}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Your First API
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Analytics available once you deploy your first API
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-primary">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Your APIs are live and collecting data
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Detailed charts coming soon
                  </p>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions - Only show if has APIs */}
        {hasAPIs && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <button
              onClick={() => (window.location.href = "/apis")}
              className="group bg-card border border-border rounded-xl p-5 text-left hover:border-primary/30 transition-all duration-300"
            >
              <div className="space-y-2">
                <h3 className="text-base font-semibold group-hover:text-primary transition-colors">
                  Manage APIs
                </h3>
                <p className="text-sm text-muted-foreground">
                  Configure your {stats.totalAPIs} {stats.totalAPIs === 1 ? "endpoint" : "endpoints"}
                </p>
                <div className="text-xs font-medium text-primary group-hover:translate-x-1 transition-transform inline-block pt-1">
                  View all →
                </div>
              </div>
            </button>

            <button
              onClick={() => (window.location.href = "/apis/new")}
              className="group bg-card border border-border rounded-xl p-5 text-left hover:border-primary/30 transition-all duration-300"
            >
              <div className="space-y-2">
                <h3 className="text-base font-semibold group-hover:text-primary transition-colors">
                  Add New API
                </h3>
                <p className="text-sm text-muted-foreground">
                  Monetize another endpoint
                </p>
                <div className="text-xs font-medium text-primary group-hover:translate-x-1 transition-transform inline-block pt-1">
                  Create API →
                </div>
              </div>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}