import type { Event } from "electron";

export type BaseChannel<ReqT, ResT> = {
  name: string;
  handle: (req: ReqT) => Promise<ResT>;
};

export function createChannel<ReqT, ResT>(params: BaseChannel<ReqT, ResT>) {
  return params;
}

export type BaseEventChannel<ReqT, ResT> = {
  name: string;
  handle: (event: Event, req: ReqT) => Promise<ResT>;
};

export function createEventChannel<ReqT, ResT>(params: BaseEventChannel<ReqT, ResT>) {
  return params;
}
