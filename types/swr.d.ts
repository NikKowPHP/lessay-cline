/* eslint-disable @typescript-eslint/no-explicit-any */
// ROO-AUDIT-TAG :: plan-004-progress-tracking.md :: Declare SWR module
declare module 'swr' {
  const useSWR: <Data = any, Error = any>(
    key: string,
    fetcher?: (url: string) => Promise<Data>,
    options?: {
      refreshInterval?: number;
      revalidateOnFocus?: boolean;
      dedupingInterval?: number;
    }
  ) => {
    data?: Data;
    error?: Error;
    isLoading: boolean;
  };

  export default useSWR;
}
// ROO-AUDIT-TAG :: plan-004-progress-tracking.md :: END