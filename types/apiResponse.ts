export type ApiResponse<T> = {
  code: number;
  status: string;
  meta?: unknown;
  data: T;
};
