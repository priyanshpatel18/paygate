"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Copy,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  ArrowLeft,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  originalUrl: string;
  endpoint: string;
  pricePerRequest: string;
  description: string;
}

interface FormErrors {
  name?: string;
  originalUrl?: string;
  endpoint?: string;
  pricePerRequest?: string;
  description?: string;
  general?: string;
}

interface ApiResponse {
  success: boolean;
  data?: {
    id: string;
    wrappedUrl: string;
    name: string;
    endpoint: string;
    pricePerRequest: number;
  };
  error?: string;
}

export default function NewAPIPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    originalUrl: "",
    endpoint: "",
    pricePerRequest: "0.01",
    description: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdApi, setCreatedApi] = useState<ApiResponse["data"] | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const router = useRouter();
  
  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "API name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "API name must be at least 3 characters";
    }

    if (!formData.originalUrl.trim()) {
      newErrors.originalUrl = "Original API URL is required";
    } else {
      try {
        const url = new URL(formData.originalUrl);
        if (!["http:", "https:"].includes(url.protocol)) {
          newErrors.originalUrl = "URL must use HTTP or HTTPS protocol";
        }
      } catch {
        newErrors.originalUrl = "Please enter a valid URL";
      }
    }

    if (!formData.endpoint.trim()) {
      newErrors.endpoint = "Endpoint path is required";
    } else if (!formData.endpoint.startsWith("/")) {
      newErrors.endpoint = "Endpoint must start with /";
    }

    const price = parseFloat(formData.pricePerRequest);
    if (isNaN(price) || price < 0.01) {
      newErrors.pricePerRequest = "Price must be at least $0.01";
    } else if (price > 1000) {
      newErrors.pricePerRequest = "Price cannot exceed $1000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await fetch("/api/apis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          originalUrl: formData.originalUrl.trim(),
          endpoint: formData.endpoint.trim(),
          pricePerRequest: parseFloat(formData.pricePerRequest),
          description: formData.description.trim() || undefined,
        }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create API");
      }

      if (data.success && data.data) {
        setCreatedApi(data.data);
        // Reset form
        setFormData({
          name: "",
          originalUrl: "",
          endpoint: "",
          pricePerRequest: "0.01",
          description: "",
        });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error creating API:", error);
      setApiError(
        error instanceof Error ? error.message : "Failed to create API. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle field changes with validation
  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button variant="ghost" size="sm" className="mb-4 gap-2" onClick={() => router.push("/apis")}>
            <ArrowLeft className="w-4 h-4" />
            Back to APIs
          </Button>
          <h1 className="text-3xl font-bold mb-1">Add New API</h1>
          <p className="text-muted-foreground">
            Wrap your existing API and start earning in minutes
          </p>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {apiError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert className="border-destructive bg-destructive/10">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive">{apiError}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Display */}
        <AnimatePresence>
          {createdApi && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-card border-2 border-green-500/50 rounded-lg p-6 space-y-4"
            >
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold text-lg">API Created Successfully!</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    API Name
                  </label>
                  <div className="px-3 py-2 bg-muted rounded-lg text-sm">
                    {createdApi.name}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Your Wrapped URL
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm font-mono break-all">
                      {createdApi.wrappedUrl}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(createdApi.wrappedUrl)}
                      className="gap-2 shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                      {copiedUrl ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <div className="text-sm text-blue-500">
                      <p className="font-medium mb-2">Next Steps:</p>
                      <ol className="space-y-1 list-decimal list-inside">
                        <li>Share this URL with your users</li>
                        <li>They&apos;ll be prompted to pay before accessing your API</li>
                        <li>Monitor earnings and usage in your dashboard</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.location.href = '/apis'}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View All APIs
                  </Button>
                  <Button className="flex-1" onClick={() => setCreatedApi(null)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another API
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <AnimatePresence>
          {!createdApi && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSubmit}
              className="bg-card border border-border rounded-lg p-6 space-y-6"
            >
              {/* API Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  API Name <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="e.g., Weather API"
                  value={formData.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  disabled={isSubmitting}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  A friendly name to identify your API
                </p>
              </div>

              {/* Original URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Original API URL <span className="text-destructive">*</span>
                </label>
                <Input
                  type="url"
                  placeholder="https://api.example.com/v1/weather"
                  value={formData.originalUrl}
                  onChange={(e) => handleFieldChange("originalUrl", e.target.value)}
                  disabled={isSubmitting}
                  className={errors.originalUrl ? "border-destructive" : ""}
                />
                {errors.originalUrl && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.originalUrl}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  The full URL of your existing API endpoint
                </p>
              </div>

              {/* Endpoint Path */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Endpoint Path <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="/api/weather"
                  value={formData.endpoint}
                  onChange={(e) => handleFieldChange("endpoint", e.target.value)}
                  disabled={isSubmitting}
                  className={errors.endpoint ? "border-destructive" : ""}
                />
                {errors.endpoint && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.endpoint}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  The path that will be used in your wrapped URL
                </p>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Price Per Request (USD) <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="1000"
                  placeholder="0.01"
                  value={formData.pricePerRequest}
                  onChange={(e) => handleFieldChange("pricePerRequest", e.target.value)}
                  disabled={isSubmitting}
                  className={errors.pricePerRequest ? "border-destructive" : ""}
                />
                {errors.pricePerRequest && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.pricePerRequest}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  How much to charge for each API call (min: $0.01, max: $1000)
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (Optional)</label>
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 border border-border rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Brief description of what your API does..."
                  value={formData.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  disabled={isSubmitting}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.description.length}/500
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating API...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Wrapped API
                  </>
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold mb-4">How It Works</h2>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-semibold">
                1
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Wrap Your API</p>
                <p>
                  We create a proxy URL that sits in front of your existing API
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-semibold">
                2
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Users Pay First</p>
                <p>
                  When called, users receive a 402 payment request with Solana payment
                  details
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-semibold">
                3
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Request Forwarded</p>
                <p>
                  After payment confirmation, we forward the request to your original
                  API
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-semibold">
                4
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">You Get Paid</p>
                <p>Earnings are automatically sent to your Solana wallet</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
