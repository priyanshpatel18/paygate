"use client";

import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { ReactNode } from "react";
import { ThemeProvider } from './ThemeProvider';

interface ProviderProps {
  children: ReactNode;
}

export default function Providers({ children }: ProviderProps) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID || ''}
      config={{
        appearance: { walletChainType: 'solana-only' },
        externalWallets: {
          solana: { connectors: toSolanaWalletConnectors() }
        },
        embeddedWallets: {
          solana: {
            createOnLogin: "all-users"
          }
        }
      }}
    >
      <ThemeProvider attribute="class" defaultTheme="solana">
        {children}
      </ThemeProvider>
    </PrivyProvider>
  );
}