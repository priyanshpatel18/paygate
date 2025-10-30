"use client";

import AnimatedCounter from "@/components/AnimatedCounter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Mock data - replace with real API calls
const revenueData = [
  { date: "Jan 24", revenue: 0, requests: 0 },
  { date: "Jan 25", revenue: 12.5, requests: 250 },
  { date: "Jan 26", revenue: 28.3, requests: 566 },
  { date: "Jan 27", revenue: 45.2, requests: 904 },
  { date: "Jan 28", revenue: 67.8, requests: 1356 },
  { date: "Jan 29", revenue: 89.4, requests: 1788 },
  { date: "Jan 30", revenue: 124.7, requests: 2494 },
];

const recentTransactions = [
  { id: "1", time: "2 mins ago", endpoint: "/api/weather", amount: 0.05, status: "success" },
  { id: "2", time: "5 mins ago", endpoint: "/api/translate", amount: 0.02, status: "success" },
  { id: "3", time: "12 mins ago", endpoint: "/api/sentiment", amount: 0.03, status: "success" },
  { id: "4", time: "18 mins ago", endpoint: "/api/weather", amount: 0.05, status: "success" },
  { id: "5", time: "23 mins ago", endpoint: "/api/ocr", amount: 0.10, status: "success" },
];

const topAPIs = [
  { name: "Weather API", endpoint: "/api/weather", requests: 1247, revenue: 62.35 },
  { name: "Translation API", endpoint: "/api/translate", requests: 892, revenue: 35.68 },
  { name: "Sentiment Analysis", endpoint: "/api/sentiment", requests: 456, revenue: 18.24 },
];

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("7d");

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your overview</p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/apis">
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-sm text-muted-foreground mb-2">Total Revenue</div>
          <div className="text-3xl font-bold mb-1">
            $<AnimatedCounter end={124} suffix=".70" />
          </div>
          <div className="text-xs text-muted-foreground">
            <AnimatedCounter end={2} suffix=".49" /> SOL
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-sm text-muted-foreground mb-2">Active APIs</div>
          <div className="text-3xl font-bold mb-1">
            <AnimatedCounter end={3} />
          </div>
          <div className="text-xs text-muted-foreground">Monetized endpoints</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-sm text-muted-foreground mb-2">Requests Today</div>
          <div className="text-3xl font-bold mb-1">
            <AnimatedCounter end={2494} />
          </div>
          <div className="text-xs text-muted-foreground">+18% from yesterday</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-sm text-muted-foreground mb-2">Success Rate</div>
          <div className="text-3xl font-bold mb-1">
            <AnimatedCounter end={99} suffix=".2%" />
          </div>
          <div className="text-xs text-muted-foreground">Payment confirmations</div>
        </div>
      </motion.div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-1">Revenue Overview</h2>
            <p className="text-sm text-muted-foreground">Track your earnings over time</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={timeRange === "7d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("7d")}
            >
              7D
            </Button>
            <Button
              variant={timeRange === "30d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("30d")}
            >
              30D
            </Button>
            <Button
              variant={timeRange === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("all")}
            >
              All
            </Button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border))" opacity={0.4} />
            <XAxis
              dataKey="date"
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--popover-foreground)",
              }}
              labelStyle={{ color: "var(--muted-foreground)" }}
              formatter={(value: number) => [`${value.toFixed(2)}`, "Revenue"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--chart-1)"
              strokeWidth={2.5}
              fill="var(--chart-1)"
              fillOpacity={0.15}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--chart-2)" }}
            />
          </AreaChart>
        </ResponsiveContainer>

      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/analytics" className="gap-1">
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex-1">
                  <div className="font-medium text-sm mb-1">{tx.endpoint}</div>
                  <div className="text-xs text-muted-foreground">{tx.time}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-medium">${tx.amount.toFixed(2)}</div>
                  <div className="text-xs text-green-500">Success</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Performing APIs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Top Performing APIs</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/apis" className="gap-1">
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {topAPIs.map((api, index) => (
              <div key={api.endpoint} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm mb-1">{api.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{api.endpoint}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm font-medium">${api.revenue.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">{api.requests} requests</div>
                  </div>
                </div>
                {index < topAPIs.length - 1 && <div className="border-b border-border" />}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start h-auto py-4 group" asChild>
            <Link href="/apis/new">
              <div className="text-left">
                <div className="font-medium mb-1">Add New API</div>
                <div className="text-xs text-muted-foreground group-hover:text-muted">Start monetizing another endpoint</div>
              </div>
            </Link>
          </Button>

          <Button variant="outline" className="justify-start h-auto py-4 group" asChild>
            <Link href="/analytics">
              <div className="text-left">
                <div className="font-medium mb-1">View Analytics</div>
                <div className="text-xs text-muted-foreground group-hover:text-muted">Deep dive into your metrics</div>
              </div>
            </Link>
          </Button>

          <Button variant="outline" className="justify-start h-auto py-4 group" asChild>
            <Link href="/settings">
              <div className="text-left">
                <div className="font-medium mb-1">Manage Wallet</div>
                <div className="text-xs text-muted-foreground group-hover:text-muted">Update payment preferences</div>
              </div>
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}