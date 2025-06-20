declare namespace ReactTestRenderer {
  interface Renderer {
    toJSON(): any;
    unmount(): void;
  }

  function create(rendered: React.ReactElement): Renderer;
}

declare module 'react-test-renderer' {
  export = ReactTestRenderer;
}