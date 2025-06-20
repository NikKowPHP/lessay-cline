declare namespace React {
  type FC<P = {}> = (props: P & { children?: ReactNode }) => ReactElement | null;

  type ReactNode = ReactElement | string | number | boolean | null | undefined | ReactNodeArray;

  type ReactElement = {
    type: string | React.FC | React.ComponentClass;
    props: { [key: string]: any };
    key: string | null;
  };

  type ReactNodeArray = ReactNode[];

  function useState<S>(initialState: S | (() => S)): [S, (newState: S | ((prevState: S) => S)) => void];
  function useState<S = undefined>(): [S | undefined, (newState: S | ((prevState: S | undefined) => S | undefined)) => void];

  interface ChangeEvent<T> extends Event {
    target: T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      ? T
      : HTMLInputElement;
  }

  interface FormEvent<T> extends Event {
    target: T;
  }
}