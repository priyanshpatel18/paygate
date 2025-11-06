"use client";

import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";
import { useExportWallet } from "@privy-io/react-auth/solana";
import { motion } from "framer-motion";
import { Copy, ExternalLink, LogOut, Wallet } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const { user, logout, linkWallet } = usePrivy();
  const [copiedAddress, setCopiedAddress] = useState(false);
  const { exportWallet } = useExportWallet();

  const embeddedWallet = user?.wallet;
  const email = user?.email?.address;

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleExportWallet = async () => {
    if (!embeddedWallet) return;

    try {
      await exportWallet();
    } catch (error) {
      console.error("Export wallet error:", error);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and wallet preferences
          </p>
        </div>

        {/* Account Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-lg p-6 space-y-6"
        >
          <div>
            <h2 className="text-lg font-semibold mb-4">Account</h2>

            <div className="space-y-4">
              {/* Email */}
              {email && (
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Email</div>
                    <div className="font-medium">{email}</div>
                  </div>
                </div>
              )}

              {/* Embedded Wallet */}
              {embeddedWallet && (
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Wallet Address</div>
                    <div className="font-mono text-sm">
                      {truncateAddress(embeddedWallet.address)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyAddress(embeddedWallet.address)}
                      className="gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      {copiedAddress ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `https://solscan.io/account/${embeddedWallet.address}`,
                          "_blank"
                        )
                      }
                      className="gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Wallet Management */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Wallet Management</h2>

          <div className="space-y-3">
            {embeddedWallet && (
              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={handleExportWallet}
              >
                <Wallet className="w-4 h-4" />
                Export Private Key
              </Button>
            )}

            {!embeddedWallet && (
              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={linkWallet}
              >
                <Wallet className="w-4 h-4" />
                Create Wallet
              </Button>
            )}
          </div>

          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              Your wallet is managed by Privy. Private keys are encrypted and stored securely.
              Export your key to use with other wallets.
            </p>
          </div>
        </motion.div>

        {/* Earnings Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Earnings Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Total Earned</div>
              <div className="text-2xl font-bold">$0.00</div>
              <div className="text-xs text-muted-foreground mt-1">0 SOL</div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">This Month</div>
              <div className="text-2xl font-bold">$0.00</div>
              <div className="text-xs text-muted-foreground mt-1">0 requests</div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Active APIs</div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-xs text-muted-foreground mt-1">Start monetizing</div>
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-destructive/50 rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold mb-4 text-destructive">Danger Zone</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium mb-1">Sign Out</div>
                <div className="text-sm text-muted-foreground">
                  Sign out of your Paygate account
                </div>
              </div>
              <Button
                variant="destructive"
                onClick={logout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}