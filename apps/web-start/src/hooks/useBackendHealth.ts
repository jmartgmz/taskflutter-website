import { useEffect, useState } from 'react';

const BASE_URL = import.meta.env.VITE_BACKEND_URL as string;

/**
 * Hook to check if the backend is available and healthy.
 * Polls the backend every few seconds until it responds successfully.
 */
export function useBackendHealth() {
  const [isHealthy, setIsHealthy] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let mounted = true;
    let retryTimeoutId: NodeJS.Timeout;
    const startTime = Date.now();
    
    // Update elapsed time every second
    const elapsedInterval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    const checkHealth = async () => {
      if (!mounted) return;

      try {
        // Try to ping the backend root endpoint
        const controller = new AbortController();
        const abortTimeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(`${BASE_URL}/`, {
          method: 'GET',
          signal: controller.signal,
        });

        clearTimeout(abortTimeoutId);

        if (response.ok) {
          console.log('✅ Backend is healthy');
          setIsHealthy(true);
          setIsChecking(false);
          return; // Stop checking once healthy
        }
      } catch (error) {
        console.log('⏳ Backend not available yet, will retry...');
      }

      // If backend is not healthy, check again after 3 seconds
      if (!isHealthy) {
        retryTimeoutId = setTimeout(checkHealth, 3000);
      }
    };

    // Start checking immediately
    checkHealth();

    return () => {
      mounted = false;
      clearTimeout(retryTimeoutId);
      clearInterval(elapsedInterval);
    };
  }, [isHealthy]);

  return { isHealthy, isChecking, elapsedSeconds };
}
