"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  Clock,
  DollarSign,
  Download,
  MapPin,
  TrendingUp,
  Users
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

// Mock data
const revenueData = [
  { date: "Jan 24", revenue: 0, requests: 0 },
  { date: "Jan 25", revenue: 12.5, requests: 250 },
  { date: "Jan 26", revenue: 28.3, requests: 566 },
  { date: "Jan 27", revenue: 45.2, requests: 904 },
  { date: "Jan 28", revenue: 67.8, requests: 1356 },
  { date: "Jan 29", revenue: 89.4, requests: 1788 },
  { date: "Jan 30", revenue: 124.7, requests: 2494 },
];

const hourlyData = [
  { hour: "00:00", requests: 45 },
  { hour: "04:00", requests: 23 },
  { hour: "08:00", requests: 156 },
  { hour: "12:00", requests: 289 },
  { hour: "16:00", requests: 234 },
  { hour: "20:00", requests: 178 },
];

const apiPerformanceData = [
  { name: "Weather API", requests: 1247, revenue: 62.35 },
  { name: "Translation API", requests: 892, revenue: 35.68 },
  { name: "Sentiment API", requests: 456, revenue: 18.24 },
];

const geographicData = [
  { country: "United States", requests: 1432, percentage: 45 },
  { country: "United Kingdom", requests: 724, percentage: 23 },
  { country: "Germany", requests: 456, percentage: 14 },
  { country: "Canada", requests: 324, percentage: 10 },
  { country: "Others", requests: 259, percentage: 8 },
];

const topConsumers = [
  { id: "1", wallet: "7xKXt...9mPq", requests: 432, revenue: 21.6, trend: "up" },
  { id: "2", wallet: "9Bhs2...4kLm", requests: 389, revenue: 19.45, trend: "up" },
  { id: "3", wallet: "5Mnq8...7pRt", requests: 276, revenue: 13.8, trend: "down" },
  { id: "4", wallet: "3Lkp4...2bVn", requests: 198, revenue: 9.9, trend: "up" },
  { id: "5", wallet: "8Qrt5...6jWx", requests: 156, revenue: 7.8, trend: "down" },
];

const errorData = [
  { date: "Jan 24", errors: 2, total: 250 },
  { date: "Jan 25", errors: 5, total: 566 },
  { date: "Jan 26", errors: 3, total: 904 },
  { date: "Jan 27", errors: 8, total: 1356 },
  { date: "Jan 28", errors: 4, total: 1788 },
  { date: "Jan 29", errors: 6, total: 2494 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("7d");

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
          <h1 className="text-3xl font-bold mb-1">Analytics</h1>
          <p className="text-muted-foreground">Deep dive into your API performance and earnings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
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
              variant={timeRange === "90d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("90d")}
            >
              90D
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
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div className="flex items-center gap-1 text-xs text-green-500">
              <ArrowUp className="w-3 h-3" />
              12.5%
            </div>
          </div>
          <div className="text-sm text-muted-foreground mb-1">Total Revenue</div>
          <div className="text-2xl font-bold">$124.70</div>
          <div className="text-xs text-muted-foreground mt-1">+$13.89 from last period</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Activity className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex items-center gap-1 text-xs text-green-500">
              <ArrowUp className="w-3 h-3" />
              18.2%
            </div>
          </div>
          <div className="text-sm text-muted-foreground mb-1">Total Requests</div>
          <div className="text-2xl font-bold">2,494</div>
          <div className="text-xs text-muted-foreground mt-1">+384 from last period</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div className="flex items-center gap-1 text-xs text-green-500">
              <ArrowUp className="w-3 h-3" />
              2.1%
            </div>
          </div>
          <div className="text-sm text-muted-foreground mb-1">Success Rate</div>
          <div className="text-2xl font-bold">99.2%</div>
          <div className="text-xs text-muted-foreground mt-1">19 failed requests</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-muted rounded-lg">
              <Clock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-1 text-xs text-red-500">
              <ArrowDown className="w-3 h-3" />
              5.3%
            </div>
          </div>
          <div className="text-sm text-muted-foreground mb-1">Avg Response Time</div>
          <div className="text-2xl font-bold">142ms</div>
          <div className="text-xs text-muted-foreground mt-1">-8ms improvement</div>
        </div>
      </motion.div>

      {/* Revenue & Requests Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-1">Revenue & Requests Trend</h2>
            <p className="text-sm text-muted-foreground">Track your growth over time</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
            <XAxis
              dataKey="date"
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--popover-foreground)",
              }}
              labelStyle={{ color: "var(--muted-foreground)" }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="var(--chart-1)"
              strokeWidth={2.5}
              fill="var(--chart-1)"
              fillOpacity={0.15}
              dot={false}
              name="Revenue ($)"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="requests"
              stroke="var(--chart-2)"
              strokeWidth={2.5}
              fill="var(--chart-2)"
              fillOpacity={0.15}
              dot={false}
              name="Requests"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Performance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold mb-6">API Performance</h2>

          <div className="space-y-4">
            {apiPerformanceData.map((api, index) => {
              const chartColors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)'];
              const color = chartColors[index % chartColors.length];
              
              return (
                <div key={api.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-medium">{api.name}</span>
                    </div>
                    <span className="text-muted-foreground">{api.requests} requests</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(api.requests / 2595) * 100}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">
                      ${api.revenue.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Hourly Traffic */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold mb-6">Hourly Traffic Pattern</h2>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
              <XAxis
                dataKey="hour"
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
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
                cursor={{ fill: "var(--muted)" }}
              />
              <Bar dataKey="requests" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Distribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Geographic Distribution</h2>
          </div>

          <div className="space-y-3">
            {geographicData.map((location, index) => {
              const chartColors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'];
              const color = chartColors[index % chartColors.length];
              
              return (
                <div key={location.country} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{location.country}</span>
                    <span className="text-muted-foreground">
                      {location.requests} ({location.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${location.percentage}%`,
                        backgroundColor: color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Consumers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Top Consumers</h2>
          </div>

          <div className="space-y-3">
            {topConsumers.map((consumer, index) => (
              <div
                key={consumer.id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-mono text-sm font-medium">{consumer.wallet}</div>
                    <div className="text-xs text-muted-foreground">
                      {consumer.requests} requests
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-sm">${consumer.revenue.toFixed(2)}</div>
                  <div
                    className={`text-xs flex items-center gap-1 justify-end ${
                      consumer.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {consumer.trend === "up" ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                    {consumer.trend === "up" ? "Growing" : "Declining"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Error Rate & Health */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-1">System Health & Errors</h2>
            <p className="text-sm text-muted-foreground">Monitor error rates and uptime</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-500 font-medium">All Systems Operational</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={errorData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
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
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="errors"
              stroke="var(--destructive)"
              strokeWidth={2}
              dot={{ fill: "var(--destructive)", r: 4 }}
              name="Errors"
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Error Rate</div>
            <div className="text-2xl font-bold">0.8%</div>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Uptime</div>
            <div className="text-2xl font-bold">99.97%</div>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Total Errors</div>
            <div className="text-2xl font-bold">28</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}