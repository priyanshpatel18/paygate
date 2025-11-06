import prisma from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

type LinkedAccount = {
  address: string;
  type: string;
  chainType?: string;
  walletClientType?: string;
  connectorType?: string;
  firstVerifiedAt?: string;
  latestVerifiedAt?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { privyId, wallets, primaryWallet, email, linkedAccounts } = body as {
      privyId: string;
      wallets?: string[];
      primaryWallet?: string;
      email?: string;
      linkedAccounts?: LinkedAccount[];
    };

    if (!privyId) {
      return NextResponse.json(
        { success: false, error: "privyId is required" },
        { status: 400 }
      );
    }
    
    // Step 1: Upsert the user
    const user = await prisma.user.upsert({
      where: { privyId },
      update: {
        primaryWallet: primaryWallet || null,
        email: email || null,
      },
      create: {
        privyId,
        primaryWallet: primaryWallet || null,
        email: email || null,
      },
    });

    // Step 2: Handle wallets if provided
    if (wallets && Array.isArray(wallets) && wallets.length > 0) {
      // Get existing wallets for this user
      const existingWallets = await prisma.wallet.findMany({
        where: { userId: user.id },
      });

      const existingAddressMap = new Map(
        existingWallets.map((w) => [w.address, w])
      );

      // Prepare wallet operations
      const walletsToCreate = [];
      const walletsToUpdate = [];

      for (const address of wallets) {
        // Find matching linked account for metadata
        const linkedAccount = linkedAccounts?.find(
          (acc: LinkedAccount) => acc.address === address && acc.type === "wallet"
        );

        const walletData = {
          address,
          chainType: linkedAccount?.chainType || "solana",
          walletClientType: linkedAccount?.walletClientType || null,
          connectorType: linkedAccount?.connectorType || null,
          firstVerifiedAt: linkedAccount?.firstVerifiedAt
            ? new Date(linkedAccount.firstVerifiedAt)
            : null,
          latestVerifiedAt: linkedAccount?.latestVerifiedAt
            ? new Date(linkedAccount.latestVerifiedAt)
            : null,
          isPrimary: address === primaryWallet,
        };

        if (existingAddressMap.has(address)) {
          // Wallet exists, prepare update
          walletsToUpdate.push({
            where: {
              id: existingAddressMap.get(address)!.id,
            },
            data: {
              chainType: walletData.chainType,
              walletClientType: walletData.walletClientType,
              connectorType: walletData.connectorType,
              latestVerifiedAt: walletData.latestVerifiedAt,
              isPrimary: walletData.isPrimary,
            },
          });
        } else {
          // New wallet, prepare creation
          walletsToCreate.push({
            ...walletData,
            userId: user.id,
          });
        }
      }

      // Execute wallet operations
      if (walletsToCreate.length > 0) {
        await prisma.wallet.createMany({
          data: walletsToCreate,
          skipDuplicates: true,
        });
      }

      // Update existing wallets one by one
      for (const update of walletsToUpdate) {
        await prisma.wallet.update(update);
      }

      // Optional: Remove wallets that are no longer in linkedAccounts
      const currentAddresses = new Set(wallets);
      const walletsToRemove = existingWallets.filter(
        (w) => !currentAddresses.has(w.address)
      );

      if (walletsToRemove.length > 0) {
        await prisma.wallet.deleteMany({
          where: {
            id: {
              in: walletsToRemove.map((w) => w.id),
            },
          },
        });
      }
    }

    // Step 3: Fetch and return updated user with wallets
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        wallets: {
          orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
        },
        apis: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sync user" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const privyId = request.headers.get("x-privy-id");

    if (!privyId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { privyId },
      include: {
        apis: {
          orderBy: { createdAt: "desc" },
        },
        wallets: {
          orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}