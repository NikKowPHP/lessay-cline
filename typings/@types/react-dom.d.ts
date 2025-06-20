declare namespace ReactDOM {
  function render(element: React.ReactElement, container: HTMLElement): void;
  function hydrate(element: React.ReactElement, container: HTMLElement): void;
  function unmountComponentAtNode(container: HTMLElement): boolean;
}