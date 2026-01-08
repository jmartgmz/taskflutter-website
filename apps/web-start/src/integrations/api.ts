import { useAuth0 } from '@auth0/auth0-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const BASE_URL = import.meta.env.VITE_BACKEND_URL as string;
const AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE as string;

type Json = Record<string, unknown> | Array<unknown>;

// Wake up the backend on Render (free tier spins down after 15 min)
export async function wakeUpBackend() {
  console.log('Waking up backend at', BASE_URL);
  const startTime = Date.now();

  // Log every 5 seconds while waiting
  const interval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    console.log(`Still waiting for backend... ${elapsed}s elapsed`);
  }, 5000);

  try {
    await fetch(`${BASE_URL}/`, { method: 'GET' });
    clearInterval(interval);
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    console.log(`Backend is awake! Took ${totalTime}s`);
  } catch (error) {
    clearInterval(interval);
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    console.log(`Backend wake-up ping sent after ${totalTime}s`);
  }
}

class RedirectingForAuthError extends Error {
  constructor() {
    super('redirecting-for-auth');
    this.name = 'RedirectingForAuthError';
  }
}

/** Shared client: get a token safely and make an authorized request */
export function useApiClient() {
  const {
    getAccessTokenSilently,
    loginWithRedirect,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth0();

  const getToken = async (scope?: string) => {
    try {
      return await getAccessTokenSilently({
        authorizationParams: { audience: AUDIENCE, scope },
      });
    } catch (e: any) {
      if (e?.error === 'consent_required' || e?.error === 'login_required') {
        await loginWithRedirect({
          authorizationParams: { audience: AUDIENCE, scope },
          appState: { returnTo: window.location.pathname },
        });
        // After redirect, the component re-mounts and the next call will succeed.
        throw new RedirectingForAuthError();
      }
      throw e;
    }
  };

  const request = async <T = unknown>(
    path: string,
    init: RequestInit & { scope?: string } = {},
  ): Promise<T> => {
    const token = await getToken(init.scope);
    const res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return (await res.json()) as T;
  };

  return { request, isAuthenticated, isAuthLoading };
}

export function useApiQuery<T>(
  queryKey: ReadonlyArray<unknown>,
  path: string,
  init: RequestInit & { scope?: string } = {},
) {
  const { request, isAuthenticated, isAuthLoading } = useApiClient();
  const isEnabled = isAuthenticated && !isAuthLoading;
  const q = useQuery({
    queryKey,
    queryFn: () => request<T>(path, init),
    enabled: isEnabled,
    retry(failureCount, error) {
      if (error instanceof RedirectingForAuthError) return false;
      return failureCount < 3;
    },
    // Cache data for 5 minutes - data is considered fresh and won't refetch
    staleTime: 5 * 60 * 1000,
    // Keep cached data for 10 minutes even when inactive
    gcTime: 10 * 60 * 1000,
    // Don't refetch when window regains focus
    refetchOnWindowFocus: false,
    // Keep showing old data while fetching new data
    placeholderData: (prev) => prev,
  });
  const isAuthPending = isAuthLoading || !isAuthenticated;
  const showLoading = isAuthPending || q.isLoading || q.isFetching;

  return {
    ...q,
    isAuthPending,
    showLoading,
    isEnabled,
  };
}

export function useApiMutation<TInput extends Json, TOutput = unknown>(opts?: {
  /** Default scope for the token when mutating */
  scope?: string;
  /** Optionally compute the request per-variables */
  endpoint?: (variables: TInput) => { path: string; method?: string };
  /** Fallback endpoint if you don't need variables to build it */
  path?: string;
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Query keys to invalidate after success */
  invalidateKeys?: ReadonlyArray<Array<unknown>>;
}) {
  const { request } = useApiClient();
  const qc = useQueryClient();

  return useMutation<TOutput, Error, TInput>({
    mutationFn: async (variables) => {
      const endpoint = opts?.endpoint?.(variables);
      const path = endpoint?.path ?? opts?.path;
      const method = endpoint?.method ?? opts?.method ?? 'POST';

      if (!path) {
        throw new Error('Path is required for mutation');
      }

      return await request<TOutput>(path, {
        method,
        body: JSON.stringify(variables),
        scope: opts?.scope,
      });
    },
    retry(failureCount, error) {
      // Don’t retry while we’re redirecting; the page will reload anyway
      if (error instanceof RedirectingForAuthError) return false;
      return failureCount < 3;
    },
    onSuccess: async () => {
      if (opts?.invalidateKeys) {
        await Promise.all(
          opts.invalidateKeys.map((k) => qc.invalidateQueries({ queryKey: k })),
        );
      }
    },
  });
}

export type CurrentUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  firstName?: string;
  lastName?: string;
  userPoints?: number;
};

export function useCurrentUser(opts?: { scope?: string }) {
  return useApiQuery<CurrentUser>(['current-user'], '/users/me', {
    scope: opts?.scope,
  });
}
