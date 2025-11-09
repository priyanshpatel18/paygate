"use client";

import { Spinner } from "@/components/ui/8bit/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePrivy } from "@privy-io/react-auth";
import { motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Copy,
  DollarSign,
  ExternalLink,
  Loader2,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  TrendingUp,
  Filter,
  SortAsc,
  Download,
  Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";

interface API {
  id: string;
  name: string;
  endpoint: string;
  originalUrl: string;
  wrappedUrl: string;
  pricePerRequest: number;
  status: "active" | "paused";
  requests: number;
  revenue: number;
  successRate: number;
  createdAt: string;
  description?: string;
}

interface StatsData {
  totalAPIs: number;
  activeAPIs: number;
  totalRequests: number;
  totalRevenue: number;
}

interface ApiResponse {
  success: boolean;
  data?: API[];
  stats?: StatsData;
  error?: string;
}

type SortField = "name" | "requests" | "revenue" | "createdAt" | "successRate";
type SortOrder = "asc" | "desc";
type FilterStatus = "all" | "active" | "paused";

export default function APIsListPage() {
  const { user } = usePrivy();
  const [apis, setApis] = useState<API[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalAPIs: 0,
    activeAPIs: 0,
    totalRequests: 0,
    totalRevenue: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<{
    id: string;
    action: string;
  } | null>(null);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch APIs on mount
  useEffect(() => {
    if (user?.id) {
      fetchAPIs();
    }
  }, [user?.id]);

  // Fetch all APIs
  const fetchAPIs = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/apis", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-privy-id": user.id,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch APIs");
      }

      if (data.success && data.data) {
        const normalized = data.data.map((api: API): API => ({
          ...api,
          status: api.status === "active" ? "active" : "paused",
        }));

        setApis(normalized);

        if (data.stats) {
          setStats(data.stats);
        } else {
          calculateStats(normalized);
        }
      }
    } catch (err) {
      console.error("Error fetching APIs:", err);
      setError(err instanceof Error ? err.message : "Failed to load APIs");
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAPIs();
    setIsRefreshing(false);
  };

  // Calculate statistics
  const calculateStats = (apiList: API[]) => {
    const totalAPIs = apiList.length;
    const activeAPIs = apiList.filter((api) => api.status === "active").length;
    const totalRequests = apiList.reduce((sum, api) => sum + api.requests, 0);
    const totalRevenue = apiList.reduce((sum, api) => sum + api.revenue, 0);

    setStats({
      totalAPIs,
      activeAPIs,
      totalRequests,
      totalRevenue,
    });
  };

  // Copy URL to clipboard
  const handleCopyUrl = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Toggle API status
  const handleToggleStatus = async (api: API) => {
    if (!user?.id) return;

    try {
      setActionLoading({ id: api.id, action: "toggle" });
      const newStatus: "active" | "paused" = api.status === "active" ? "paused" : "active";

      const response = await fetch(`/api/apis/${api.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-privy-id": user.id,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update API status");
      }

      const updatedApis = apis.map((a) =>
        a.id === api.id ? { ...a, status: newStatus } : a
      );
      setApis(updatedApis);
      calculateStats(updatedApis);
    } catch (err) {
      console.error("Error toggling API status:", err);
      alert(err instanceof Error ? err.message : "Failed to update API status");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete API
  const handleDeleteAPI = async (api: API) => {
    if (!user?.id) return;

    if (
      !confirm(
        `Are you sure you want to delete "${api.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setActionLoading({ id: api.id, action: "delete" });

      const response = await fetch(`/api/apis/${api.id}`, {
        method: "DELETE",
        headers: {
          "x-privy-id": user.id,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete API");
      }

      const updatedApis = apis.filter((a) => a.id !== api.id);
      setApis(updatedApis);
      calculateStats(updatedApis);
    } catch (err) {
      console.error("Error deleting API:", err);
      alert(err instanceof Error ? err.message : "Failed to delete API");
    } finally {
      setActionLoading(null);
    }
  };

  // Export APIs data
  const handleExport = () => {
    const csvContent = [
      ["Name", "Endpoint", "Status", "Price", "Requests", "Revenue", "Success Rate", "Created"],
      ...filteredAndSortedAPIs.map((api) => [
        api.name,
        api.endpoint,
        api.status,
        api.pricePerRequest,
        api.requests,
        api.revenue,
        api.successRate + "%",
        new Date(api.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `paygate-apis-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // Sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Filter and sort APIs
  const filteredAndSortedAPIs = apis
    .filter((api) => {
      // Status filter
      if (filterStatus !== "all" && api.status !== filterStatus) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          api.name.toLowerCase().includes(query) ||
          api.endpoint.toLowerCase().includes(query) ||
          api.wrappedUrl.toLowerCase().includes(query) ||
          api.description?.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (sortField === "createdAt") {
        const aTime = new Date(aVal as string).getTime();
        const bTime = new Date(bVal as string).getTime();
        return sortOrder === "asc" ? aTime - bTime : bTime - aTime;
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold mb-1">My APIs</h1>
          <p className="text-muted-foreground">
            Manage and monitor your monetized endpoints
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          {apis.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          )}
          <Button
            className="gap-2"
            onClick={() => (window.location.href = "/apis/new")}
          >
            <Plus className="w-4 h-4" />
            Add New API
          </Button>
        </div>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <Alert className="border-destructive bg-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive flex items-center justify-between">
              <span>{error}</span>
              <Button variant="ghost" size="sm" onClick={fetchAPIs} className="h-7">
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Spinner className="size-20 text-primary" />
          <p className="text-sm text-muted-foreground">Loading your APIs...</p>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Total APIs</span>
              </div>
              <div className="text-2xl font-bold">{stats.totalAPIs}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {stats.activeAPIs} active, {stats.totalAPIs - stats.activeAPIs}{" "}
                paused
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Total Requests
                </span>
              </div>
              <div className="text-2xl font-bold">
                {stats.totalRequests.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stats.activeAPIs > 0
                  ? `Avg ${Math.round(stats.totalRequests / stats.activeAPIs)} per API`
                  : "No active APIs"}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <DollarSign className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Total Revenue
                </span>
              </div>
              <div className="text-2xl font-bold">
                ${stats.totalRevenue.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stats.totalRequests > 0
                  ? `$${(stats.totalRevenue / stats.totalRequests).toFixed(4)} per request`
                  : "No requests yet"}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Avg. Price</span>
              </div>
              <div className="text-2xl font-bold">
                $
                {apis.length > 0
                  ? (
                    apis.reduce((sum, api) => sum + api.pricePerRequest, 0) /
                    apis.length
                  ).toFixed(3)
                  : "0.00"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Per request across all APIs
              </div>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search APIs by name, endpoint, or URL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {(filterStatus !== "all" || sortField !== "createdAt") && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/20 rounded-full">
                      •
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-card border border-border rounded-lg p-4 space-y-4"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Status Filter */}
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">
                      Status
                    </label>
                    <div className="flex gap-2">
                      {(["all", "active", "paused"] as FilterStatus[]).map(
                        (status) => (
                          <Button
                            key={status}
                            variant={filterStatus === status ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilterStatus(status)}
                            className="capitalize"
                          >
                            {status}
                          </Button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Sort By */}
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">
                      Sort By
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { field: "createdAt", label: "Date" },
                        { field: "name", label: "Name" },
                        { field: "requests", label: "Requests" },
                        { field: "revenue", label: "Revenue" },
                        { field: "successRate", label: "Success" },
                      ].map(({ field, label }) => (
                        <Button
                          key={field}
                          variant={sortField === field ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleSort(field as SortField)}
                          className="gap-1"
                        >
                          {label}
                          {sortField === field && (
                            <SortAsc
                              className={`w-3 h-3 transition-transform ${sortOrder === "desc" ? "rotate-180" : ""
                                }`}
                            />
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Results count */}
                <div className="text-sm text-muted-foreground">
                  Showing {filteredAndSortedAPIs.length} of {apis.length} APIs
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* APIs List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {filteredAndSortedAPIs.map((api, index) => (
              <motion.div
                key={api.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.3) }}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: API Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-semibold">{api.name}</h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${api.status === "active"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-yellow-500/10 text-yellow-500"
                              }`}
                          >
                            {api.status}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {new Date(api.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground font-mono mt-1">
                          {api.endpoint}
                        </p>
                        {api.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {api.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground block">Price</span>
                        <span className="font-medium">
                          ${api.pricePerRequest.toFixed(3)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">
                          Requests
                        </span>
                        <span className="font-medium">
                          {api.requests.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">
                          Revenue
                        </span>
                        <span className="font-medium">
                          ${api.revenue.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">
                          Success Rate
                        </span>
                        <span
                          className={`font-medium ${api.successRate >= 95
                            ? "text-green-500"
                            : api.successRate >= 80
                              ? "text-yellow-500"
                              : "text-red-500"
                            }`}
                        >
                          {api.successRate}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm bg-muted/50 p-3 rounded-lg">
                      <span className="text-muted-foreground shrink-0">
                        Wrapped URL:
                      </span>
                      <code className="flex-1 text-xs font-mono truncate">
                        {api.wrappedUrl}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyUrl(api.id, api.wrappedUrl)}
                        className="h-7 gap-1 shrink-0"
                      >
                        <Copy className="w-3 h-3" />
                        {copiedId === api.id ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 flex-1 lg:flex-none"
                      onClick={() =>
                        (window.location.href = `/apis/${api.id}`)
                      }
                    >
                      <ExternalLink className="w-4 h-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 flex-1 lg:flex-none"
                      onClick={() => handleToggleStatus(api)}
                      disabled={
                        actionLoading?.id === api.id &&
                        actionLoading?.action === "toggle"
                      }
                    >
                      {actionLoading?.id === api.id &&
                        actionLoading?.action === "toggle" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : api.status === "active" ? (
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-destructive hover:text-destructive flex-1 lg:flex-none"
                      onClick={() => handleDeleteAPI(api)}
                      disabled={
                        actionLoading?.id === api.id &&
                        actionLoading?.action === "delete"
                      }
                    >
                      {actionLoading?.id === api.id &&
                        actionLoading?.action === "delete" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Empty State */}
            {filteredAndSortedAPIs.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                {searchQuery || filterStatus !== "all" ? (
                  <>
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                      No APIs found matching your filters
                    </p>
                    <div className="flex gap-2 justify-center">
                      {searchQuery && (
                        <Button
                          variant="outline"
                          onClick={() => setSearchQuery("")}
                        >
                          Clear Search
                        </Button>
                      )}
                      {filterStatus !== "all" && (
                        <Button
                          variant="outline"
                          onClick={() => setFilterStatus("all")}
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Activity className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No APIs Yet
                    </h3>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                      Get started by wrapping your first API and start earning
                      with Solana payments
                    </p>
                    <Button
                      onClick={() => (window.location.href = "/apis/new")}
                      size="lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First API
                    </Button>
                  </>
                )}
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}