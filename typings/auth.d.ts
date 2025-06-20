declare module '../lib/auth' {
  export const useAuth: () => {
    startDiagnostic: () => void;
  };
}