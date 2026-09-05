export const SAY_HELLO_CHANNEL_NAME = "say-hello" as const;

export type SayHelloRequest = {
  name: string;
};

export type SayHelloResponse = {
  message: string;
};
