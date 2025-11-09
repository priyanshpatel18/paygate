import { User } from "@privy-io/react-auth";

export const syncUser = async (privyUser: User) => {
  try {
    // Extract all wallet addresses from linkedAccounts
    const walletAddresses = privyUser.linkedAccounts
      .filter((account) => account.type === "wallet")
      .map((account) => account.address);

    // Get unique wallet addresses (in case there are duplicates)
    const uniqueWallets = [...new Set(walletAddresses)];

    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        privyId: privyUser.id,
        wallets: uniqueWallets,
        primaryWallet: privyUser.wallet?.address || null,
        email: privyUser.email?.address || null,
        linkedAccounts: privyUser.linkedAccounts,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to sync user");
    }
  } catch (error) {
    console.error("Error syncing user:", error);
  }
};