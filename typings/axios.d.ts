import { AxiosResponse as AxiosResponseOriginal, AxiosError as AxiosErrorOriginal } from 'axios';

declare module 'axios' {
  export interface AxiosResponse<T = any> extends AxiosResponseOriginal<T> {}
  export interface AxiosError extends AxiosErrorOriginal {}
}