"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Edit,
  ExternalLink,
  Globe,
  Link2,
  Loader2,
  Pause,
  Play,
  RefreshCw,
  Save,
  Server,
  Shield,
  Trash2Icon,
  XCircle,
  Zap
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface API {
  id: string;
  name: string | null;
  description: string | null;
  endpoint: string;
  wrappedUrl: string;
  pricePerRequest: number;
  status: string;
  totalRequests: number;
  successRequests: number;
  totalRevenue: number;
  imageUrl: string | null;
  testMode: boolean;
  requestType: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  createdAt: string;
  updatedAt: string;
}

export default function APIManagementPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { user } = usePrivy();

  const [api, setApi] = useState<API | null>(null);
  // const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    pricePerRequest: 0,
    testMode: false,
    requestType: "GET" as API["requestType"],
  });

  useEffect(() => {
    if (id && user?.id) {
      fetchAPI();
    }
  }, [id, user?.id]);

  useEffect(() => {
    if (api) {
      setEditForm({
        name: api.name || "",
        description: api.description || "",
        pricePerRequest: api.pricePerRequest,
        testMode: api.testMode,
        requestType: api.requestType,
      });
    }
  }, [api]);

  const fetchAPI = async () => {
    if (!user?.id || !id) return;

    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/apis");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch APIs");

      const selected = data.data.find((api: API) => api.id === id);
      if (!selected) throw new Error("API not found");

      setApi(selected);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load API");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchAPI()]);
    setIsRefreshing(false);
  };

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDeleteAPI = async () => {
    if (!user?.id || !api) return;
    const confirmed = confirm(`Are you sure you want to delete "${api.name}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/apis/${api.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-privy-id": user.id,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete API");

      alert("API deleted successfully!");
      router.push("/apis");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete API");
    }
  };

  const handleToggleStatus = async () => {
    if (!user?.id || !api) return;

    try {
      const newStatus = api.status === "active" ? "paused" : "active";
      const res = await fetch(`/api/apis/${api.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-privy-id": user.id,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to toggle status");

      setApi({ ...api, status: newStatus });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to toggle status");
    }
  };

  const handleSaveChanges = async () => {
    if (!user?.id || !api) return;

    try {
      setIsSaving(true);
      const res = await fetch(`/api/apis/${api.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-privy-id": user.id,
        },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update API");

      setApi(data.data);
      setIsEditing(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update API");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading API details...</p>
        </div>
      </div>
    );
  }

  if (error || !api) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <Alert className="border-destructive bg-destructive/10 max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription>{error || "API not found"}</AlertDescription>
        </Alert>
        <div className="text-center mt-6">
          <Button variant="outline" onClick={() => router.push("/apis")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to APIs
          </Button>
        </div>
      </div>
    );
  }

  const successRate = api.totalRequests > 0
    ? ((api.successRequests / api.totalRequests) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/apis")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold">{api.name || "Unnamed API"}</h1>
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${api.status === "active"
                  ? "bg-green-500/10 text-green-500"
                  : "bg-yellow-500/10 text-yellow-500"
                  }`}
              >
                {api.status}
              </span>
              {api.testMode && (
                <span className="px-3 py-1 text-xs rounded-full font-medium bg-blue-500/10 text-blue-500">
                  Test Mode
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {api.description || "No description provided"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {!isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant={api.status === "active" ? "outline" : "default"}
                onClick={handleToggleStatus}
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
                    Activate
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAPI}
                className="gap-2"
              >
                <Trash2Icon className="w-4 h-4" /> Delete
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </Button>
            </>
          )}
        </div>
      </motion.div>

      {/* Edit Form */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-card border border-border rounded-xl p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold mb-4">Edit API Settings</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">API Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="My API"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Request Type</label>
              <select
                value={editForm.requestType}
                onChange={(e) => setEditForm({ ...editForm, requestType: e.target.value as API["requestType"] })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Price Per Request ($)</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={editForm.pricePerRequest}
                onChange={(e) => setEditForm({ ...editForm, pricePerRequest: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Environment</label>
              <div className="flex items-center gap-2 p-1 bg-muted rounded-lg w-fit">
                <button
                  type="button"
                  onClick={() => setEditForm({ ...editForm, testMode: false })}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${!editForm.testMode
                    ? "bg-primary shadow-sm text-background"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Mainnet
                </button>
                <button
                  type="button"
                  onClick={() => setEditForm({ ...editForm, testMode: true })}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${editForm.testMode
                    ? "bg-primary shadow-sm text-background"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Devnet
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-20"
              placeholder="API description..."
            />
          </div>
        </motion.div>
      )}

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4"
      >
        <StatCard
          icon={<CheckCircle2 className="w-4 h-4 text-primary" />}
          label="Success Rate"
          value={`${successRate}%`}
          trend={`${api.successRequests}/${api.totalRequests} successful`}
        />
        <StatCard
          icon={<Zap className="w-4 h-4 text-primary" />}
          label="Price Per Request"
          value={`$${api.pricePerRequest.toFixed(3)}`}
        />
      </motion.div>

      {/* API Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Endpoint Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Server className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Endpoint Configuration</h3>
          </div>

          <DetailRow label="Request Type" value={api.requestType} icon={<Globe className="w-4 h-4" />} />

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Original Endpoint</label>
            <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-lg">
              <code className="flex-1 text-xs font-mono break-all">{api.endpoint}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(api.endpoint, "endpoint")}
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Wrapped URL (Monetized)</label>
            <div className="flex items-center gap-2 bg-primary/5 p-3 rounded-lg border border-primary/20">
              <code className="flex-1 text-xs font-mono break-all text-primary">{api.wrappedUrl}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(api.wrappedUrl, "wrapped")}
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {copied === "wrapped" ? "✓ Copied to clipboard!" : "Share this URL with your customers"}
            </p>
          </div>

          <Button variant="outline" className="w-full gap-2">
            <ExternalLink className="w-4 h-4" />
            Test Endpoint
          </Button>
        </motion.div>

        {/* Metadata */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">API Metadata</h3>
          </div>

          <DetailRow label="API ID" value={api.id} icon={<Link2 className="w-4 h-4" />} copyable />
          <DetailRow
            label="Created"
            value={new Date(api.createdAt).toLocaleString()}
            icon={<Calendar className="w-4 h-4" />}
          />
          <DetailRow
            label="Last Updated"
            value={new Date(api.updatedAt).toLocaleString()}
            icon={<Clock className="w-4 h-4" />}
          />
          <DetailRow
            label="Status"
            value={api.status === "active" ? "Active" : "Paused"}
            icon={api.status === "active" ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-yellow-500" />}
          />
          <DetailRow
            label="Test Mode"
            value={api.testMode ? "Enabled" : "Disabled"}
            icon={<Shield className="w-4 h-4" />}
          />
        </motion.div>
      </div>
    </div>
  );
}

const StatCard = ({
  icon,
  label,
  value,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
}) => (
  <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
    <div className="text-2xl font-bold mb-1">{value}</div>
    {trend && <div className="text-xs text-muted-foreground">{trend}</div>}
  </div>
);

const DetailRow = ({
  label,
  value,
  icon,
  copyable,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  copyable?: boolean;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-right">{value}</span>
        {copyable && (
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 w-6 p-0">
            <Copy className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
};