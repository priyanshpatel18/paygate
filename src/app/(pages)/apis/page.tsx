"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Activity,
  Copy,
  DollarSign,
  ExternalLink,
  Pause,
  Play,
  Plus,
  Search,
  Trash2,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock data
const mockAPIs = [
  {
    id: "1",
    name: "Weather API",
    endpoint: "/api/weather",
    originalUrl: "https://myapi.com/weather",
    wrappedUrl: "https://paygate.solixdb.xyz/abc123/weather",
    pricePerRequest: 0.05,
    status: "active",
    requests: 1247,
    revenue: 62.35,
    successRate: 99.2,
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    name: "Translation API",
    endpoint: "/api/translate",
    originalUrl: "https://myapi.com/translate",
    wrappedUrl: "https://paygate.solixdb.xyz/def456/translate",
    pricePerRequest: 0.02,
    status: "active",
    requests: 892,
    revenue: 35.68,
    successRate: 98.7,
    createdAt: "2024-01-18"
  },
  {
    id: "3",
    name: "Sentiment Analysis",
    endpoint: "/api/sentiment",
    originalUrl: "https://myapi.com/sentiment",
    wrappedUrl: "https://paygate.solixdb.xyz/ghi789/sentiment",
    pricePerRequest: 0.03,
    status: "paused",
    requests: 456,
    revenue: 18.24,
    successRate: 97.5,
    createdAt: "2024-01-20"
  }
];

// APIs Listing Page Component
function APIsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredAPIs = mockAPIs.filter(api =>
    api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    api.endpoint.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold mb-1">My APIs</h1>
          <p className="text-muted-foreground">Manage and monitor your monetized endpoints</p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/apis/new">
            <Plus className="w-4 h-4" />
            Add New API
          </Link>
        </Button>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Total APIs</span>
          </div>
          <div className="text-2xl font-bold">{mockAPIs.length}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {mockAPIs.filter(a => a.status === "active").length} active
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Total Requests</span>
          </div>
          <div className="text-2xl font-bold">
            {mockAPIs.reduce((sum, api) => sum + api.requests, 0).toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground mt-1">This month</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Total Revenue</span>
          </div>
          <div className="text-2xl font-bold">
            ${mockAPIs.reduce((sum, api) => sum + api.revenue, 0).toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">This month</div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search APIs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </motion.div>

      {/* APIs List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredAPIs.map((api, index) => (
          <motion.div
            key={api.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left: API Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{api.name}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${api.status === "active"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-yellow-500/10 text-yellow-500"
                          }`}
                      >
                        {api.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono mt-1">
                      {api.endpoint}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Price:</span>
                    <span className="ml-2 font-medium">${api.pricePerRequest}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Requests:</span>
                    <span className="ml-2 font-medium">{api.requests.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Revenue:</span>
                    <span className="ml-2 font-medium">${api.revenue.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Success:</span>
                    <span className="ml-2 font-medium">{api.successRate}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Wrapped URL:</span>
                  <code className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    {api.wrappedUrl}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyUrl(api.id, api.wrappedUrl)}
                    className="h-7 gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedId === api.id ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex lg:flex-col gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  {api.status === "active" ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Resume
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredAPIs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No APIs found</p>
            <Button asChild>
              <Link href="/apis/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First API
              </Link>
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}


// Add New API Page Component
function NewAPIPage() {
  const [formData, setFormData] = useState({
    name: "",
    originalUrl: "",
    endpoint: "",
    pricePerRequest: "0.01",
    description: ""
  });

  const [generatedUrl, setGeneratedUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate a mock wrapped URL
    const randomId = Math.random().toString(36).substring(7);
    setGeneratedUrl(`https://paygate.solixdb.xyz/${randomId}${formData.endpoint}`);
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-1">Add New API</h1>
          <p className="text-muted-foreground">
            Wrap your existing API and start earning in minutes
          </p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-lg p-6 space-y-6"
        >
          {/* API Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">API Name</label>
            <Input
              placeholder="e.g., Weather API"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">
              A friendly name to identify your API
            </p>
          </div>

          {/* Original URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Original API URL</label>
            <Input
              placeholder="https://myapi.com/weather"
              value={formData.originalUrl}
              onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">
              The full URL of your existing API endpoint
            </p>
          </div>

          {/* Endpoint Path */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Endpoint Path</label>
            <Input
              placeholder="/api/weather"
              value={formData.endpoint}
              onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">
              The path that will be used in your wrapped URL
            </p>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Price Per Request (USD)</label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.01"
              value={formData.pricePerRequest}
              onChange={(e) => setFormData({ ...formData, pricePerRequest: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">
              How much to charge for each API call
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description (Optional)</label>
            <textarea
              className="w-full min-h-[100px] px-3 py-2 border border-border rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Brief description of what your API does..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg">
            Create Wrapped API
          </Button>
        </motion.form>

        {/* Generated URL Display */}
        {generatedUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-primary/50 rounded-lg p-6 space-y-4"
          >
            <div className="flex items-center gap-2 text-green-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium">API Created Successfully!</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Your Wrapped URL</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm font-mono">
                  {generatedUrl}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(generatedUrl)}
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h3 className="text-sm font-medium">Next Steps:</h3>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Share this URL with your users</li>
                <li>They&apos;ll be prompted to pay before accessing your API</li>
                <li>Monitor earnings in your dashboard</li>
              </ol>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" asChild className="flex-1">
                <Link href="/apis">View All APIs</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </motion.div>
        )}

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold mb-4">How It Works</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-medium">
                1
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Wrap Your API</p>
                <p>We create a proxy URL that sits in front of your existing API</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-medium">
                2
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Users Pay First</p>
                <p>When called, users receive a 402 payment request with Solana payment details</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-medium">
                3
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Request Forwarded</p>
                <p>After payment confirmation, we forward the request to your original API</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-medium">
                4
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">You Get Paid</p>
                <p>Earnings are automatically sent to your Solana wallet</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Main App Component with routing simulation
export default function App() {
  const [currentPage, setCurrentPage] = useState<"list" | "new">("list");

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Simple Navigation */}
      <div className="border-b border-border p-4 flex gap-4 items-center">
        <button
          onClick={() => setCurrentPage("list")}
          className={`px-4 py-2 rounded-lg transition-colors ${currentPage === "list"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
            }`}
        >
          APIs List
        </button>
        <button
          onClick={() => setCurrentPage("new")}
          className={`px-4 py-2 rounded-lg transition-colors ${currentPage === "new"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
            }`}
        >
          Add New API
        </button>
      </div>

      {/* Page Content */}
      {currentPage === "list" ? <APIsPage /> : <NewAPIPage />}
    </div>
  );
}