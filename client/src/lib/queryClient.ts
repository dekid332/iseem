import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { 
  isSupabaseAvailable, 
  getSupabaseLeaderboard, 
  submitSupabaseScore,
  type LeaderboardEntry,
  type InsertLeaderboardEntry 
} from "./supabase";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

// Enhanced API functions that can use either Supabase or local API
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  if (isSupabaseAvailable()) {
    console.log('Using Supabase for leaderboard');
    return await getSupabaseLeaderboard();
  } else {
    console.log('Using local API for leaderboard');
    const response = await apiRequest('GET', '/api/leaderboard');
    return await response.json();
  }
}

export async function submitScore(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry> {
  if (isSupabaseAvailable()) {
    console.log('Using Supabase for score submission');
    return await submitSupabaseScore(entry);
  } else {
    console.log('Using local API for score submission');
    const response = await apiRequest('POST', '/api/leaderboard', entry);
    return await response.json();
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
