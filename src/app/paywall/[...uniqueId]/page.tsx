"use client";

import { Spinner } from "@/components/ui/8bit/spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Api } from "@/generated/prisma";
import { syncUser } from "@/lib/syncUser";
import { useLogin, useLogout, usePrivy } from "@privy-io/react-auth";
import { Lock } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaywallPage() {
  const { uniqueId } = useParams();
  const resourceId = Array.isArray(uniqueId)
    ? uniqueId.join("/")
    : uniqueId ?? "resource";
  const resourceUrl = `https://paygate.solixdb.xyz/${resourceId}`;

  const { authenticated, ready, user } = usePrivy();
  const { logout } = useLogout();
  const { login } = useLogin({
    onComplete: async ({ user }) => {
      await syncUser(user);
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  const [apiData, setApiData] = useState<Api | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch API details from backend
  useEffect(() => {
    const fetchApi = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/apis/${resourceId}`);

        const data = await res.json();
        if (data.success) {
          setApiData(data.data);
        } else {
          console.error("API not found:", data.error);
        }
      } catch (err) {
        console.error("Error fetching API info:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetch402Error = async () => {
      try {
        const res = await fetch(`http://localhost:5555/api/paywall/${resourceId}`);

        const data = await res.json();
        console.log(data.accepts[0]);

      } catch (err) {
        console.error("Error fetching API info:", err);
      } finally {
        setLoading(false);
      }
    }

    if (resourceId) {
      fetchApi()
      fetch402Error();
    }
  }, [resourceId]);

  const formattedPrice = apiData
    ? `$${apiData.pricePerRequest.toFixed(6)} USD`
    : "$—";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-muted bg-card text-card-foreground shadow-sm">
        <CardHeader className="text-center space-y-1">
          <h1 className="text-xl font-semibold">
            Paygate{" "}
            <span className="text-muted-foreground text-sm">by SolixDB</span>
          </h1>
          <CardTitle className="text-lg font-bold">
            {apiData ? apiData.name : "Access Protected Content"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Payment for GET{" "}
            <span className="font-mono break-all">{resourceUrl}</span>
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading ? (
            <div className="text-center text-muted-foreground py-6">
              <Spinner className="size-16 text-primary" />
            </div>
          ) : apiData && (
            <>
              <div className="rounded-md bg-muted/30 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Resource:</span>
                  <span className="font-mono truncate text-right">
                    {apiData.endpoint}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-semibold">{formattedPrice}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {ready ? (
                  authenticated ? (
                    <>
                      <Button className="w-full" onClick={() => logout()}>
                        Disconnect Wallet
                      </Button>
                    </>
                  ) : (
                    <Button className="w-full" onClick={() => login()}>
                      Connect Wallet
                    </Button>
                  )
                ) : (
                  <Button className="w-full" disabled>
                    Loading...
                  </Button>
                )}

                <Button
                  className="w-full"
                  disabled={!authenticated}
                  variant="secondary"
                  onClick={() => alert("Payment flow coming soon...")}
                >
                  Pay Now
                </Button>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-3 text-center text-sm text-muted-foreground">
          <div className="w-full rounded-md bg-muted/30 py-2 flex items-center gap-2 justify-center">
            <Lock className="w-3 h-3" />
            <span>People are accessing content right now</span>
          </div>
          <p className="text-xs">
            Secured by{" "}
            <a href="/dashboard" className="text-primary hover:underline">
              Paygate
            </a>{" "}
            |{" "}
            <a
              href="https://www.x402.org/"
              target="_blank"
              className="text-primary hover:underline"
            >
              Learn about x402
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
