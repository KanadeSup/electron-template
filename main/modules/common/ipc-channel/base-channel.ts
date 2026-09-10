export type BaseChannel<ReqT, ResT> = {
  name: string;
  handle: (req: ReqT) => Promise<ResT>;
};

export function createChannel<ReqT, ResT>(params: BaseChannel<ReqT, ResT>) {
  return params;
}

export type EventChannel<ReqT, ResT> = {
  name: string;
  handle: (event: Electron.IpcMainInvokeEvent, req: ReqT) => Promise<ResT>;
};

export type EventSender = <T>(name: string, data: T) => void;
export type SenderChannel<ReqT, ResT> = {
  name: string;
  handle: (sender: EventSender, req: ReqT) => Promise<ResT>;
};

export function createSenderChannel<ReqT, ResT>(
  params: SenderChannel<ReqT, ResT>,
): EventChannel<ReqT, ResT> {
  return {
    name: params.name,
    handle: (event, req) => {
      const sender = createEventSender(event.sender);
      return params.handle(sender, req);
    },
  };
}

function createEventSender(webContents: Electron.WebContents): EventSender {
  return <T>(name: string, data: T) => {
    if (webContents.isDestroyed()) return;
    webContents.send(name, data);
  };
}
