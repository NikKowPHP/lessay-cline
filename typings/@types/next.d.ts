declare namespace Next {
  interface NextPageContext {
    req?: any;
    res?: any;
    pathname: string;
    query: { [key: string]: string | string[] };
    asPath: string;
    basePath: string;
    locale?: string;
    defaultLocale?: string;
  }

  interface NextComponentType<P = {}, IP = {}> {
    (props: P, context?: NextPageContext): ReactElement | null;
    getInitialProps?: (context: NextPageContext) => Promise<P> | P;
    getServerSideProps?: (context: NextPageContext) => Promise<{ props: P }>;
    getStaticProps?: () => Promise<{ props: P }>;
    getStaticPaths?: () => Promise<{ paths: { params: { [key: string]: string } }[], fallback: boolean }>;
  }

  interface NextApiHandler {
    (req: any, res: any): void | Promise<void>;
  }
}

declare module 'next' {
  export = Next;
}