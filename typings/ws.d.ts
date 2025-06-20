declare module 'ws' {
  interface WebSocketOptions {
    port?: number;
    host?: string;
    path?: string;
    protocol?: string | string[];
    rejectUnauthorized?: boolean;
    clientConfig?: any;
    server?: any;
    request?: any;
    agent?: any;
    perMessageDeflate?: boolean | object;
    followRedirects?: boolean;
    maxRedirects?: number;
    headers?: any;
    family?: number;
    checkServerIdentity?: (host: string, cert: any) => void;
  }

  class WebSocket extends EventTarget {
    constructor(url: string | URL, protocols?: string | string[], options?: WebSocketOptions);
    readonly url: string;
    readonly protocol: string;
    readonly readyState: number;
    readonly bufferedAmount: number;
    readonly extensions: string;
    readonly binaryType: 'blob' | 'arraybuffer';
    set binaryType(type: 'blob' | 'arraybuffer'): void;
    readonly ON_OPEN: 'open';
    readonly ON_MESSAGE: 'message';
    readonly ON_CLOSE: 'close';
    readonly ON_ERROR: 'error';
    connect(url: string | URL, protocols?: string | string[]): void;
    send(data: any): void;
    close(code?: number, reason?: string): void;
    addEventListener(type: string, listener: (event: any) => void): void;
    removeEventListener(type: string, listener: (event: any) => void): void;
    dispatchEvent(event: Event): boolean;
  }

  export default WebSocket;
}