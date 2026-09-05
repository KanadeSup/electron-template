import {
  SAY_HELLO_CHANNEL_NAME,
  type SayHelloRequest,
  type SayHelloResponse,
} from "@shared/contracts/hello.contract";
import { createChannel } from "../common/ipc-channel/base-channel";

export const sayHelloChannel = createChannel<SayHelloRequest, SayHelloResponse>({
  name: SAY_HELLO_CHANNEL_NAME,
  handle: async (req) => {
    return { message: `Hello, ${req.name}!` };
  },
});
