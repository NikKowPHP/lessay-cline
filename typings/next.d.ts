declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    [key: string]: string | undefined;
  }
}

declare namespace Next {
  namespace router {
    interface Router {
      push: (path: string) => void;
    }

    function useRouter(): Router;
  }
}