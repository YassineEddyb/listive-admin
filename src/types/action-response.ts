export type ActionResponse<T = any> =
  | {
      data: T;
      error: any;
    }
  | undefined;
