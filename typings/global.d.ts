declare namespace JSX {
  interface IntrinsicElements {
    [elem: string]: any;
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}