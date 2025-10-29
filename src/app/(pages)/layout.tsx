"use client";

import { AppSidebar } from "@/components/AppSidebar";
import { Spinner } from "@/components/ui/8bit/spinner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { usePrivy } from "@privy-io/react-auth";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap } from "lucide-react";
import Link from "next/link";
import React from "react";

interface PagesLayoutProps {
  children: React.ReactNode;
}

export default function PagesLayout({
  children,
}: Readonly<PagesLayoutProps>) {
  const { authenticated, ready, login } = usePrivy();

  if (!ready) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Spinner className="size-22" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="w-16 h-16 bg-foreground rounded-lg mx-auto mb-6 flex items-center justify-center"
            >
              <Shield className="w-8 h-8 text-background" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold mb-3"
            >
              Welcome to PayGate
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground"
            >
              Sign in to start monetizing your APIs with Solana payments
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <button
              onClick={login}
              className="w-full group px-6 py-4 bg-foreground text-background rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              Sign In with Privy
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">
                  Why sign in?
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg">
                <Zap className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm mb-1">Instant Setup</div>
                  <div className="text-xs text-muted-foreground">
                    Connect your wallet and start monetizing in 60 seconds
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg">
                <Shield className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm mb-1">Secure & Private</div>
                  <div className="text-xs text-muted-foreground">
                    Your keys, your data. We never store your private keys
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs text-muted-foreground mt-8"
          >
            By signing in, you agree to our <Link href="/terms" className="hover:underline">Terms of Service</Link> and <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}