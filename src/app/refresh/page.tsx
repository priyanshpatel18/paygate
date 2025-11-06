'use client';

import { Spinner } from '@/components/ui/8bit/spinner';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function RefreshContent() {
  const { getAccessToken } = usePrivy();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    

    const refreshSession = async () => {
      try {
        const token = await getAccessToken();

        if (token) {
          const redirectUri = searchParams.get('redirect_uri') || '/dashboard';
          router.push(redirectUri);
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error refreshing session:', error);
        router.push('/dashboard');
      } finally {
        setIsRefreshing(false);
      }
    };

    refreshSession();
  }, [getAccessToken, router, searchParams]);

  if (isRefreshing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="size-20 text-primary" />
      </div>
    );
  }

  return null;
}

export default function RefreshPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Spinner className="size-20 text-primary" />
        </div>
      }
    >
      <RefreshContent />
    </Suspense>
  );
}
