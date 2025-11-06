"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Copy,
  ExternalLink,
  HelpCircle,
  Loader2,
  Plus
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface FormData {
  title: string;
  description: string;
  url: string;
  price: string;
  testMode: boolean;
  requestType: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
}

interface FormErrors {
  title?: string;
  description?: string;
  url?: string;
  price?: string;
  general?: string;
}

interface ApiResponse {
  success: boolean;
  data?: {
    id: string;
    wrappedUrl: string;
    title: string;
    price: number;
  };
  error?: string;
}

export default function NewAPIPage() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    url: "",
    price: "0.01",
    testMode: true,
    requestType: "GET",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdApi, setCreatedApi] = useState<ApiResponse["data"] | null>(
    null
  );
  const [apiError, setApiError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.url.trim()) {
      newErrors.url = "URL is required";
    } else {
      try {
        const url = new URL(formData.url);
        if (!["http:", "https:"].includes(url.protocol)) {
          newErrors.url = "URL must use HTTP or HTTPS protocol";
        }
      } catch {
        newErrors.url = "Please enter a valid URL";
      }
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0.01) {
      newErrors.price = "Price must be at least $0.01";
    } else if (price > 1000) {
      newErrors.price = "Price cannot exceed $1000";
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
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("url", formData.url.trim());
      formDataToSend.append("price", formData.price);
      formDataToSend.append("testMode", String(formData.testMode));
      formDataToSend.append("requestType", formData.requestType);

      const response = await fetch("/api/apis", {
        method: "POST",
        body: formDataToSend,
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create API");
      }

      if (data.success && data.data) {
        setCreatedApi(data.data);
        setFormData({
          title: "",
          description: "",
          url: "",
          price: "0.01",
          testMode: true,
          requestType: "GET",
        });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error creating API:", error);
      setApiError(
        error instanceof Error
          ? error.message
          : "Failed to create API. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle field changes
  const handleFieldChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
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
    <div className="h-screen bg-background overflow-auto">
      <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 gap-2"
            onClick={() => (window.location.href = "/apis")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to APIs
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
            Add New API
          </h1>
          <p className="text-sm text-muted-foreground">
            Monetize your API endpoint and start earning instantly
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
                <AlertDescription className="text-destructive">
                  {apiError}
                </AlertDescription>
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
              className="bg-card border-2 border-primary/50 rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold text-lg">
                  API Created Successfully!
                </span>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
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
                      {copiedUrl ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => (window.location.href = "/apis")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View All APIs
                  </Button>
                  <Button className="flex-1" onClick={() => setCreatedApi(null)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another
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
              onSubmit={handleSubmit}
              className="bg-card border border-border rounded-xl p-6 space-y-5"
            >
              {/* Tab-like header */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium border-b-2 border-primary text-primary"
                >
                  URL
                </button>
              </div>

              {/* URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Enter URL to monetize <span className="text-destructive">*</span>
                </label>
                <Input
                  type="url"
                  placeholder="https://api.example.com/endpoint"
                  value={formData.url}
                  onChange={(e) => handleFieldChange("url", e.target.value)}
                  disabled={isSubmitting}
                  className={errors.url ? "border-destructive" : ""}
                />
                {errors.url && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.url}
                  </p>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Title (optional)</label>
                <Input
                  placeholder="My Weather API"
                  value={formData.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  disabled={isSubmitting}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (optional)</label>
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 border border-border rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  placeholder="Brief description of what your API does..."
                  value={formData.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  disabled={isSubmitting}
                  maxLength={500}
                />
              </div>

              {/* Request Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Request Type <span className="text-destructive">*</span>
                </label>
                <Select
                  value={formData.requestType}
                  onValueChange={(value) => handleFieldChange("requestType", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Price */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Price USDC <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="1000"
                    placeholder="0.01"
                    value={formData.price}
                    onChange={(e) => handleFieldChange("price", e.target.value)}
                    disabled={isSubmitting}
                    className={errors.price ? "border-destructive" : ""}
                  />
                  {errors.price && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.price}
                    </p>
                  )}
                </div>

                {/* Test Mode */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Test Mode</label>
                    <div className="group relative">
                      <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-popover border border-border rounded-lg shadow-lg text-xs z-10">
                        When enabled, uses devnet USDC on Solana devnet for testing
                        purposes. Disable for mainnet production payments.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 h-10">
                    <button
                      type="button"
                      onClick={() =>
                        handleFieldChange("testMode", !formData.testMode)
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.testMode ? "bg-primary" : "bg-muted"
                        }`}
                      disabled={isSubmitting}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${formData.testMode ? "translate-x-6" : "translate-x-1"
                          }`}
                      />
                    </button>
                    <span className="text-sm text-muted-foreground">
                      {formData.testMode ? "Devnet" : "Mainnet"}
                    </span>
                  </div>
                </div>
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
                    Creating...
                  </>
                ) : (
                  "Add Link"
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}