declare namespace ReactTestRenderer {
  interface Renderer {
    toJSON(): any;
  }

  function create(rendered: React.ReactElement): Renderer;
}

declare module 'react-test-renderer' {
  export = ReactTestRenderer;
}