export type BaseChannel<ReqT, ResT> = {
  name: string;
  handle: (req: ReqT) => Promise<ResT>;
};

export function createChannel<ReqT, ResT>(params: BaseChannel<ReqT, ResT>) {
  return params;
}
